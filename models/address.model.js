const DB = require('../utils/DB');

function isValidObjectId(id) {
    return id === null || (/^[0-9a-fA-F]{24}$/).test(id);
}

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
        return await new DB().insert('addresses', { ...newAddress });
    }

    static async read(id) {
        if (!isValidObjectId(id)) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().findOne('addresses', { _id: id });
    }

    static async update(id, updateData) {
        if (!isValidObjectId(id)) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().updateOne('addresses', { _id: id }, updateData);
    }

    static async delete(id) {
        if (!isValidObjectId(id)) {
            throw new Error('Invalid ObjectId');
        }
        return await new DB().deleteOne('addresses', { _id: id });
    }

}

module.exports = AddressModel;