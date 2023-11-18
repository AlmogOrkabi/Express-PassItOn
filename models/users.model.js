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
    role; // user || admin


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



    static async create(username, firstName, lastName, phoneNumber, email, password, addressId, photo) {

        let newUser = new UserModel(username, firstName, lastName, phoneNumber, email, password, addressId, photo);
        newUser.password = await bcrypt.hash(newUser.password, 10);
        return await new DB().insert(collection, { ...newUser }); // returns the response from the database (successful or failed)
    }

    static async login(email, password) {
        let query = { email: email }
        const user = await new DB().findOne(collection, query);
        if (!user || !(await bcrypt.compare(password, user.password))) //* user doesnt exist or the password is incorrect
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
        return await new DB().findAll(collection, query, { password: 0 }); //* returns the entire user data excluding the password.
    }

    static async readFull(query = {}) {
        for (let key in query) {
            if (key.endsWith('_id') && (!isValidObjectId(query[key]))) {
                throw new Error(`Invalid ObjectId for ${key}`);
            }
        }
        const users = await new DB().findAll(collection, query, { password: 0 }); //* returns the entire user data excluding the password.

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
        return await new DB().findOne(collection, query, { password: 0 }); //* returns the entire user data excluding the password.
    }




    static async readOneFull(query = {}) {
        for (let key in query) {
            if (key.endsWith('_id') && (!isValidObjectId(query[key]))) {
                throw new Error(`Invalid ObjectId for ${key}`);
            }
        }
        const user = await new DB().findOne(collection, query, { password: 0 }); //* returns the entire user data excluding the password.

        if (user.address_id) {
            user.address = await AddressModel.readOne({ _id: user.address_id });
        }

        return user;
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
        if (updatedData.password) { //* if the user chose to change the password:
            updatedData.password = await bcrypt.hash(updatedData.password, 10) //*  encrypting the new password
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



    static async getStatistics(type, options = {}) {
        try {
            let query = {};
            let pipeline = [];


            switch (type) {
                case 'usersByCity':
                    pipeline = [
                        {
                            $lookup: {
                                from: 'addresses',
                                localField: 'address_id', // field from the 'users' collection
                                foreignField: '_id', // field from the 'addresses' collection
                                as: 'address' // array containing matching documents from the 'addresses' collection
                            }
                        },
                        {
                            $unwind: '$address' // deconstruct the 'address' array field, outputting one document for each element
                        },
                        { $match: query },
                        { $group: { _id: "$address.city", count: { $sum: 1 } } },
                        { $sort: { count: -1 } }
                    ];
                    break;
                case 'userStatus':
                    pipeline = [
                        { $match: query },
                        { $group: { _id: "$activationStatus", count: { $sum: 1 } } },
                        { $sort: { count: -1 } }
                    ];
                    break;
                case 'userPosts':
                    pipeline = [
                        {
                            $lookup: {
                                from: 'posts',
                                localField: '_id',
                                foreignField: 'owner_id',
                                as: 'posts'
                            }
                        },
                        {
                            $project: {
                                numberOfPosts: { $size: "$posts" }
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    hasPosted: {
                                        $cond: [{ $gt: ["$numberOfPosts", 0] }, "Has Posted", "Has Not Posted"]
                                    }
                                },
                                count: { $sum: 1 }
                            }
                        }
                    ];
                    break;

                default:
                    throw new Error('Invalid statistic type');
            }

            return await new DB().aggregate(collection, pipeline);
        } catch (error) {
            console.error(`Error in UserModel.getStatistics: ${error}`);
            throw error;
        }
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


module.exports = UserModel;