
//validates that the parameter received is an objectid
function isValidObjectId(id) {
    return id === null || (/^[0-9a-fA-F]{24}$/).test(id); // if valid or null (also valid, no need for an error message)
}

function isValidEmail(email) {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return email.match(validRegex);
}

function isString(str) {
    return str != null && typeof str === 'string';
}

function isValidPassword(password) {

    //Password rules:
    //1. lenght between 8 to 16 characters.
    //2. any letters must be of the english language.
    //3. must have at least one uppercase letter.
    //4. must have at least one lowercase letter.
    //5. must have at least one digit.
    //6. can include special characters, but it is not a requirement.

    if (isString(password) || password.length < 8 || password.length > 16) {
        return false;
    }
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /[0-9]/;
    const englishLettersRegex = /^[a-zA-Z]*$/; // this regex is specifically targeting characters classified as letters, and checks for  letters that are not part of the english language.
    //.testt() is js function that checks for a pattern, works with regular expressions objects.
    if (!uppercaseRegex.test(password) || !lowercaseRegex.test(password) || !digitRegex.test(password) || !englishLettersRegex.test(password)) {
        //throw new Error('סיסמה לא תקינה');
        return false;
    }

    return true;
}

function isValidPhoto(photo) {
    if (typeof photo.url !== 'string' || photo.url.length === 0 || typeof photo.public_id !== 'string' || photo.public_id.length === 0) {
        false; // maybe should not be a requirement????
        //handle a situation where a user might not want to add a profile picture???
    }
    else
        return true;
}

function isValidPhotosArray(photoUrls) {

    //checks if the input is correctly formatted (array) first
    return Array.isArray(photoUrls) && photoUrls.every(isValidPhoto); // true if all urls are valid, false if even one is not.
}

function isValidName(name) {
    const hebOReng = /^[A-Za-z\u0590-\u05FF ]+$/; // checks for letters in hebrew and english only
    return (isValidUserName(name) && hebOReng.test(name))
}

function isValidUserName(name) {
    return (isString(name) && name.length > 0 && name.length < 31);
}

// function validateUserData(username, firstName, lastName, email, password, address, photo) {
//     if (!isValidUserName(username) || !isValidName(firstName) || !isValidName(lastName) || !isValidEmail(email) || isValidPassword(password) || !isValidPhoto(photo) || !isValidObjectId(address)) {
//         //throw new Error("פרטים לא תקינים")
//         return false;
//     }
//     else
//         return true;
// }

function validateNewUserData(username, firstName, lastName, email, password, address, photo) {
    if (!isValidUserName(username)) {
        return { valid: false, msg: 'שם המשתמש אינו תקין' };
    }
    if (!isValidName(firstName)) {
        return { valid: false, msg: 'שם פרטי אינו תקין' };
    }
    if (!isValidName(lastName)) {
        return { valid: false, msg: 'שם משפחה אינו תקין' };
    }
    if (!isValidEmail(email)) {
        return { valid: false, msg: 'כתובת דואר אלקטורני אינה תקינה' };
    }
    if (!isValidPassword(password)) {
        return { valid: false, msg: 'הסיסמה אינה תקינה' };
    }
    if (photo != null && !isValidPhoto(photo)) {
        return { valid: false, msg: 'תמונת הפרופיל אינה תקינה' };
    }
    if (!isValidObjectId(address)) {
        return { valid: false, msg: 'הכתובת אינה תקינה' };
    }

    return { valid: true };
}


function validateUserData(updatedData) {
    let fieldsToUpdate = Object.keys(updatedData);

    for (let field of fieldsToUpdate) {
        switch (field) {
            case 'username':
                if (!isValidUserName(updatedData.username)) {
                    return { valid: false, msg: 'שם המשתמש אינו תקין' };
                }
                break;
            case 'firstName':
                if (!isValidName(updatedData.firstName)) {
                    return { valid: false, msg: 'שם פרטי אינו תקין' };
                }
                break;
            case 'lastName':
                if (!isValidName(updatedData.lastName)) {
                    return { valid: false, msg: 'שם משפחה אינו תקין' };
                }
                break;
            case 'email':
                if (!isValidEmail(updatedData.email)) {
                    return { valid: false, msg: 'כתובת דואר אלקטורני אינה תקינה' };
                }
                break;
            case 'password':
                if (!isValidPassword(updatedData.password)) {
                    return { valid: false, msg: 'הסיסמה אינה תקינה' };
                }
                break;
            case 'address':
                if (!isValidObjectId(updatedData.address)) {
                    return { valid: false, msg: 'הכתובת אינה תקינה' };
                }
                break;
            default:
                return { valid: false, msg: `Unexpected field: ${field}` };
        }
    }
    return { valid: true };
}

