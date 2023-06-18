const UserModel = require('../models/UserModel');
const UsersRoutes = require('express').Router();
//require address model (the address object is created first)


//NOT DONE, NEED TO HANDLE ADDRESS
UsersRoutes.post('/register', async (req, res) => {
    try {
        let { username, firstName, lastName, email, password, address, photo } = req.body;
        let newUser = await UserModel.Register(username, email, password);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error });
    }
});