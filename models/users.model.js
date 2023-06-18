const DB = require('../utils/DB');
const bcrypt = require('bcrypt');

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
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.addressId = addressId;
        this.photo = photo;
        this.registrationDate = new Date();
        this.activationStatus = true;
    }


    // additional methods:

    //add a new user to the DB:

    static async create(username, firstName, lastName, email, password, addressId = null, photo = null) {

        let newUser = new UserModel(username, firstName, lastName, email, password, addressId, photo);
        newUser.password = await bcrypt.hash(newUser.password, 10);
        return await new DB().Insert('users', { ...newUser }); //returns the response from the database (successful or failed)
    }

    static async login(email, password) {
        let query = { email: email }
        let user = await new DB().findOne("Users", query);
        if (!user || !(await bcrypt.compare(password, user.password)))
            return null;

        return {
            _id: user._id,
            username: user.username,
            email: user.email
        };
    }

    // methods to edit, delete, retrieve users:
}


module.exports = UserModel;