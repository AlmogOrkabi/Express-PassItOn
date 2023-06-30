const { ObjectId } = require('mongodb');
const DB = require('../utils/DB');

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
        return await new DB().insert('reports', { ...newReport });
    }

    static async read(id) {
        if (!isValidObjectId(id)) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().findOne('reports', { _id: id });
    }

    static async update(id, updateData) {
        if (!isValidObjectId(id)) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().updateOne('reports', { _id: id }, updateData);
    }

    static async delete(id) {
        if (!isValidObjectId(id)) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().deleteOne('reports', { _id: id });
    }

}




module.exports = ReportModel;