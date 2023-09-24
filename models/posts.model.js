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
    //ADD:
    updateDate
    itemLocation_id; //address ID
    reports;
    recipient_id;


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

    static async read(query = {}) {
        for (let key in query) {
            if (key.endsWith('_id') && (!isValidObjectId(query[key]))) {
                throw new Error(`Invalid ObjectId for ${key}`);
            }
        }

        //return await new DB().findAll(collection, query);
        const posts = await new DB().findAll(collection, query);
        const postsWithAddress = await Promise.all(posts.map(async post => {
            if (post.itemLocation_id) {
                post.address = await AddressModel.readOne({ _id: post.itemLocation_id });
            }
            return post;
        }));
        return postsWithAddress;
    }

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

        //return await new DB().findOne(collection, query);

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
        let query = {};

        // Basic Filters
        if (params.owner_id) query.owner_id = params.owner_id;
        if (params.status) query.status = params.status;
        if (params.itemName) query.$text = { $search: params.itemName };
        if (params.itemLocation_id) query.itemLocation_id = params.itemLocation_id;
        if (params.category) query.category = params.category;

        // Search by Keywords
        if (params.keywords) query.$text = { $search: params.keywords };

        // Search by Distance
        if (params.maxDistance && params.userCoordinates) {
            const coordinatesArray = params.userCoordinates.split(',');
            // console.log("maxDistance: " + params.maxDistance, "userCoordinates: " + params.userCoordinates, typeof params.userCoordinates, "   ", typeof coordinatesArray)
            let results = await new DB().findAll('addresses', {
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [Number(coordinatesArray[0]), Number(coordinatesArray[1])]
                        },
                        $maxDistance: Number(params.maxDistance) * 1000 //kilometers to meters
                    }
                }
            }, { _id: 1 });
            let locations = results.map(location => location._id);
            query.itemLocation_id = { $in: locations };
        }
        else
            // Search by City
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







    // //**CHECK***!
    // static async readByKeywords(keywords) {
    //     //add some form of validation --- ???
    //     return await new DB().findAll(collection, { $text: { $search: keywords } });
    // }

    // static async readByCategoryAndKeywords(category, keywords) {
    //     //add some form of validation --- ???
    //     return await new DB().findAll(collection, { category: category, $text: { $search: keywords } });
    // }


    // static async readByDistance(maxDistance, userCoordinates, itemName = null) {
    //     console.log("posts model ==>> coordinates:",)
    //     let query = {
    //         location: {
    //             $near: {
    //                 $geometry: {
    //                     type: "Point",
    //                     coordinates: [Number(userCoordinates[0]), Number(userCoordinates[1])]
    //                 },
    //                 $maxDistance: Number(maxDistance) * 1000 //kilometers to meters
    //             }
    //         }
    //     }

    //     let results = await new DB().findAll('addresses', query, { _id: 1 })
    //     console.log('results:', results);
    //     let locations = results.map(location => location._id); //an array of objectIds , $in cannot work with the original results.
    //     console.log('locations:', locations);
    //     let query2 = {
    //         itemLocation_id: { $in: locations }
    //     }
    //     if (itemName) query2.$text = { $search: itemName };

    //     return await new DB().findAll(collection, query2);
    // }


    // static async readByCity(city, itemName) {
    //     let results = await new DB().findAll('addresses', { city: city }, { _id: 1 });
    //     let locations = results.map(location => location._id); //an array of objectIds , $in cannot work with the original results.
    //     let query2 = {
    //         itemLocation_id: { $in: locations }, //searches for the location id saved inside the posts
    //     }
    //     if (itemName) query2.$text = { $search: itemName };

    //     return await new DB().findAll(collection, query2);
    // }

    // read() to search all V
    //read(id) to find posts by user V 
    //find posts by aviailability(or by status for reusability) V
    //find posts by location ******** V - NEED TO CHECK!!!
    // find posts by name / keyword.s V




    static async updateMany(query, updatedData) {
        // if (!isValidObjectId(_id)) {
        //     throw new Error('Invalid ObjectId');
        // }
        // for (let key in updatedData) {
        //     if (key.endsWith('_id')) {
        //         console.log(`key: ${key}, value: ${updatedData[key]}`);
        //         if ((!isValidObjectId(updatedData[key])))
        //             throw new Error(`Invalid ObjectId for ${key}`);
        //         else
        //             updatedData[key] = new ObjectId(updatedData[key]);
        //     }
        // }

        return await new DB().updateMany(collection, query, updatedData);
    }






    static async update(_id, updatedData) {
        // if (!isValidObjectId(_id)) {
        //     throw new Error('Invalid ObjectId');
        // }
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

                // Add more cases for other types of statistics
                default:
                    throw new Error('Invalid statistic type');
            }

            return await new DB().aggregate(collection, pipeline);
        } catch (error) {
            console.error(`Error in UserModel.getStatistics: ${error}`);
            throw error;
        }


    }

}

module.exports = PostModel;