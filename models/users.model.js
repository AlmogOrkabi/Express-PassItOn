const { ObjectId } = require('mongodb');
const DB = require('../utils/DB');
const bcrypt = require('bcrypt');
const collection = 'users';

const { isValidObjectId } = require('../utils/validations');
const AddressModel = require('./address.model');

class UserModel {
    _id;
    username;
    firstName;
    lastName;
    phoneNumber;
    email;
    password;
    address_id;
    photo;
    registrationDate;
    activationStatus;
    role; //user / admin


    constructor(username, firstName, lastName, phoneNumber, email, password, addressId, photo) {
        if (!isValidObjectId(addressId)) {
            throw new Error('Invalid ObjectId');
        }
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.password = password;
        this.address_id = new ObjectId(addressId);
        this.photo = photo;
        this.registrationDate = new Date();
        this.activationStatus = 'פעיל';
        this.role = 'user'
    }


    // additional methods:

    //add a new user to the DB:

    static async create(username, firstName, lastName, phoneNumber, email, password, addressId, photo) {

        let newUser = new UserModel(username, firstName, lastName, phoneNumber, email, password, addressId, photo);
        newUser.password = await bcrypt.hash(newUser.password, 10);
        return await new DB().insert(collection, { ...newUser }); //returns the response from the database (successful or failed)
    }

    static async login(email, password) {
        let query = { email: email }
        const user = await new DB().findOne(collection, query);
        if (!user || !(await bcrypt.compare(password, user.password)))
            return null;

        if (user.address_id) {
            user.address = await AddressModel.readOne({ _id: user.address_id });
        }
        return user;
    }

    static async read(query = {}) {
        for (let key in query) {
            if (key.endsWith('_id') && (!isValidObjectId(query[key]))) {
                throw new Error(`Invalid ObjectId for ${key}`);
            }
        }
        return await new DB().findAll(collection, query, { password: 0 }); // returns the entire user data excluding the password.
    }

    static async readFull(query = {}) {
        for (let key in query) {
            if (key.endsWith('_id') && (!isValidObjectId(query[key]))) {
                throw new Error(`Invalid ObjectId for ${key}`);
            }
        }
        const users = await new DB().findAll(collection, query, { password: 0 }); // returns the entire user data excluding the password.

        const fullUsers = await Promise.all(users.map(async user => {
            if (user.address_id) {
                user.address = await AddressModel.readOne({ _id: user.address_id })
            }
            return user
        }));

        return fullUsers;
    }

    static async readOne(query = {}) {
        for (let key in query) {
            if (key.endsWith('_id') && (!isValidObjectId(query[key]))) {
                throw new Error(`Invalid ObjectId for ${key}`);
            }
        }
        return await new DB().findOne(collection, query, { password: 0 }); // returns the entire user data excluding the password.
    }




    static async readOneFull(query = {}) {
        for (let key in query) {
            if (key.endsWith('_id') && (!isValidObjectId(query[key]))) {
                throw new Error(`Invalid ObjectId for ${key}`);
            }
        }
        const user = await new DB().findOne(collection, query, { password: 0 }); // returns the entire user data excluding the password.

        if (user.address_id) {
            user.address = await AddressModel.readOne({ _id: user.address_id });
        }

        return user;
    }
    //get all users
    // static async read() {
    //     return await new DB().findAll(collection);
    // }


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
        if (updatedData.password) {
            updatedData.password = await bcrypt.hash(updatedData.password, 10)
        }
        return await new DB().updateById(collection, _id, updatedData);
    }

    static async delete(id) {
        if (!isValidObjectId(id)) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().deleteOne(collection, id);
    }

    static async sort(sortBy, order) {
        return await new DB().sort(collection, sortBy, order);
    }


    //other methods to to be added:
}


module.exports = UserModel;