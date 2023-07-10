const { ObjectId } = require('mongodb');
const DB = require('../utils/DB');
const collection = 'reports';

const { isValidObjectId } = require('../utils/validations');

class ReportModel {
    owner_id;
    reportType;
    userReported;
    postReported;
    status;
    verdict;
    photos;
    creationDate;


    constructor(owner_id, reportType, userReported, postReported, photos = []) {
        this.owner_id = ObjectId(owner_id);
        this.reportType = reportType;
        this.userReported = ObjectId(userReported);
        this.postReported = postReported ? ObjectId(postReported) : null;
        this.status = "Submitted";
        this.photos = photos;
        this.creationDate = new Date();
        this.verdict = null;
    }


    static async create(owner_id, reportType, userReported, postReported, photos) {
        if (!isValidObjectId(owner_id) || !isValidObjectId(userReported) || !isValidObjectId(postReported)) {
            throw new Error('Invalid ObjectId');
        }
        let newReport = new ReportModel(owner_id, reportType, userReported, postReported, photos);
        return await new DB().insert(collection, { ...newReport });
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

    static async readByOwner(owner_id) {
        if (!isValidObjectId(owner_id)) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().findAll(collection, { owner_id: owner_id });
    }

    static async readByUserReported(userReported) {
        if (!isValidObjectId(userReported)) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().findAll(collection, { userReported: userReported });
    }

    static async readByPostReported(postReported) {
        if (!isValidObjectId(postReported)) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().findAll(collection, { postReported: postReported });
    }


    static async readByStatus(status) {
        //validate status (switch case?)
        return await new DB().findAll(collection, { status: status });
    }

    //find all V
    //find by owner V
    //find by user reported V 
    //find by post reported V 
    //find by location *********
    //find by status V 
    //find by verdict *??????*


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




module.exports = ReportModel;