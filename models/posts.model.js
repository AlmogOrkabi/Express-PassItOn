const { ObjectId } = require('mongodb');
const DB = require('../utils/DB');
const collection = 'posts';

const { isValidObjectId } = require('../utils/validations');

class PostModel {
    owner_id;
    itemName;
    description;
    photos;
    status;
    creationDate;
    itemLocation_id; //address ID
    reports;


    constructor(owner_id, itemName, description, itemLocation, photos = [],) {
        if (!isValidObjectId(owner_id) || !isValidObjectId(itemLocation)) {
            throw new Error('Invalid ObjectId');
        }
        this.owner_id = owner_id;
        this.itemName = itemName;
        this.description = description;
        this.photos = photos;
        this.status = "available";
        this.itemLocation_id = ObjectId(itemLocation);
        this.creationDate = new Date();
        this.reports = []; //new post, no reports yet.
    }


    static async create(owner_id, itemName, description, itemLocation, photos = []) {
        let newPost = new PostModel(owner_id, itemName, description, itemLocation, photos);
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
            if (key.endsWith('_id') && (!isValidObjectId(query[key]) || query[key] == null)) {
                throw new Error(`Invalid ObjectId for ${key}`);
            }
        }
        return await new DB().findAll(collection, query);
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


    static async readByDistance(maxDistance, userCoordinates, itemName = null) {
        let query = {
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: userCoordinates
                    },
                    $maxDistance: maxDistance
                }
            }
        }

        let results = await new DB().findAll('addresses', query, { _id: 1 })
        let locations = results.map(location => location._id); //an array of objectIds , $in cannot work with the original results.

        let query2 = {
            itemLocation: { $in: locations }
        }
        if (itemName) query2.$text = { $search: itemName };

        return await new DB().findAll(collection, query2);
    }


    static async readByCity(city) {
        let results = await new DB().findAll('addresses', { city: city }, { _id: 1 });
        let locations = results.map(location => location._id); //an array of objectIds , $in cannot work with the original results.
        let query2 = {
            itemLocation: { $in: locations }, //searches for the location id saved inside the posts
        }
        return await new DB().findAll(collection, query2);
    }

    // read() to search all V
    //read(id) to find posts by user V 
    //find posts by aviailability(or by status for reusability) V
    //find posts by location ******** V - NEED TO CHECK!!!
    // find posts by name / keyword.s V










    static async update(id, updateData) {
        if (!isValidObjectId(id)) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().updateOne(collection, { _id: id }, updateData);
    }

    static async delete(id) {
        if (!isValidObjectId(id)) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().deleteOne(collection, { _id: id });
    }

}

module.exports = PostModel;