const { ObjectId } = require('mongodb');
const DB = require('../utils/DB');
const { isValidObjectId } = require('../utils/validations');
const collection = 'addresses';

class AddressModel {
    region;
    city;
    street;
    house;
    apartment;
    //ADD:
    //floor
    notes;
    location;
    simplifiedAddress;

    constructor(region, city, street, house, apartment, notes, simplifiedAddress, longitude, latitude) {
        this.region = region;
        this.city = city;
        this.street = street;
        this.house = house;
        this.apartment = apartment;
        this.notes = notes;
        this.simplifiedAddress = simplifiedAddress;
        this.location = {
            type: "Point", // a data type of mongodb 
            coordinates: [Number(longitude), Number(latitude)]
        }
    }

    static async create(region, city, street, house, apartment, notes, simplifiedAddress, longitude, latitude) {
        let newAddress = new AddressModel(region, city, street, house, apartment, notes, simplifiedAddress, longitude, latitude);
        return await new DB().insert(collection, { ...newAddress });
    }

    // static async readOne(id) {
    //     if (!isValidObjectId(id) || id == null) {
    //         throw new Error('Invalid ObjectId');
    //     }
    //     return await new DB().findOne(collection, { _id: id });
    // }

    static async readOne(query = {}) {
        for (let key in query) {
            if (key.endsWith('_id') && (!isValidObjectId(query[key]))) {
                throw new Error(`Invalid ObjectId for ${key}`);
            }
        }
        return await new DB().findOne(collection, query); // returns the entire user data excluding the password.
    }

    static async read(query = {}) {
        for (let key in query) {
            if (key.endsWith('_id') && (!isValidObjectId(query[key]))) {
                throw new Error(`Invalid ObjectId for ${key}`);
            }
        }
        return await new DB().findAll(collection, query); // returns the entire user data excluding the password.
    }

    static async update(id, updateData) {
        if (!isValidObjectId(id)) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().updateById(collection, new ObjectId(id), updateData);
    }

    static async delete(id) {
        return await new DB().deleteOne(collection, id);
    }

}

module.exports = AddressModel;