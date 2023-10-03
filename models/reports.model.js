const { ObjectId } = require('mongodb');
const DB = require('../utils/DB');
const collection = 'reports';

const { isValidObjectId } = require('../utils/validations');
const PostModel = require('./posts.model');
const UserModel = require('./users.model');

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
    verdictDescription;

    constructor(owner_id, reportType, userReported, postReported, photos = [], description) {
        this.owner_id = new ObjectId(owner_id);
        this.reportType = reportType;
        this.userReported_id = new ObjectId(userReported);
        this.postReported_id = postReported ? new ObjectId(postReported) : null;
        this.status = "פתוח";
        this.photos = photos;
        this.creationDate = new Date();
        this.verdict = null;
        this.description = description;
        this.updateDate = new Date();
        this.verdictDescription = null;
    }

    // static async create(owner_id, reportType, userReported, postReported, photos, description) {
    //     if (!isValidObjectId(owner_id) || !isValidObjectId(userReported) || userReported == null || !isValidObjectId(postReported)) {
    //         throw new Error('Invalid ObjectId');
    //     }
    //     let newReport = new ReportModel(owner_id, reportType, userReported, postReported, photos, description);
    //     return await new DB().insert(collection, { ...newReport });
    // }



    static async create(owner_id, reportType, userReported, postReported, photos, description) {
        if (!isValidObjectId(owner_id) || !isValidObjectId(userReported) || postReported !== null && !isValidObjectId(postReported)) { //the postReported can be null because the report could be specifically about a user without a post being involved
            throw new Error('Invalid ObjectId');
        }
        let newReport = new ReportModel(owner_id, reportType, userReported, postReported, photos, description);
        return await new DB().insert(collection, { ...newReport });
    }

    static async read(query = {}) {
        for (let key in query) {
            if (key.endsWith('_id') && (!isValidObjectId(query[key]))) {
                throw new Error(`Invalid ObjectId for ${key}`);
            }
        }
        return await new DB().findAll(collection, query);
    }

    static async readFull(query = {}) {
        for (let key in query) {
            if (key.endsWith('_id') && (!isValidObjectId(query[key]))) {
                throw new Error(`Invalid ObjectId for ${key}`);
            }
        }
        const reports = await new DB().findAll(collection, query);

        const fullReports = await Promise.all(reports.map(async report => {
            if (report.postReported_id) {
                report.post = await PostModel.readOne({ _id: report.postReported_id })
            }
            if (report.userReported_id) {
                report.userReported = await UserModel.readOne({ _id: report.userReported_id });
            }
            return report;
        }));
        return fullReports;
    }


    static async readOne(query = {}) {
        for (let key in query) {
            if (key.endsWith('_id') && (!isValidObjectId(query[key]))) {
                throw new Error(`Invalid ObjectId for ${key}`);
            }
        }
        return await new DB().findOne(collection, query);
    }

    static async readOneFull(query = {}) {
        for (let key in query) {
            if (key.endsWith('_id') && (!isValidObjectId(query[key]))) {
                throw new Error(`Invalid ObjectId for ${key}`);
            }
        }
        const report = await new DB().findOne(collection, query);
        if (report.postReported_id)
            report.post = await PostModel.readOne({ _id: report.postReported_id })
        if (report.userReported_id)
            report.userReported = await UserModel.readOne({ _id: report.userReported_id });

        return report;
    }




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

    static async updateMany(query, updatedData) {


        return await new DB().updateMany(collection, query, updatedData);
    }




    static async update(_id, updateData) {
        if (!isValidObjectId(_id)) {
            throw new Error('Invalid ObjectId');
        }
        updateData.updateDate = new Date();
        return await new DB().updateById(collection, new ObjectId(_id), updateData);
    }




    static async delete(_id) {
        if (!isValidObjectId(_id)) {
            throw new Error('Invalid ObjectId');
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




module.exports = ReportModel;