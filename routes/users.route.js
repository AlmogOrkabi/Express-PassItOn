const UserModel = require('../models/users.model')
const UsersRoutes = require('express').Router();
const { validateNewUserData, validateObjectId, validateUserData, isValidPhoto, isValidUserStatus, validateSort, isValidUserRole } = require('../utils/validations');
const { uploadImage, removeImage, closeAllUserActivities } = require('../functions');

const jwt = require('jsonwebtoken');
const { authenticateToken, checkAdmin } = require('../utils/authenticateToken');
const { ObjectId } = require('mongodb');
const AddressModel = require('../models/address.model')
const cookie = require('cookie');



//!ignore, an example for later
// // Centralized error handling
// UsersRoutes.use((error, req, res, next) => {
//     console.warn(error.message);
//     return res.status(500).json({ error: error.toString(), msg: 'שגיאה' });
// });

// // Centralized response handler
// const sendResponse = (res, statusCode, data) => {
//     return res.status(statusCode).json(data);
// };
//!




//V  --- V
UsersRoutes.post('/register', async (req, res) => {
    try {
        let { username, firstName, lastName, phoneNumber, email, password, address, photo } = req.body;

        // -checks if the email address is already taken by another user in the database
        let existingUser = await UserModel.readOne({ email: email });
        if (existingUser)
            return res.status(409).json({ error: 'TAKEN', msg: 'כתובת המייל אינה פנויה' })

        let validationRes = validateNewUserData(username, firstName, lastName, phoneNumber, email, password, address)
        if (!validationRes.valid)
            return res.status(400).json({ error: 'INVALID_DETAILS', msg: validationRes.msg })


        let img = null;

        // -if the user chose to upload a profile picture:
        if (photo) {
            img = await uploadImage(photo);
            if (!img || !isValidPhoto(img))
                return res.status(400).json({ error: 'INVALID_PHOTO', msg: 'התמונה שהועלתה אינה תקינה' });
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
        let { email, password, managementLogin } = req.body;
        let user = await UserModel.login(email, password);
        if (!user)
            return res.status(404).json({ error: 'NOT_FOUND', msg: "משתמש לא קיים" });
        else if (user.activationStatus !== 'פעיל')
            return res.status(403).json({ error: 'INACTIVE_USER', user: null, msg: `משתמש ${user.activationStatus}` }); // *user is not active or has been banned by an administrator
        else {
            if (managementLogin && user.role !== 'admin') {
                return res.status(403).json({ error: 'UNAUTHORIZED', msg: 'אינך מורשה גישה למערכת' })
            }
            delete user.password; // -removes the password from the response to the client 
            let payload = {
                id: user._id,
                role: user.role
            }
            let token = jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: `${process.env.TOKEN_EXPIRATION}` }); // *expires within a certain time
            if (managementLogin) {
                const cookieOptions = {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                    path: '/',
                }
                const cookieString = cookie.serialize('token', token, cookieOptions);

                //set the cookie in the response header:
                res.setHeader('Set-Cookie', cookieString);

                return res.status(200).json({ user });
            }
            return res.status(200).json({ token, user }); // -Send the token and user data
        }
    } catch (error) {
        return res.status(500).json({ error, msg: 'התחברות נכשלה' });
    }
});


UsersRoutes.get('/checkEmailAvailability/:email', async (req, res) => {
    try {
        let { email } = req.params;
        let existingUser = await UserModel.readOne({ email: email });
        if (existingUser)
            return res.status(409).json({ error: 'TAKEN', msg: 'כתובת המייל אינה פנויה' })
        else
            return res.status(200).json({ msg: 'כתובת המייל פנויה לשימוש' })
    } catch (error) {
        console.warn('usersroute error: get /checkEmailAvailability/:email')
        return res.status(500).json({ error: error.toString(), msg: 'שגיאה' });
    }
});

UsersRoutes.get('/search', authenticateToken, async (req, res) => {
    try {
        const { _id, username, firstName, lastName, phoneNumber, email, role, full } = req.query;
        let filter = {};
        if (_id) filter._id = new ObjectId(_id);
        if (username) filter.username = username;
        if (firstName) filter.firstName = firstName;
        if (lastName) filter.lastName = lastName;
        if (phoneNumber) filter.phoneNumber = phoneNumber;
        if (email) filter.email = email;
        if (role) filter.role = role;

        let users;
        if (full == 'true') {
            users = await UserModel.readFull(filter);
        }
        else {
            users = await UserModel.read(filter);
        }

        if (!Array.isArray(users) || users.length == 0)
            return res.status(404).json({ error: 'NOT_FOUND', msg: 'לא נמצאו משתמשים מתאימים' });

        else
            return res.status(200).json(users);
        s
    } catch (error) {
        console.warn('users route error: get /')
        return res.status(500).json({ error, msg: error.toString() });
    }
});






