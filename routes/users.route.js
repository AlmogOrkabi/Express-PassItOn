const UserModel = require('../models/UserModel');
const UsersRoutes = require('express').Router();
const { validateUserData } = require('../utils/validations');


//NOT DONE, NEED TO HANDLE ADDRESS -- handle on client side
UsersRoutes.post('/register', async (req, res) => {
    try {
        let { username, firstName, lastName, email, password, address, photo } = req.body;
        validateUserData(username, firstName, lastName, email, password, address, photo);
        //upload the photo to cloudinary
        let newUser = await UserModel.create(username, firstName, lastName, email, password, address, photo);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'הרשמה נכשלה' });
    }
});


UsersRoutes.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await UserModel.login(email, password);
        if (!user) // if(user == null || user == undefined)
            res.status(401).json({ msg: "פרטים לא נכונים" });
        else
            res.status(200).json(user); // returns the document of the user as a json object.
    } catch (error) {
        res.status(500).json({ error, msg: 'התחברות נכשלה' });
    }
});

UsersRoutes.get('/users', async (req, res) => {
    try {
        let users = await UserModel.read();
        if (!users)
            res.status(401).json({ msg: "שגיאה בייבוא נתונים" });
        else
            res.status(200).json(users);
    } catch (error) {
        console.warn('usersroute error: get /users')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});


UsersRoutes.get('/:_id', async (req, res) => {
    try {
        let { _id } = req.params;
        let user = await UserModel.read(_id);
        if (!user) // if(user == null || user == undefined)
            res.status(404).json({ msg: "משתמש לא קיים" });
        else
            res.status(200).json(user); // returns the document of the user as a json object.
    } catch (error) {
        console.warn('usersroute error: get /user/:username')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});

UsersRoutes.put('/:_id', async (req, res) => {
    try {
        let { _id } = req.params;
        let { updatedData } = req.body;

        let data = await UserModel.update(_id, updatedData);
        res.status(200).json(data);

    } catch (error) {
        console.warn('usersroute error: put /:_id')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});

UsersRoutes.delete('/delete/:_id', async (req, res) => {
    try {
        let { _id } = req.params;
        await UserModel.delete(_id);
        res.status(200).json({ msg: 'user deleted successfully' }); // **check if the user is found or not? **
    } catch (error) {
        console.warn('usersroute error: put :username/:_id')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});

UsersRoutes.get('/users/:sortBy/:order', async (req, res) => {
    try {
        let { sortBy, order } = req.params
        let users = await UserModel.sort(sortBy, order);
        res.status(200).json(users);
    } catch (error) {
        console.warn('usersroute error: get /users/:sortBy/:order')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});

// *********token********* */

// require('dotenv').config();

// const jwt = require('jsonwebtoken'); 

// UsersRoutes.post('/login', async (req, res) => {
//     try {
//         let { email, password } = req.body;
//         let user = await UserModel.login(email, password);
//         if (!user) // if(user == null || user == undefined)
//         { res.status(401).json({ msg: "incorrect details" }); }
//         else {
//             const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN);
//             res.status(200).json({ accessToken: accessToken }); // returns the document of the user as a json object.
//         }
//     }
//     catch (error) {
//         res.status(500).json({ error });
//     }
// });

// UsersRoutes.get('/user', authenticateToken, async (req, res) => {
//     res.json(user)
// });

// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (token == null) return res.sendStatus(401);

//     jwt.verify(token, process.env.ACCESS_TOKEN, (error, user) => {
//         if (error) return res.sendStatus(403);
//         req.user = user;
//         next(); // like  a return, returns the user inside req parameter.

//     });
// }




module.exports = UsersRoutes;