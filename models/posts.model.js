const { ObjectId } = require('mongodb');
const DB = require('../utils/DB');
const collection = 'posts';
const AddressModel = require('./address.model');

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
    }


    static async create(owner_id, itemName, description, category, photos, itemLocation) {
        let newPost = new PostModel(owner_id, itemName, description, category, photos, itemLocation);
        return await new DB().insert(collection, { ...newPost });
    }

    // static async read(id) {
    //     if (!isValidObjectId(id) || id == null) {
    //         throw new Error('Invalid ObjectId');
    //     }
    //     return await new DB().findOne(collection, { _id: id });
    // }


    // static async read() {
    //     return await new DB().findAll(collection);
    // }


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

    //find all posts by a specific user
    // static async readAll(id) {
    //     if (!isValidObjectId(id) || id == null) {
    //         throw new Error('Invalid ObjectId');
    //     }
    //     return await new DB().findAll(collection, { owner_id: id });
    // }

    // static async readByStatus(status) {
    //     //validate status (switch case?)
    //     return await new DB().findAll(collection, { status: status });
    // }

    // static async readByKeywords(keywords) {
    //     //add some form of validation --- ???
    //     return await new DB().findAll(collection, { keywords: keywords });
    // }


    //**CHECK***!
    static async readByKeywords(keywords) {
        //add some form of validation --- ???
        return await new DB().findAll(collection, { $text: { $search: keywords } });
    }

    static async readByCategoryAndKeywords(category, keywords) {
        //add some form of validation --- ???
        return await new DB().findAll(collection, { category: category, $text: { $search: keywords } });
    }


    static async readByDistance(maxDistance, userCoordinates, itemName = null) {
        console.log("posts model ==>> coordinates:",)
        let query = {
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [Number(userCoordinates[0]), Number(userCoordinates[1])]
                    },
                    $maxDistance: Number(maxDistance) * 1000 //kilometers to meters
                }
            }
        }

        let results = await new DB().findAll('addresses', query, { _id: 1 })
        console.log('results:', results);
        let locations = results.map(location => location._id); //an array of objectIds , $in cannot work with the original results.
        console.log('locations:', locations);
        let query2 = {
            itemLocation_id: { $in: locations }
        }
        if (itemName) query2.$text = { $search: itemName };

        return await new DB().findAll(collection, query2);
    }


    static async readByCity(city, itemName) {
        let results = await new DB().findAll('addresses', { city: city }, { _id: 1 });
        let locations = results.map(location => location._id); //an array of objectIds , $in cannot work with the original results.
        let query2 = {
            itemLocation_id: { $in: locations }, //searches for the location id saved inside the posts
        }
        if (itemName) query2.$text = { $search: itemName };

        return await new DB().findAll(collection, query2);
    }

    // read() to search all V
    //read(id) to find posts by user V 
    //find posts by aviailability(or by status for reusability) V
    //find posts by location ******** V - NEED TO CHECK!!!
    // find posts by name / keyword.s V










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

}

module.exports = PostModel;