//V --- V
UsersRoutes.put('/:_id/updateStatus', authenticateToken, checkAdmin, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        let { activationStatus } = req.body;
        let validationRes = isValidUserStatus(activationStatus);
        if (!validationRes.valid)
            return res.status(400).json({ error: 'INVALID_DETAILS', msg: validationRes.msg });
        let data = await UserModel.update(new ObjectId(_id), { activationStatus: activationStatus })
        if (activationStatus !== 'פעיל') {
            await closeAllUserActivities(new ObjectId(_id)); // closes all the reports/requests/posts of the user if they are banned
        }
        return res.status(200).json(data);
    } catch (error) {
        console.warn('usersroute error: put /:_id/updateStatus')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
})
UsersRoutes.put('/:_id/changeUserRole', authenticateToken, checkAdmin, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        let { role } = req.body;
        const validationRes = isValidUserRole(role);
        if (!validationRes.valid)
            return res.status(400).json({ error: 'INVALID_DETAILS', msg: validationRes.msg });
        let data = await UserModel.update(new ObjectId(_id), { role: role })
        return res.status(200).json(data);
    } catch (error) {
        console.warn('usersroute error: put /:_id/updateStatus')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
})


//V ---- v 
UsersRoutes.put('/edit/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        let { updatedData } = req.body;
        let { newPhoto, photo, ...restOfUpdatedData } = updatedData;
        let user = await UserModel.readOne({ _id: new ObjectId(_id) })
        if (!user)
            return res.status(404).json({ error: 'NOT_FOUND', msg: 'משתמש לא קיים במערכת' });
        let validationRes = validateUserData(restOfUpdatedData);
        if (!updatedData || !validationRes.valid)
            return res.status(400).json({ error: 'INVALID_DETAILS', msg: validationRes.msg || "לא התקבלו פרטים לעדכון" });
        if (newPhoto) {
            // let imgStr = `data:image/jpg;base64,${newPhoto}`; // sent as base64 string from the client
            let img = await uploadImage(newPhoto);
            if (!isValidPhoto(img))
                return res.status(400).json({ error: 'INVALID_PHOTO', msg: 'העלאת התמונה נכשלה' });
            restOfUpdatedData.photo = img; // Update the photo in the data to be updated
            if (photo) await removeImage(photo);
        }
        if (updatedData.address_id)
            await AddressModel.delete(new ObjectId(user.address_id));
        let data = await UserModel.update(_id, restOfUpdatedData);
        return res.status(200).json(data);

    } catch (error) {
        console.warn('usersroute error: put /editUser/:_id')
        console.log(error)
        console.log(error.toString())
        console.log(error.message)
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


// //Necessary???
// //V
// UsersRoutes.get('/allUsers/:sortBy/:order', authenticateToken, async (req, res) => {
//     try {
//         let { sortBy, order } = req.params
//         let validationRes = validateSort(sortBy, order);
//         if (!validationRes.valid)
//             return res.status(400).json({ msg: validationRes.msg });
//         let users = await UserModel.sort(sortBy, order);
//         if (!Array.isArray(users) || users.length === 0)
//             return res.status(404).json({ msg: "לא נמצאו משתמשים מתאימים" });
//         return res.status(200).json(users);
//     } catch (error) {
//         console.warn('usersroute error: get /users/:sortBy/:order')
//         return res.status(500).json({ error, msg: 'שגיאה' });
//     }
// });


//! example of a dynamic route for statistics
UsersRoutes.get('/statistics', authenticateToken, async (req, res) => {
    const { type } = req.query;
    try {
        const stats = await UserModel.getStatistics(type);
        return res.status(200).json(stats);
    } catch (error) {
        console.warn(`users route error: get /statistics?type=${type}`);
        return res.status(500).json({ error: error.toString(), msg: 'Server error' });
    }
});

UsersRoutes.get('/count', authenticateToken, async (req, res) => {
    try {
        const count = await UserModel.count();
        return res.status(200).json(count);
    } catch (error) {
        console.warn("usersroute error : get /count", error.toString());
        res.status(500).json({ error, msg: error.toString() });
    }
})


UsersRoutes.post('/logout', async (req, res) => {
    try {
        const cookieOptions = {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            path: '/',
            expires: new Date(0) // Setting it to a past date to clear the cookie
        };
        const cookieString = cookie.serialize('token', '', cookieOptions);

        // Clear the cookie in the response header:
        res.setHeader('Set-Cookie', cookieString);
        res.status(200).json({ msg: 'logout successful!' });
    } catch (error) {
        console.warn("usersroute error : post /logout", error.toString());
        res.status(500).json({ error, msg: error.toString() });
    }
});


module.exports = UsersRoutes;