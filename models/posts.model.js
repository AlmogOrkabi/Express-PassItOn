const { ObjectId } = require('mongodb');
const DB = require('../utils/DB');
const collection = 'posts';
const AddressModel = require('./address.model');
const UserModel = require('./users.model');

const { isValidObjectId } = require('../utils/validations');

class PostModel {
    owner_id;
    itemName;
    description;
    category;
    photos;
    status;
    creationDate;
    updateDate
    itemLocation_id; //address ID
    reports;
    recipient_id; //* the ID of the user who received the item


    constructor(owner_id, itemName, description, category, photos, itemLocation) {
        if (!isValidObjectId(owner_id) || !isValidObjectId(itemLocation)) {
            throw new Error('Invalid ObjectId');
        }
        this.owner_id = new ObjectId(owner_id);
        this.itemName = itemName;
        this.description = description;
        this.category = category;
        this.photos = photos;
        this.status = "זמין";
        this.itemLocation_id = new ObjectId(itemLocation);
        this.creationDate = new Date();
        this.updatedDate = new Date();
        this.reports = []; //new post, no reports yet.
        this.recipient_id = null;
    }


    static async create(owner_id, itemName, description, category, photos, itemLocation) {
        let newPost = new PostModel(owner_id, itemName, description, category, photos, itemLocation);
        return await new DB().insert(collection, { ...newPost });
    }


    //~ basic search - returns only the post with the address
    static async read(query = {}) {
        for (let key in query) {
            if (key.endsWith('_id') && (!isValidObjectId(query[key]))) {
                throw new Error(`Invalid ObjectId for ${key}`);
            }
        }

        //return await new DB().findAll(collection, query);
        const posts = await new DB().findAll(collection, query);
        const postsWithAddress = await Promise.all(posts.map(async post => { //* returns the post with the address document attached
            if (post.itemLocation_id) {
                post.address = await AddressModel.readOne({ _id: post.itemLocation_id });
            }
            return post;
        }));
        return postsWithAddress;
    }


    //~ returns the post with all of the accociated documents relevant to it
    static async readFull(query = {}) {
        for (let key in query) {
            if (key.endsWith('_id') && (!isValidObjectId(query[key]))) {
                throw new Error(`Invalid ObjectId for ${key}`);
            }
        }

        //return await new DB().findAll(collection, query);
        const posts = await new DB().findAll(collection, query);
        const postsFull = await Promise.all(posts.map(async post => {
            if (post.itemLocation_id) {
                post.address = await AddressModel.readOne({ _id: post.itemLocation_id });
            }
            if (post.owner_id) {
                post.owner = await UserModel.readOne({ _id: post.owner_id });
            }
            return post;
        }));
        return postsFull;
    }


    static async readOne(query = {}) {
        for (let key in query) {
            if (key.endsWith('_id') && (!isValidObjectId(query[key]))) {
                throw new Error(`Invalid ObjectId for ${key}`);
            }
        }

        //return await new DB().findOne(collection, query);

        const post = await new DB().findOne(collection, query);
        if (post && post.itemLocation_id) {
            post.address = await AddressModel.readOne({ _id: post.itemLocation_id });
        }
        return post;
    }

    static async readOneFull(query = {}) {
        for (let key in query) {
            if (key.endsWith('_id') && (!isValidObjectId(query[key]))) {
                throw new Error(`Invalid ObjectId for ${key}`);
            }
        }

        const post = await new DB().findOne(collection, query);
        if (post && post.itemLocation_id) {
            post.address = await AddressModel.readOne({ _id: post.itemLocation_id });
        }
        if (post && post.owner_id) {
            post.owner = await UserModel.readOne({ _id: post.owner_id });
        }
        return post;
    }

