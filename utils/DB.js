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


    //here will be all the search methods:

    //example:

    async FindAll(collection, query = {}, project = {}) {
        try {
            await this.client.connect();
            return await this.client.db(this.db_name).collection(collection).find(query, project).toArray();
        } catch (error) {
            throw error;
        }
        finally {
            await this.client.close();
        }
    }

    //query = {}, project = {} = if there's no parameter, initialize it to an empty object
    //we open the acces to the database in the try and close it immidately after use inside the finally (never keep the connection more than necessary for security reasons)
    //all methods MUST be asynchronous - we cannnot know how long it'll take the database to respond to the request

    async findOne(collection, query = {}, project = {}) {
        try {
            await this.client.connect();
            return await this.client.db(this.db_name).collection(collection).findOne(query, project);
        } catch (error) {
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
            throw error;
        }
        finally {
            await this.client.close();
        }
    }

    async updateById(collection, id, doc) {
        try {
            await this.client.connect();
            console.log({ ...doc });
            return await this.client.db(this.db_name).collection(collection).updateOne(
                { _id: new ObjectId(id) },
                { $set: { ...doc } });
        } catch (error) {
            throw error;
        }
        finally {
            await this.client.close();
        }
    }



}