function isValidUserStatus(userStatus) {
    let validStatuses = ['פעיל', 'לא פעיל', 'חסום']
    if (!isString(userStatus) || !validStatuses.includes(userStatus))
        return { valid: false, msg: 'סטטוס לא תקין' }
    else
        return { valid: true }
}

//_____________________POSTS________________________________//


//***CHANGE DESCRIPTION TO AN OBJECT AND CHANGE THE VALIDATION IN THS FUNCTION!!!***//
// function validateNewPostData(owner_id, itemName, description, photoUrls, itemLocation) {
//     if (!isValidObjectId(owner_id) || owner_id == null || !isString(itemName) || itemName.length < 31 || !isString(description) || !isValidPhotosArray(photoUrls) || !isValidObjectId(itemLocation) || itemLocation == null)
//         throw new Error("פרטים לא תקינים");
//     else
//         return true;
// }

function isValidItemName(itemName) {
    if (!isString(itemName) || itemName.length > 50)
        return false;
    else
        return true;
}

function validateNewPostData(owner_id, itemName, description, photoUrls, itemLocation) {
    if (!isValidObjectId(owner_id) || owner_id == null) {
        return { valid: false, msg: 'שגיאה בהעלעת הפוסט' };
    }
    if (!isValidItemName(itemName)) {
        return { valid: false, msg: 'שם פריט אינו תקין' };
    }
    if (!isString(description) || description.length > 300) {
        return { valid: false, msg: 'תיאור פריט אינו תקין' };
    }
    if (!isValidPhotosArray(photoUrls)) {
        return { valid: false, msg: 'תמונת הפריט אינה תקינה' };
    }
    if (!isValidObjectId(itemLocation)) {
        return { valid: false, msg: 'הכתובת אינה תקינה' };
    }

    return { valid: true };
}


function validatePostData(updatedData) {
    let fieldsToUpdate = Object.keys(updatedData);

    for (let field of fieldsToUpdate) {
        switch (field) {
            case 'owner_id':
                if (!isValidObjectId(owner_id) || owner_id == null) {
                    return { valid: false, msg: 'שגיאה בהעלעת הפוסט' };
                }
                break;
            case 'itemName':
                if (!isValidItemName(itemName)) {
                    return { valid: false, msg: 'שם פריט אינו תקין' };
                }
                break;
            case 'description':
                if (!isString(description) || description.length > 300) {
                    return { valid: false, msg: 'תיאור פריט אינו תקין' };
                }
                break;
            case 'photoUrls':
                if (!isValidPhotosArray(photoUrls)) {
                    return { valid: false, msg: 'תמונת הפריט אינה תקינה' };
                }
                break;
            case 'itemLocation':
                if (!isValidObjectId(itemLocation)) {
                    return { valid: false, msg: 'הכתובת אינה תקינה' };
                }
                break;
            case 'status':
                if (!isValidPostStatus(postStatus)) {
                    return { valid: false, msg: 'סטטוס לא תקין' };
                }
                break;
            default:
                return { valid: false, msg: `Unexpected field: ${field}` };
        }
    }
    return { valid: true };
}

function isValidPostStatus(postStatus) {
    let validStatuses = ['זמין למסירה', 'לא זמין למסירה', 'בתהליך מסירה', 'נמסר', 'סגור', 'מבוטל', 'בבדיקת מנהל']

    if (!isString(postStatus) || !validStatuses.includes(postStatus)) {
        return { valid: false, msg: 'סטטוס לא תקין' }
    }
    else
        return { valid: true }
}

function validatePostSearchData(maxDistance, userCoordinates, itemName = null) {
    if (itemName) {
        if (!isValidItemName(itemName))
            return { valid: false, msg: 'שם פריט לא תקין' };
    }
    if (typeof maxDistance !== 'number') {
        return { valid: false, msg: 'מרחק מקסימלי לא תקין' };
    }
    if (!isValidCoordinates(userCoordinates)) {
        return { valid: false, msg: 'מיקום נוכחי לא תקין' };
    }
    return { valid: true };
}

