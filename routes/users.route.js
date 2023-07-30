const UserModel = require('../models/users.model')
const UsersRoutes = require('express').Router();
const { validateNewUserData, validateObjectId, validateUserData, isValidPhoto, isValidUserStatus, validateSort } = require('../utils/validations');
const { uploadImage, removeImage } = require('../functions');

const jwt = require('jsonwebtoken');
const { authenticateToken, checkAdmin } = require('../utils/authenticateToken');


//NOT DONE, NEED TO HANDLE ADDRESS -- handle on client side

//V
UsersRoutes.post('/register', async (req, res) => {
    try {
        let { username, firstName, lastName, email, password, address, photo } = req.body;
        let img = null;
        if (photo) {
            let imgStr = `data:image/jpg;base64,${photo}` // sent as base64 string from the client
            img = await uploadImage(imgStr);
            if (!img)
                return res.status(400).json({ msg: 'העלאת התמונה נכשלה' });
        }
        let validationRes = validateNewUserData(username, firstName, lastName, email, password, address, img)
        if (!validationRes.valid)
            return res.status(400).json({ msg: validationRes.msg || 'פרטים לא תקינים' })
        let newUser = await UserModel.create(username, firstName, lastName, email, password, address, img);
        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(500).json({ error, msg: 'הרשמה נכשלה' });
    }
});


//V
UsersRoutes.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await UserModel.login(email, password);
        if (!user) // if(user == null || user == undefined)
            return res.status(404).json({ msg: "פרטים לא נכונים" });
        else if (user.activationStatus === 'not active')
            return res.status(403).json({ user: null, msg: "משתמש לא פעיל / חסום" }); // user is not active or has been banned by an administrator
        else {
            delete user.password;
            let payload = {
                id: user._id,
                role: user.role
                // Add other user data you want to include in the token
            }
            let token = jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '30m' }); // Token expires 30 minuets
            return res.status(200).json({ token, user }); // Send the token and user data
        }
    } catch (error) {
        return res.status(500).json({ error, msg: 'התחברות נכשלה' });
    }
});




//V -- without JWT
// UsersRoutes.post('/login', async (req, res) => {
//     try {
//         let { email, password } = req.body;
//         let user = await UserModel.login(email, password);
//         if (!user) // if(user == null || user == undefined)
//             return res.status(404).json({ msg: "פרטים לא נכונים" });
//         else if (user.status === 'not active')
//             return res.status(403).json({ msg: "משתמש לא פעיל / חסום" }); // user is not active or has been banned by an administrator
//         else
//             return res.status(200).json(user); // returns the document of the user as a json object. // ????exclude the password????
//     } catch (error) {
//         return res.status(500).json({ error, msg: 'התחברות נכשלה' });
//     }
// });




//V
UsersRoutes.get('/allUsers', authenticateToken, async (req, res) => {
    try {
        let users = await UserModel.read();
        if (!Array.isArray(users) || users.length === 0)
            return res.status(400).json({ msg: "שגיאה בייבוא נתונים" }); // או לא קיימים משתמשים
        else
            return res.status(200).json(users);
    } catch (error) {
        console.warn('usersroute error: get /users')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});

//V
UsersRoutes.get('/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        // if (!isValidObjectId(_id) || _id == null)
        //     return res.status(400).json({ msg: 'פרטים לא נכונים' });
        let user = await UserModel.read({ _id: _id });
        if (!user) // if(user == null || user == undefined)
            return res.status(404).json({ msg: "משתמש לא קיים" });
        else
            return res.status(200).json(user); // returns the document of the user as a json object.
    } catch (error) {
        console.warn('usersroute error: get /:_id')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});

// ADD:
//search by username
//search by name (first/last/both)
//search by location (city, county, etc)

UsersRoutes.get('/search/:username', authenticateToken, async (req, res) => {
    try {
        let { username } = req.params;
        let validationRes = validateUserData({ username: username });
        if (!validationRes.valid)
            return res.status(400).json({ msg: validationRes.msg });
        let user = UserModel.read({ username: username });
        if (!user)
            return res.status(404).json({ msg: 'משתמש לא נמצא' });
        else
            return res.status(200).json(user);
    } catch (error) {
        console.warn('usersroute error: get /search/:username')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});



//V
UsersRoutes.put('/editUser/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        let { updatedData } = req.body;
        //if (!isValidObjectId(_id) || id == null || validateUserData(...updatedData)) // assuming that the data will be the whole object with updated details
        let validationRes = validateUserData(updatedData);
        // if (!isValidObjectId(_id) || _id == null || !validationRes.valid)
        //     return res.status(400).json({ msg: validationRes.msg || 'פרטים לא תקינים' });
        if (!validationRes.valid)
            return res.status(400).json({ msg: validationRes.msg });
        let data = await UserModel.update(_id, updatedData);
        return res.status(200).json(data);

    } catch (error) {
        console.warn('usersroute error: put /editUser/:_id')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});


UsersRoutes.put('/:_id/updateStatus', authenticateToken, checkAdmin, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        let { activationStatus } = req.body;
        let validationRes = isValidUserStatus(activationStatus);
        if (!validationRes.valid)
            return res.status(403).json({ msg: validationRes.msg });
        let data = await UserModel.update(_id, { activationStatus: activationStatus })
        return res.status(200).json(data);
    } catch (error) {
        console.warn('usersroute error: put /:_id/updateStatus')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
})

//V 
UsersRoutes.put('/:_id/changePicture', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        let { photo } = req.body;
        // if (!isValidObjectId(_id) || _id == null)
        //     return res.status(400).json({ msg: 'פרטים לא נכונים' });
        let imgStr = `data:image/jpg;base64,${photo}` // sent as base64 string from the client
        let img = await uploadImage(imgStr);
        if (!isValidPhoto(img))
            return res.status(400).json({ msg: 'העלאת התמונה נכשלה' });
        let data = await UserModel.update(_id, { photo: img });
        if (data)
            await removeImage(photo);
        return res.status(200).json(data);
    } catch (error) {
        console.warn('usersroute error: put /:_id/changePicture')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});


//V - make sure the user being deleted exists?
UsersRoutes.delete('/delete/:_id', authenticateToken, checkAdmin, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        // if (!isValidObjectId(_id) || _id == null)
        //     return res.status(400).json({ msg: 'פרטים לא נכונים' });
        await UserModel.delete(_id);
        return res.status(200).json({ msg: 'user deleted successfully' }); // **check if the user is found or not? **
    } catch (error) {
        console.warn('usersroute error: delete /delete/:_id')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});


//Necessary???
//V
UsersRoutes.get('/users/:sortBy/:order', authenticateToken, async (req, res) => {
    try {
        let { sortBy, order } = req.params
        let validationRes = validateSort(sortBy, order);
        if (!validationRes.valid)
            return res.status(400).json({ msg: validationRes.msg });
        let users = await UserModel.sort(sortBy, order);
        if (!Array.isArray(users) || users.length === 0)
            return res.status(404).json({ msg: "לא נמצאו משתמשים מתאימים" });
        return res.status(200).json(users);
    } catch (error) {
        console.warn('usersroute error: get /users/:sortBy/:order')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});



// *********token********* */

//REQUEST EXAMPLE FOR THE CLIENT SIDE:
// fetch('http://your-api-url/protected-endpoint', {
//     method: 'GET',
//     headers: {
//         'Authorization': `Bearer ${yourAccessToken}`,
//         // other headers as necessary...
//     },
// })
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch((error) => console.error('Error:', error));





module.exports = UsersRoutes;