    static async searchPosts(params) {
        let query = {}; //* builds the search query for the DB according to the request parameters from the client

        //- Basic Filters
        if (params.owner_id) query.owner_id = new ObjectId(params.owner_id);
        if (params.status) query.status = params.status;
        if (params.itemName) query.$text = { $search: params.itemName };
        if (params.itemLocation_id) query.itemLocation_id = new ObjectId(params.itemLocation_id);
        if (params.category) query.category = params.category;

        //- Search by Keywords
        if (params.keywords) query.$text = { $search: params.keywords };

        //- Search by Distance

        //*searches for the relevant addresses in the DB according to the user's location (coordinates) and the max distance from it.

        if (params.maxDistance && params.userCoordinates) {

            //* Split the userCoordinates string into an array of latitude and longitude
            const coordinatesArray = params.userCoordinates.split(',');
            // // console.log("maxDistance: " + params.maxDistance, "userCoordinates: " + params.userCoordinates, typeof params.userCoordinates, "   ", typeof coordinatesArray)
            let results = await new DB().findAll('addresses', {
                location: {
                    $near: { //* $near is used to find documents close to a given point
                        $geometry: {
                            type: "Point",
                            coordinates: [Number(coordinatesArray[0]), Number(coordinatesArray[1])]
                        },
                        $maxDistance: Number(params.maxDistance) * 1000 //* Converts maxDistance from kilometers to meters
                    }
                }
            }, { _id: 1 }); //* returns an array of IDs representing the relevant addresses in the DB

            //* extracts the IDs of the  addresses
            let locations = results.map(location => location._id);


            //* Uses the extracted IDs to filter posts that are located within these addresses
            query.itemLocation_id = { $in: locations };
        }
        else
            //- Search by City
            if (params.city) {
                let results = await new DB().findAll('addresses', { city: params.city }, { _id: 1 });
                let locations = results.map(location => location._id);
                query.itemLocation_id = { $in: locations };
            }
        // console.log("posts query", query);
        const posts = await new DB().findAll(collection, query);
        // console.log("results", posts)
        if (params.full) {
            const postsFull = await Promise.all(posts.map(async post => {
                if (post.itemLocation_id) {
                    post.address = await AddressModel.readOne({ _id: post.itemLocation_id });
                }
                if (post.owner_id) {
                    post.owner = await UserModel.readOne({ _id: post.owner_id });
                }
                return post;
            }));
            return postsFull;
        }

        return posts;
    }

    static async updateMany(query, updatedData) {
        return await new DB().updateMany(collection, query, updatedData);
    }






    static async update(_id, updatedData) {
        for (let key in updatedData) {
            if (key.endsWith('_id')) {
                console.log(`key: ${key}, value: ${updatedData[key]}`);
                if ((!isValidObjectId(updatedData[key])))
                    throw new Error(`Invalid ObjectId for ${key}`);
                else
                    updatedData[key] = new ObjectId(updatedData[key]);
            }
        }

        return await new DB().updateById(collection, new ObjectId(_id), updatedData);
    }

    static async delete(_id) {
        if (!isValidObjectId(_id)) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().deleteOne(collection, _id);
    }




    static async getStatistics(type, options = {}) {
        try {
            let query = {};
            let pipeline = [];

            switch (type) {
                case 'postsByCity':
                    pipeline = [
                        {
                            $lookup: {
                                from: 'addresses',
                                localField: 'itemLocation_id', // field from the 'posts' collection
                                foreignField: '_id', // field from the 'addresses' collection
                                as: 'address' // array containing matching documents from the 'addresses' collection
                            }
                        },
                        {
                            $unwind: '$address' // deconstruct the 'address' array field, outputting one document for each element
                        },
                        { $match: query },
                        { $group: { _id: "$address.city", count: { $sum: 1 } } },
                        { $sort: { count: -1 } }
                    ];
                    break;
                case 'postsByStatus':
                    pipeline = [
                        { $match: query },
                        { $group: { _id: "$status", count: { $sum: 1 } } },
                        { $sort: { count: -1 } }
                    ];
                    break;
                case 'postsByCategory':
                    pipeline = [
                        { $match: query },
                        { $group: { _id: "$category", count: { $sum: 1 } } },
                        { $sort: { count: -1 } }
                    ];
                    break;
                case 'postsDelivered':
                    pipeline = [
                        { $match: query },
                        {
                            $group: {
                                _id: {
                                    $cond: [ //condition : 
                                        { $eq: ["$status", "נמסר"] }, //equals 
                                        "נמסר",                       // True: Use "נמסר" as the grouping key
                                        "לא נמסר"                   // False: Use "לא נמסר" as the grouping key
                                    ]
                                },
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { count: -1 } }
                    ];
                    break;

                default:
                    throw new Error('Invalid statistic type');
            }

            return await new DB().aggregate(collection, pipeline);
        } catch (error) {
            console.error(`Error in PostModel.getStatistics: ${error}`);
            throw error;
        }
    }

    static async count() {
        try {
            return await new DB().count(collection);
        } catch (error) {
            console.log("error in count: ", error);
            throw error;
        }
    }

}

module.exports = PostModel;