//_____________________REPORTS________________________________//


function isValidReportType(reportType) {
    //make an array of valid reports and make sure the parameter matches one of the strings inside the array

    //ideas:
    // Inappropriate Language:
    // False Information:
    // Harassment / Bullying:

    // Spam: This would be for cases where a user is posting irrelevant or promotional content excessively.

    // Impersonation: This is when a user is pretending to be someone else in a deceptive manner.

    //Off - topic Posts: If a user posts something completely unrelated to the discussion or the scope of the platform, this category can be used.

    // Privacy Violation: This would cover situations where a user posts personal information about another person without their consent.

    // Intellectual Property Violation: If a user posts content that infringes on someone else 's copyright, trademark, or other intellectual property rights.

    // Illegal Content: This would be for any posts that involve illegal activities or promote such activities.

    // Hate Speech / Discrimination: This category is for posts that promote violence or hatred against individuals or groups based on attributes such as race, religion, disability, age, nationality, sexual orientation, gender, etc.
}

function isValidReportStatus(reportStatus) {
    let validStatuses = ['פתוח', 'בטיפול מנהל', 'בבירור', 'סגור'];

    if (!isString(reportStatus) || !validStatuses.includes(reportStatus)) {
        return { valid: false, msg: 'סטטוס לא תקין' }
    }
    else
        return { valid: true }
}

// function validateNewReportData(owner_id, reportType, userReported, postReported, photoUrls) {
//     if (!isValidObjectId(owner_id) || owner_id == null || !isString(reportType) || !isValidReportType(reportType) || !isValidObjectId(userReported) || userReported == null || !isValidObjectId(postReported) || !isValidPhotosArray(photoUrls)) // the postReported can be null because it could be only a user was reported and not a post (if a post was reported the creator will be reported as well)
//         throw new Error("פרטים לא תקינים");
//     else
//         return true;
// }

function validateNewReportData(owner_id, reportType, userReported, postReported, photoUrls, description) {
    if (!isValidObjectId(owner_id) || owner_id == null) {
        return { valid: false, msg: 'שגיאה בהעלעת הפוסט' };
    }
    if (!isValidReportType(reportType)) {
        return { valid: false, msg: 'סוג דיווח לא תקין' };
    }
    if (!isValidObjectId(userReported) || owner_id == null) { // the owner of the post in case a post was reported
        return { valid: false, msg: 'שגיאה בהעלעת הפוסט' };
    }
    if (!isValidObjectId(postReported)) { // can be null, the report can be only regarding a user and not a specific post
        return { valid: false, msg: 'שגיאה בהעלעת הפוסט' };
    }
    if (!isValidPhotosArray(photoUrls)) {
        return { valid: false, msg: 'תמונה לא תקינה' };
    }
    if (!isString(description) || description.length > 1000) {
        return { valid: false, msg: 'תיאור לא תקין או ארוך מידי' };
    }

    return { valid: true };
}



function validateReportData(data) {
    let fieldsToUpdate = Object.keys(data);

    for (let field of fieldsToUpdate) {
        switch (field) {
            case 'owner_id':
                if (!isValidObjectId(owner_id) || owner_id == null) {
                    return { valid: false, msg: 'שגיאה בהעלעת הפוסט' };
                }
                break;
            case 'reportType':
                if (!isValidReportType(itemName)) {
                    return { valid: false, msg: 'סיבת דיווח לא תקינה' };
                }
                break;
            case 'description':
                if (!isString(description) || description.length > 300) {
                    return { valid: false, msg: 'פירוט דיווח אינו תקין' };
                }
                break;
            case 'photoUrls':
                if (!isValidPhotosArray(photoUrls)) {
                    return { valid: false, msg: 'תמונה אינה תקינה' };
                }
                break;
            case 'userReported':
                if (!isValidObjectId(userReported) || userReported == null) {
                    return { valid: false, msg: 'שגיאה' };  //chage this
                }
                break;
            case 'postReported':
                if (!isValidObjectId(postReported)) { //can be null
                    return { valid: false, msg: 'שגיאה' }; //change this
                }
                // case 'status':
                //     if (!isValidReportStatus(postReported)) {
                //         return { valid: false, msg: 'סטטוס לא תקין' };
                //     }
                break;
            default:
                return { valid: false, msg: `Unexpected field: ${field}` };
        }
    }
    return { valid: true };
}

