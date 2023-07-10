const DB = require('../utils/DB');
const { isValidObjectId } = require('../utils/validations');
const collection = 'addresses';

class AddressModel {
    region;
    city;
    street;
    house;
    apartment;
    notes;
    location;

    constructor(region, city, street, house, apartment, notes, longitude, latitude) {
        this.region = region;
        this.city = city;
        this.street = street;
        this.house = house;
        this.apartment = apartment;
        this.notes = notes;
        this.location = {
            type: "Point", // a data type of mongodb 
            coordinates: [longitude, latitude]
        }
    }

    static async create(region, city, street, house, apartment, notes, longitude, latitude) {
        let newAddress = new AddressModel(region, city, street, house, apartment, notes, longitude, latitude);
        return await new DB().insert(collection, { ...newAddress });
    }

    static async read(id) {
        if (!isValidObjectId(id)) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().findOne(collection, { _id: id });
    }

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

module.exports = AddressModel;