const { ObjectId } = require('mongodb');
const DB = require('../utils/DB');
const collection = 'reports';

const { isValidObjectId } = require('../utils/validations');

class ReportModel {
    owner_id;
    reportType;
    userReported_id;
    postReported_id;
    description;
    status;
    verdict;
    photos;
    creationDate;
    updateDate; // for the stages of handling the report // initialized to the creation date


    constructor(owner_id, reportType, userReported, postReported, photos = [], description) {
        this.owner_id = new ObjectId(owner_id);
        this.reportType = reportType;
        this.userReported_id = new ObjectId(userReported);
        this.postReported_id = postReported ? new ObjectId(postReported) : null;
        this.status = "Submitted";
        this.photos = photos;
        this.creationDate = new Date();
        this.verdict = null;
        this.description = description;
        this.updateDate = new Date();
    }


    static async create(owner_id, reportType, userReported, postReported, photos, description) {
        if (!isValidObjectId(owner_id) || owner_id == null || !isValidObjectId(userReported) || userReported == null || !isValidObjectId(postReported)) {
            throw new Error('Invalid ObjectId');
        }
        let newReport = new ReportModel(owner_id, reportType, userReported, postReported, photos);
        return await new DB().insert(collection, { ...newReport });
    }

    static async read(query) {
        for (let key in query) {
            if (key.endsWith('_id') && (!isValidObjectId(query[key]) || query[key] == null)) {
                throw new Error(`Invalid ObjectId for ${key}`);
            }
        }
        return await new DB().findAll(collection, query);
    }



    // static async read(id) {
    //     if (!isValidObjectId(id) || id == null) {
    //         throw new Error('Invalid ObjectId');
    //     }
    //     return await new DB().findOne(collection, { _id: id });
    // }

    static async read() {
        return await new DB().findAll(collection);
    }

    // static async readByOwner(owner_id) {
    //     if (!isValidObjectId(owner_id) || owner_id == null) {
    //         throw new Error('Invalid ObjectId');
    //     }
    //     return await new DB().findAll(collection, { owner_id: owner_id });
    // }

    // static async readByUserReported(userReported) {
    //     if (!isValidObjectId(userReported) || userReported == null) {
    //         throw new Error('Invalid ObjectId');
    //     }
    //     return await new DB().findAll(collection, { userReported_id: userReported });
    // }

    // static async readByPostReported(postReported) {
    //     if (!isValidObjectId(postReported) || postReported == null) {
    //         throw new Error('Invalid ObjectId');
    //     }
    //     return await new DB().findAll(collection, { postReported_id: postReported });
    // }


    // static async readByStatus(status) {
    //     //validate status (switch case?) -V => validation on the route
    //     return await new DB().findAll(collection, { status: status });
    // }

    //find all V
    //find by owner V
    //find by user reported V 
    //find by post reported V 
    //find by location *********
    //find by status V 
    //find by verdict *??????*


    static async update(id, updateData) {
        if (!isValidObjectId(id) || id == null) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().updateOne(collection, { _id: id }, updateData);
    }

    static async delete(id) {
        if (!isValidObjectId(id) || id == null) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().deleteOne(collection, { _id: id });
    }

}




module.exports = ReportModel;