//_____________________ADDRESSES________________________________//

function isNumber(num) {
    return typeof num === 'number';
}

// function isValidLocation(location) {
//     return typeof location === 'object' && location.type === 'Point' && Array.isArray(location.coordinates) && location.coordinates.length == 2 && isNumber(location.coordinates[0]) && isNumber(location.coordinates[1]) && location.coordinates[0] >= -180 && location.coordinates[0] <= 180 && location.coordinates[1] >= -90 && location.coordinates[1] <= 90;
// }


// function isValidLocation(location) {
//     return typeof location === 'object' && location.type === 'Point' && isValidCoordinates(location.coordinates);
// }

// function isValidCoordinates(coordinates) {
//     return Array.isArray(coordinates) && coordinates.length == 2 && isNumber(coordinates[0]) && isNumber(coordinates[1]) && coordinates[0] >= -180 && coordinates[0] <= 180 && coordinates[1] >= -90 && coordinates[1] <= 90;
// }


function isValidCoordinates(lon, lat) {
    return isNumber(lon) && isNumber(lat) && lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90;
}

// function validateNewAddressDetails(region, city, street, house, apartment, notes, location) {
//     if (!isString(region) || !isString(city) || !isString(street) || !isNumber(house) || !isNumber(apartment) || !isString(notes) || notes.length < 101 || !isValidLocation(location))
//         throw new Error("פרטים לא תקינים");
//     else
//         return true;
// }


function validateNewAddressDetails(region, city, street, house, apartment, notes, lon, lat) {
    if (!isString(region)) {
        return { valid: false, msg: 'קלט לא תקין' };
    }
    if (!isString(city)) {
        return { valid: false, msg: 'קלט לא תקין' };
    }
    if (!isString(street)) {
        return { valid: false, msg: 'קלט לא תקין' };
    }
    if (!isNumber(house)) {
        return { valid: false, msg: 'קלט לא תקין' };
    }
    if (!isNumber(apartment) && apartment != null) { // can be null (a private house)
        return { valid: false, msg: 'קלט לא תקין' };
    }
    if (!isValidCoordinates(lon, lat)) {
        return { valid: false, msg: 'קלט לא תקין' };
    }
    if (!isString(notes) || notes.length > 100) {
        return { valid: false, msg: 'תיאור לא תקין או ארוך מידי' };
    }

    return { valid: true };
}


//NO EDITS YET - NOT SURE IF NECESSARY


//----------------------------------------------------------

function validateSort(sortBy, order) {
    if (!isString(sortBy) || !isNumber(order) || order != -1 && order != 1)
        return { valid: false, msg: 'קלט לא תקין' };
    else
        return { valid: true };
}

// function validateObjectId(req, res, next) {
//     let { _id } = req.params;
//     if (!isValidObjectId(_id) || _id == null) {
//         return res.status(400).json({ msg: 'פרטים לא נכונים' });
//     }
//     next();
// }


function validateObjectId(paramNames) {
    return function (req, res, next) {
        if (!Array.isArray(paramNames)) {
            paramNames = [paramNames];  // handle single paramName for backward compatibility
        }
        for (let paramName of paramNames) {
            let objectId = req.params[paramName];
            if (!isValidObjectId(objectId) || objectId == null) {
                return res.status(400).json({ msg: 'פרטים לא נכונים' });
            }
        }
        next();
    };
}




//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FOR LATER IF THERE'S TIME: ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// async function checkOwnerOrAdmin(req, res, next) {
//     let postId = req.params._id;
//     let userId = req.user._id; // assuming that authenticateToken middleware adds user object to request

//     try {
//         let post = await PostsModel.findById(postId);
//         if (!post) {
//             return res.status(404).json({ msg: "Post not found." });
//         }

//         if (post.owner_id.toString() !== userId && req.user.role !== 'admin') {
//             return res.status(403).json({ msg: "You do not have permission to perform this action." });
//         }

//         // Pass the execution to the next middleware function/route handler
//         next();
//     } catch (error) {
//         return res.status(500).json({ msg: "An error occurred.", error });
//     }
// }



module.exports = { isValidObjectId, isString, validateSort, validateNewUserData, validateUserData, isValidUserStatus, validateNewPostData, validatePostData, validatePostSearchData, validateNewReportData, validateReportData, isValidReportStatus, validateNewAddressDetails, isValidPhoto, validateObjectId }