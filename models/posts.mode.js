const DB = require('../utils/DB');

class PostModel {
    owner_id;
    itemName;
    description;
    photos;
    status;
    creationDate;
    itemLocation; //address ID
    reports;


    constructor(owner_id, itemName, description, photos = [], itemLocation) {
        this.owner_id = owner_id;
        this.itemName = itemName;
        this.description = description;
        this.photos = photos;
        this.status = "available";
        this.creationDate = new Date();
        this.itemLocation = itemLocation;
        this.reports = []; //new post, no reports yet.
    }


    static async create(owner_id, itemName, description, photos = [], itemLocation) {
        let newPost = new PostModel(owner_id, itemName, description, photos, itemLocation);
        return await new DB().insert('posts', { ...newPost });
    }

    static async read(id) {
        return await new DB().findOne('posts', { _id: id });
    }

    static async update(id, updateData) {
        return await new DB().updateOne('posts', { _id: id }, updateData);
    }

    static async delete(id) {
        return await new DB().deleteOne('posts', { _id: id });
    }

}

module.exports = PostModel;