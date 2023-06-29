const { ObjectId } = require('mongodb');
const DB = require('../utils/DB');

function isValidObjectId(id) {
    return id === null || (/^[0-9a-fA-F]{24}$/).test(id);
}

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
        return await new DB().insert('posts', { ...newPost });
    }

    static async read(id) {
        if (!isValidObjectId(id)) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().findOne('posts', { _id: id });
    }

    static async update(id, updateData) {
        if (!isValidObjectId(id)) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().updateOne('posts', { _id: id }, updateData);
    }

    static async delete(id) {
        if (!isValidObjectId(id)) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().deleteOne('posts', { _id: id });
    }

}

module.exports = PostModel;