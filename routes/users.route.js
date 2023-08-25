const UserModel = require('../models/users.model')
const UsersRoutes = require('express').Router();
const { validateNewUserData, validateObjectId, validateUserData, isValidPhoto, isValidUserStatus, validateSort } = require('../utils/validations');
const { uploadImage, removeImage } = require('../functions');

const jwt = require('jsonwebtoken');
const { authenticateToken, checkAdmin } = require('../utils/authenticateToken');
const { ObjectId } = require('mongodb');


//NOT DONE, NEED TO HANDLE ADDRESS -- handle on client side - Handled
//V  --- V
UsersRoutes.post('/register', async (req, res) => {
    try {
        let { username, firstName, lastName, phoneNumber, email, password, address, photo } = req.body;

        // -checks if the email address is already taken by another user in the database
        let existingUser = await UserModel.readOne({ email: email });
        if (existingUser)
            return res.status(409).json({ msg: 'כתובת המייל אינה פנויה' })

        let validationRes = validateNewUserData(username, firstName, lastName, phoneNumber, email, password, address)
        if (!validationRes.valid)
            return res.status(400).json({ msg: validationRes.msg })


        let img = null;

        // -if the user chose to upload a profile picture:
        if (photo) {
            img = await uploadImage(photo);
            if (!img || !isValidPhoto(img))
                return res.status(400).json({ msg: 'התמונה שהועלתה אינה תקינה' });
        }

        let newUser = await UserModel.create(username, firstName, lastName, phoneNumber, email, password, address, img);
        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(500).json({ error: error.toString(), msg: 'הרשמה נכשלה' + error.toString() }); // !the error logging is for the debugging process
    }
});


//V --- V
UsersRoutes.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await UserModel.login(email, password);
        if (!user)
            return res.status(404).json({ msg: "משתמש לא קיים" });
        else if (user.activationStatus !== 'פעיל')
            return res.status(403).json({ user: null, msg: `משתמש ${user.activationStatus}` }); // *user is not active or has been banned by an administrator
        else {
            delete user.password; // -removes the password from the response to the client 
            let payload = {
                id: user._id,
                role: user.role
            }
            let token = jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: `${process.env.TOKEN_EXPIRATION}` }); // *expires within a certain time
            return res.status(200).json({ token, user }); // -Send the token and user data
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

UsersRoutes.get('/checkEmailAvailability/:email', async (req, res) => {
    try {
        let { email } = req.params;
        let existingUser = await UserModel.readOne({ email: email });
        if (existingUser)
            return res.status(409).json({ msg: 'כתובת המייל אינה פנויה' })
        else
            return res.status(200).json({ msg: 'כתובת המייל פנויה לשימוש' })
    } catch (error) {
        console.warn('usersroute error: get /checkEmailAvailability/:email')
        return res.status(500).json({ error: error.toString(), msg: 'שגיאה' });
    }
});



//V --- V 
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

//V -- V 
UsersRoutes.get('/search/byId/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        console.log("ID =>", _id)
        // if (!isValidObjectId(_id) || _id == null)
        //     return res.status(400).json({ msg: 'פרטים לא נכונים' });
        let user = await UserModel.readOne({ _id: new ObjectId(_id) });
        if (!user) // if(user == null || user == undefined)
            return res.status(404).json({ msg: "משתמש לא קיים" });
        else
            return res.status(200).json(user); // returns the document of the user as a json object.
    } catch (error) {
        console.warn('usersroute error: get /:_id')
        return res.status(500).json({ error: error.toString(), msg: 'שגיאה' });
    }
});

// ADD:
//search by username
//search by name (first/last/both)
//search by location (city, county, etc)


//V --- V
UsersRoutes.get('/search/:username', authenticateToken, async (req, res) => {
    try {
        let { username } = req.params;
        let validationRes = validateUserData({ username: username });
        if (!validationRes.valid)
            return res.status(400).json({ msg: validationRes.msg });
        let user = await UserModel.readOne({ username: username });
        if (!user)
            return res.status(404).json({ msg: 'משתמש לא נמצא' });
        else
            return res.status(200).json(user);
    } catch (error) {
        console.warn('usersroute error: get /search/:username')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});



//V ---- v 
UsersRoutes.put('/editUser/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        let { updatedData } = req.body;
        let validationRes = validateUserData(updatedData);
        // if (!isValidObjectId(_id) || _id == null || !validationRes.valid)
        //     return res.status(400).json({ msg: validationRes.msg || 'פרטים לא תקינים' });
        if (!updatedData || !validationRes.valid)
            return res.status(400).json({ msg: validationRes.msg || "לא התקבלו פרטים לעדכון" });
        let data = await UserModel.update(_id, updatedData);
        return res.status(200).json(data);

    } catch (error) {
        console.warn('usersroute error: put /editUser/:_id')
        return res.status(500).json({ error: error.toString(), msg: 'שגיאה' });
    }
});

//V --- V
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

//V --- V also deletes the former profile picture
UsersRoutes.put('/:_id/changePicture', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        let { newPhoto, photo } = req.body;
        // if (!isValidObjectId(_id) || _id == null)
        //     return res.status(400).json({ msg: 'פרטים לא נכונים' });
        let imgStr = `data:image/jpg;base64,${newPhoto}` // sent as base64 string from the client
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


//V ---- V also deletes the user's profile picture
UsersRoutes.delete('/delete/:_id', authenticateToken, checkAdmin, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        let userId = new ObjectId(_id)
        // if (!isValidObjectId(_id) || _id == null)
        //     return res.status(400).json({ msg: 'פרטים לא נכונים' });
        const user = await UserModel.readOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ msg: 'משתמש לא קיים במערכת' });
        }
        if (user.photo)
            await removeImage(user.photo);
        await UserModel.delete(userId);
        return res.status(200).json({ msg: 'משתמש נמחק בהצלחה' });
    } catch (error) {
        console.warn('usersroute error: delete /delete/:_id')
        return res.status(500).json({ error: error.toString(), msg: 'שגיאה' });
    }
});


//Necessary???
//V
UsersRoutes.get('/allUsers/:sortBy/:order', authenticateToken, async (req, res) => {
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