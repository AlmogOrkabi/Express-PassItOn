const { ObjectId } = require('mongodb');
const DB = require('../utils/DB');
const bcrypt = require('bcrypt');
const collection = 'users';

const { isValidObjectId } = require('../utils/validations');

class UserModel {
    _id;
    username;
    firstName;
    lastName;
    email;
    password;
    addressId;
    photo;
    registrationDate;
    activationStatus;


    constructor(username, firstName, lastName, email, password, addressId = null, photo = null) {
        if (!isValidObjectId(addressId)) {
            throw new Error('Invalid ObjectId');
        }
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.addressId = ObjectId(addressId);
        this.photo = photo;
        this.registrationDate = new Date();
        this.activationStatus = true;
    }


    // additional methods:

    //add a new user to the DB:

    static async create(username, firstName, lastName, email, password, addressId = null, photo = null) {

        let newUser = new UserModel(username, firstName, lastName, email, password, addressId, photo);
        newUser.password = await bcrypt.hash(newUser.password, 10);
        return await new DB().Insert(collection, { ...newUser }); //returns the response from the database (successful or failed)
    }

    static async login(email, password) {
        let query = { email: email }
        let user = await new DB().findOne(collection, query);
        if (!user || !(await bcrypt.compare(password, user.password)))
            return null;

        return {
            _id: user._id,
            username: user.username,
            email: user.email
        };
    }

    static async read(id) {
        if (!isValidObjectId(id)) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().findOne(collection, { _id: id });
    }

    //get all users
    static async read() {
        return await new DB().findAll(collection);
    }


    static async update(id, updateData) {
        if (!isValidObjectId(id)) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().updateById(collection, { _id: id }, updateData);
    }

    static async delete(id) {
        if (!isValidObjectId(id)) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().deleteOne(collection, { _id: id });
    }

    static async sort(sortBy, order) {
        return await new DB().sort(collection, sortBy, order);
    }


    //other methods to to be added:
}


module.exports = UserModel;