const { MongoClient, ObjectId } = require('mongodb');

class DB {
    db_uri;
    db_name;
    client;

    constructor() {
        this.db_uri = process.env.DB_URI;
        this.db_name = process.env.DB_NAME;
        this.client = new MongoClient(this.db_uri);
    }


    async findAll(collection, query = {}, project = {}) {
        try {
            console.log("QUERY =>", query)
            await this.client.connect();
            return await this.client.db(this.db_name).collection(collection).find(query).project(project).toArray();
        } catch (error) {
            console.log(`\x1b[42m%s\x1b[0m`, error); //prtins the error in green so it'll be easier to understand where it occurred.
            throw error;
        }
        finally {
            await this.client.close();
        }
    }


    // query = {}, project = {} = if there's no parameter, initialize it to an empty object
    // we open the acces to the database in the try and close it immidately after use inside the finally (never keep the connection more than necessary for security reasons)
    // all methods MUST be asynchronous - we cannnot know how long it'll take the database to respond to the request


    async findOne(collection, query = {}, project = {}) {
        try {
            await this.client.connect();
            return await this.client.db(this.db_name).collection(collection).findOne(query, { projection: project });
        } catch (error) {
            console.log(`\x1b[42m%s\x1b[0m`, error); //prtins the error in green so it'll be easier to understand where it occurred.
            throw error;
        }
        finally {
            await this.client.close();
        }
    }

    async insert(collection, doc) {
        try {
            await this.client.connect();
            return await this.client.db(this.db_name).collection(collection).insertOne(doc);
        } catch (error) {
            console.log(`\x1b[42m%s\x1b[0m`, error); //prtins the error in green so it'll be easier to understand where it occurred.
            throw error;
        }
        finally {
            await this.client.close();
        }
    }

    async updateById(collection, id, doc) {
        try {
            await this.client.connect();
            const objectId = new ObjectId(id); //to be absolutely sure the id being passed is indeeed an objectId.
            return await this.client.db(this.db_name).collection(collection).updateOne(
                { _id: objectId },
                { $set: { ...doc } });
        } catch (error) {
            console.log(`\x1b[42m%s\x1b[0m`, error); //prtins the error in green so it'll be easier to understand where it occurred.
            console.error(error.stack);
            throw error;
        }
        finally {
            await this.client.close();
        }
    }



    async updateMany(collection, query, updateData) {
        try {
            await this.client.connect();
            return await this.client.db(this.db_name).collection(collection).updateMany(query, updateData);
        } catch (error) {
            console.log(`\x1b[42m%s\x1b[0m`, error);
            console.error(error.stack);
            throw error;
        } finally {
            await this.client.close();
        }
    }





    async deleteOne(collection, id) {
        try {
            await this.client.connect();
            const objectId = new ObjectId(id); //here
            return await this.client.db(this.db_name).collection(collection).deleteOne({ _id: objectId });
        } catch (error) {
            console.log(`\x1b[42m%s\x1b[0m`, error); //prtins the error in green so it'll be easier to understand where it occurred.
            throw error;
        } finally {
            await this.client.close();
        }
    }


    async aggregate(collection, pipeline) {
        try {
            await this.client.connect();
            return await this.client.db(this.db_name).collection(collection).aggregate(pipeline).toArray();
        } catch (error) {
            console.log(`\x1b[42m%s\x1b[0m`, error); //prtins the error in green so it'll be easier to understand where it occurred.
            throw error;

        } finally {
            await this.client.close();
        }
    }

    async sort(collection, sortby, order) {
        try {
            await this.client.connect();
            return await this.client.db(this.db_name).collection(collection).find().sort({ [sortby]: order }).toArray();
        } catch (error) {
            console.log(`\x1b[42m%s\x1b[0m`, error); //prtins the error in green so it'll be easier to understand where it occurred.
            throw error;
        } finally {
            await this.client.close();
        }
    }


    async count(collection) {
        try {
            await this.client.connect();
            return await this.client.db(this.db_name).collection(collection).countDocuments();
        } catch (error) {
            console.log(`\x1b[42m%s\x1b[0m`, error); //prtins the error in green so it'll be easier to understand where it occurred.
            throw error;
        } finally {
            await this.client.close();
        }
    }
}




module.exports = DB;