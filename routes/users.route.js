const UserModel = require('../models/UserModel');
const UsersRoutes = require('express').Router();
//require address model (the address object is created first)


//NOT DONE, NEED TO HANDLE ADDRESS
UsersRoutes.post('/register', async (req, res) => {
    try {
        let { username, firstName, lastName, email, password, address, photo } = req.body;
        validateUserData();
        //upload the photo to cloudinary
        let newUser = await UserModel.create(username, firstName, lastName, email, password, address, photo);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error });
    }
});

UsersRoutes.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await UserModel.login(email, password);
        if (!user) // if(user == null || user == undefined)
            res.status(401).json({ msg: "incorrect details" });
        else
            res.status(200).json(user); // returns the document of the user as a json object.
    } catch (error) {
        res.status(500).json({ error });
    }
});

// UsersRoutes.post('/users/:id', async (req, res) => {

// });

module.exports = UsersRoutes;