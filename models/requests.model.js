const { ObjectId } = require('mongodb');
const DB = require('../utils/DB');
const collection = 'requests';
const UserModel = require('./users.model');
const PostModel = require('./posts.model');

const { isValidObjectId } = require('../utils/validations');

class RequestModel {
    _id;
    sender_id;
    recipient_id;
    requestMessage;
    status;
    responseMessage;
    post_id;
    creationDate;
    updateDate;

    constructor(sender_id, recipient_id, requestMessage, post_id) {
        if (!isValidObjectId(sender_id) || !isValidObjectId(recipient_id) || !isValidObjectId(post_id)) {
            throw new Error('Invalid ObjectId');
        }

        this.sender_id = new ObjectId(sender_id);
        this.recipient_id = new ObjectId(recipient_id);
        this.requestMessage = requestMessage;
        this.status = 'נשלח'
        this.responseMessage = null; // not yet handled by the recipient
        this.post_id = new ObjectId(post_id);
        this.creationDate = new Date();
        this.updateDate = new Date();
    }

    static async create(sender_id, recipient_id, requestMessage, post_id) {
        let newRequest = new RequestModel(sender_id, recipient_id, requestMessage, post_id);
        return await new DB().insert(collection, { ...newRequest });
    }


    static async read(query = {}) {
        for (let key in query) {
            if (key.endsWith('_id') && (!isValidObjectId(query[key]))) {
                throw new Error(`Invalid ObjectId for ${key}`);
            }
        }
        return await new DB().findAll(collection, query);


    }

    //gets the document along with all the other documents attached.
    static async readFull(query = {}) {
        for (let key in query) {
            if (key.endsWith('_id') && (!isValidObjectId(query[key]))) {
                throw new Error(`Invalid ObjectId for ${key}`);
            }
        }
        const requests = await new DB().findAll(collection, query);

        // Fetch additional data for each request
        const fullRequests = await Promise.all(requests.map(async request => {
            if (request.sender_id) {
                request.sender = await UserModel.readOne({ _id: request.sender_id });
            }
            if (request.recipient_id) {
                request.recipient = await UserModel.readOne({ _id: request.recipient_id });
            }
            if (request.post_id) {
                request.post = await PostModel.readOne({ _id: request.post_id });
            }
            return request;
        }));

        return fullRequests;
    }




    static async readOne(query = {}) {
        for (let key in query) {
            if (key.endsWith('_id') && (!isValidObjectId(query[key]))) {
                throw new Error(`Invalid ObjectId for ${key}`);
            }
        }

        return await new DB().findOne(collection, query);

    }

    //gets the document along with all the other documents attached.
    static async readOneFull(query = {}) {
        for (let key in query) {
            if (key.endsWith('_id') && (!isValidObjectId(query[key]))) {
                throw new Error(`Invalid ObjectId for ${key}`);
            }
        }

        //return await new DB().findOne(collection, query);
        const request = await new DB().findOne(collection, query);
        if (request.sender_id)
            request.sender = await UserModel.readOne({ _id: request.sender_id });
        if (request.recipient_id)
            request.recipient = await UserModel.readOne({ _id: request.recipient_id });
        if (request.post_id)
            request.post = await PostModel.readOne({ _id: request.post_id });

        return request;
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

    static async updateMany(query = {}, updateData) {

        return await new DB().updateMany(collection, query, updateData);
    }

    static async delete(_id) {
        if (!isValidObjectId(_id)) {
            throw new Error(`Invalid ObjectId`);
        }
        return await new DB().deleteOne(collection, _id);
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

module.exports = RequestModel;