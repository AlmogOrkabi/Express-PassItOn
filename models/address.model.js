const DB = require('../utils/DB');

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
            type: "Point",
            coordinates: [longitude, latitude]
        }
    }

    static async create(region, city, street, house, apartment, notes, longitude, latitude) {
        let newAddress = new AddressModel(region, city, street, house, apartment, notes, longitude, latitude);
        return await new DB().insert('addresses', { ...newAddress });
    }

    static async read(id) {
        return await new DB().findOne('addresses', { _id: id });
    }

    static async update(id, updateData) {
        return await new DB().updateOne('addresses', { _id: id }, updateData);
    }

    static async delete(id) {
        return await new DB().deleteOne('addresses', { _id: id });
    }

}

module.exports = AddressModel;