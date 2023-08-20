const { ObjectId } = require('mongodb');
const DB = require('../utils/DB');
const collection = 'requests';

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

    static async readOne(query = {}) {
        for (let key in query) {
            if (key.endsWith('_id') && (!isValidObjectId(query[key]))) {
                throw new Error(`Invalid ObjectId for ${key}`);
            }
        }
        return await new DB().findOne(collection, query);
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
            throw new Error(`Invalid ObjectId`);
        }
        return await new DB().deleteOne(collection, _id);
    }


}

module.exports = RequestModel;