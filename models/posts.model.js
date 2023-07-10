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
    itemLocation; //address ID
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
        this.itemLocation = ObjectId(itemLocation);
        this.creationDate = new Date();
        this.reports = []; //new post, no reports yet.
    }


    static async create(owner_id, itemName, description, itemLocation, photos = []) {
        let newPost = new PostModel(owner_id, itemName, description, itemLocation, photos);
        return await new DB().insert(collection, { ...newPost });
    }

    static async read(id) {
        if (!isValidObjectId(id)) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().findOne(collection, { _id: id });
    }


    static async read() {
        return await new DB().findAll(collection);
    }

    //find all posts by a specific user
    static async readAll(id) {
        if (!isValidObjectId(id)) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().findAll(collection, { _id: id });
    }

    static async readByStatus(status) {
        //validate status (switch case?)
        return await new DB().findAll(collection, { status: status });
    }

    static async readByKeywords(keywords) {
        //add some form of validation --- ???
        return await new DB().findAll(collection, { keywords: keywords }); s
    }
    // read() to search all V
    //read(id) to find posts by user V 
    //find posts by aviailability(or by status for reusability) V
    //find posts by location ********
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