const { userStatuses, postCategories, postStatuses, reportTypes, reportStatuses, requestStatuses } = require('../Data/constants');


//validates that the parameter received is an objectid
function isValidObjectId(id) {
    return (/^[0-9a-fA-F]{24}$/).test(id);
}




function isValidEmail(email) {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return email.match(validRegex);
}

function isString(str) {
    return str != null && typeof str == 'string' && str.trim().length > 0; // checks the string is not empty and is not composed only of white spaces
}

function isValidPassword(password) {

    //~ Password rules:
    //1. lenght between 8 to 16 characters.
    //2. any letters must be of the english language.
    //3. must have at least one uppercase letter.
    //4. must have at least one lowercase letter.
    //5. must have at least one digit.
    //6. can include special characters, but it is not a requirement.

    if (!isString(password) || password.length < 8 || password.length > 16) {
        return false;
    }
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /[0-9]/;
    //const englishLettersRegex = /^[a-zA-Z]*$/; // this regex is specifically targeting characters classified as letters, and checks for  letters that are not part of the english language.
    //.testt() is js function that checks for a pattern, works with regular expressions objects.
    if (!uppercaseRegex.test(password) || !lowercaseRegex.test(password) || !digitRegex.test(password)) {
        //throw new Error('סיסמה לא תקינה');
        return false;
    }

    return true;
}

function isValidPhoto(photo) {
    if (typeof photo.url !== 'string' || photo.url.length === 0 || typeof photo.public_id !== 'string' || photo.public_id.length === 0) {
        return false;
    }
    else
        return true;
}

function isValidPhotosArray(photoUrls) {
    console.log("PHOTOS:")
    console.log(photoUrls)
    //- checks if the input is correctly formatted (array) first
    return Array.isArray(photoUrls) && photoUrls.every(isValidPhoto); // true if all urls are valid, false if even one is not.
}


function isValidName(name) {
    const hebOReng = /^[A-Za-z\u0590-\u05FF '-]+$/; //checks for letters in hebrew and english only.also checks for the chars ' and -
    // //const hebOReng = /^[\u0590-\u05FFa-zA-Z '-]+$/;

    return (isValidUserName(name) && hebOReng.test(name))
}


function isValidUserName(name) {
    return (isString(name) && name.length < 31);
}


function isValidPhoneNumber(phoneNumber) {
    // //return /^05\d*$/.test(phoneNumber) && phoneNumber.length == 10;
    return /^05\d{8}$/.test(phoneNumber); // starts with 05, and has exactly 10 characters (8 after 05). ^ - start of a line. & - end of a line.
}

function validateNewUserData(username, firstName, lastName, phoneNumber, email, password, address, photo) {
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
    if (!isValidPhoneNumber(phoneNumber)) {
        return { valid: false, msg: 'מספר הטלפון שהוכנס אינו תקין' };
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
            case 'phoneNumber':
                if (!isValidPhoneNumber(updatedData.phoneNumber)) {
                    return { valid: false, msg: 'מספר הטלפון שהוכנס אינו תקין' };
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
            case 'address_id':
                if (!isValidObjectId(updatedData.address_id)) {
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
    // //console.log(userStatus)
    if (!isString(userStatus) || !userStatuses.includes(userStatus))
        return { valid: false, msg: 'סטטוס לא תקין' }
    else
        return { valid: true }
}

function isValidUserRole(role) {
    if (role !== 'user' && role !== 'admin') {
        return { valid: false, msg: 'הכתובת אינה תקינה' };
    }
    else
        return { valid: true }
}

//~_____________________POSTS________________________________~//


function isValidPostCategory(category) {
    if (!isString(category) || !postCategories.includes(category)) {
        return false;
    }
    else
        return true;
}

function isValidItemName(itemName) {
    if (!isString(itemName) || itemName.length > 50)
        return false;
    else
        return true;
}

function validateNewPostData(owner_id, itemName, description, category, photoUrls, itemLocation_id) {
    if (!isValidObjectId(owner_id)) {
        return { valid: false, msg: 'שגיאה בהעלעת הפוסט' };
    }
    if (!isValidItemName(itemName)) {
        return { valid: false, msg: 'שם פריט אינו תקין' };
    }
    if (!isString(description) || description.length > 300) {
        return { valid: false, msg: 'תיאור פריט אינו תקין' };
    }
    if (!isValidPostCategory(category)) {
        return { valid: false, msg: 'קטגורית הפריט אינה תקינה' };
    }
    if (!isValidPhotosArray(photoUrls)) {
        return { valid: false, msg: 'תמונת הפריט אינה תקינה' };
    }
    if (!isValidObjectId(itemLocation_id)) {
        return { valid: false, msg: 'הכתובת אינה תקינה' };
    }

    return { valid: true };
}


function validatePostData(updatedData) {
    let fieldsToUpdate = Object.keys(updatedData);
    console.log(fieldsToUpdate);

    for (let field of fieldsToUpdate) {
        switch (field) {
            case 'owner_id':
                if (!isValidObjectId(updatedData.owner_id)) {
                    return { valid: false, msg: 'שגיאה בהעלעת הפוסט' };
                }
                break;
            case 'itemName':
                if (!isValidItemName(updatedData.itemName)) {
                    return { valid: false, msg: 'שם פריט אינו תקין' };
                }
                break;
            case 'description':
                if (!isString(updatedData.description) || updatedData.description.length > 300) {
                    return { valid: false, msg: 'תיאור פריט אינו תקין' };
                }
                break;
            case 'category':
                if (!isValidPostCategory(updatedData.category)) {
                    return { valid: false, msg: 'קטגורית הפריט אינה תקינה' };
                }
                break;
            case 'photoUrls':
                if (!isValidPhotosArray(updatedData.photoUrls)) {
                    return { valid: false, msg: 'תמונת הפריט אינה תקינה' };
                }
                break;
            case 'itemLocation_id':
                if (!isValidObjectId(updatedData.itemLocation_id)) {
                    return { valid: false, msg: 'הכתובת אינה תקינה' };
                }
                break;
            case 'status':
                if (!isValidPostStatus(updatedData.status)) {
                    return { valid: false, msg: 'סטטוס לא תקין' };
                }
                break;
            case 'photos':
                if (!isValidPhotosArray(updatedData.photos)) {
                    return { valid: false, msg: 'תמונות לא תקינות' };
                }
                break;
            case 'recipient_id':
                if (!isValidObjectId(updatedData.recipient_id)) {
                    return { valid: false, msg: 'מזהה מקבל הפריט לא תקין' };
                }
                break;
            case 'full':

                break;
            default:
                return { valid: false, msg: `Unexpected field: ${field}` };
        }
    }
    return { valid: true };
}

function isValidPostStatus(postStatus) {
    if (!isString(postStatus) || !postStatuses.includes(postStatus)) {
        return false
    }
    else
        return true;
}
// function isValidPostStatus(postStatus) {
//     //const validStatuses = ['זמין', 'לא זמין למסירה', 'בתהליך מסירה', 'נמסר', 'סגור', 'מבוטל', 'בבדיקת מנהל']

//     if (!isString(postStatus) || !postStatuses.includes(postStatus)) {
//         return { valid: false, msg: 'סטטוס לא תקין' }
//     }
//     else
//         return { valid: true }
// }

function validatePostSearchData(maxDistance, userCoordinates, itemName = null) {
    if (itemName) {
        if (!isValidItemName(itemName))
            return { valid: false, msg: 'שם פריט לא תקין' };
    }
    if (!isNumber(maxDistance)) {
        return { valid: false, msg: 'מרחק מקסימלי לא תקין' };
    }
    if (!isValidCoordinates(userCoordinates[0], userCoordinates[1])) {
        return { valid: false, msg: 'מיקום נוכחי לא תקין' };
    }
    return { valid: true };
}

//_____________________REPORTS________________________________//


function isValidReportType(reportType) {
    if (!isString(reportType) || !reportTypes.includes(reportType))
        return { valid: false, msg: "סיבת הדיווח אינה תקינה" };
    else
        return { valid: true };


}

function isValidReportStatus(reportStatus) {
    if (!isString(reportStatus) || !reportStatuses.includes(reportStatus)) {
        return { valid: false, msg: 'סטטוס לא תקין' }
    }
    else
        return { valid: true }
}
function checkReportStatus(reportStatus) {
    if (!isString(reportStatus) || !reportStatuses.includes(reportStatus)) {
        return false;
    }
    else
        return true;
}


function validateNewReportData(owner_id, reportType, userReported, postReported, photoUrls, description) {
    if (!isValidObjectId(owner_id)) {
        return { valid: false, msg: 'שגיאה בהעלעת הפוסט' };
    }
    if (!isValidReportType(reportType)) {
        return { valid: false, msg: 'סוג דיווח לא תקין' };
    }
    if (!isValidObjectId(userReported)) { // the owner of the post in case a post was reported
        return { valid: false, msg: 'שגיאה בהעלעת הפוסט' };
    }
    if (postReported !== null && !isValidObjectId(postReported)) { // can be null, the report can be only regarding a user and not a specific post
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
                if (!isValidObjectId(data.owner_id)) {
                    return { valid: false, msg: 'שגיאה בהעלעת הפוסט' };
                }
                break;
            case 'reportType':
                if (!isValidReportType(data.itemName)) {
                    return { valid: false, msg: 'סיבת דיווח לא תקינה' };
                }
                break;
            case 'description':
                if (data.description !== '' && !isString(data.description) || data.description.length > 1000) {
                    return { valid: false, msg: 'פירוט דיווח אינו תקין' };
                }
                break;
            case 'photots':
                if (!isValidPhotosArray(data.photots)) {
                    return { valid: false, msg: 'תמונה אינה תקינה' };
                }
                break;
            case 'userReported':
                if (!isValidObjectId(data.userReported)) {
                    return { valid: false, msg: 'שגיאה' };  //chage this
                }
                break;
            case 'postReported_id':
                if (data.postReported_id !== null && !isValidObjectId(data.postReported_id)) { //can be null
                    return { valid: false, msg: 'שגיאה' }; //change this
                }
                break;
            case 'photos':
                if (!isValidPhotosArray(data.photos)) {
                    return { valid: false, msg: 'תמונה לא תקינה' };
                }
                break;
            case 'verdict':
                if (!isString(data.verdict) || data.verdict.length > 100) {
                    return { valid: false, msg: 'גזר הדין ארוך מידי' };
                }
                break;
            case 'verdictDescription':
                if (data.verdictDescription !== '' && !isString(data.verdictDescription) || data.verdictDescription.length > 1000) {
                    return { valid: false, msg: 'פירוט דיווח אינו תקין' };
                }
                break;
            case 'status':
                if (!checkReportStatus(data.status)) {
                    return { valid: false, msg: 'הסטטוס אינו תקין' };
                }
                break;
            case 'full':

                break;
            case 'admin':

                break;
            default:
                return { valid: false, msg: `Unexpected field: ${field}` };
        }
    }
    return { valid: true };
}

//~_____________________ADDRESSES________________________________~//


function isNumber(value) {
    return value !== 0 && isFinite(value);
    //* isFinite - a function in javascript that checks if a value is an actual valid number (accepts strings as well) - will treat empty strings and white spaces as 0!!!
}

function isValidCoordinates(lon, lat) {
    return isNumber(lon) && isNumber(lat) && lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90;
}




function validateNewAddressDetails(region, city, street, house, apartment, notes, simplifiedAddress, lon, lat) {
    if (!isString(region)) {
        return { valid: false, msg: 'קלט לא תקין מחוז' };
    }
    if (!isString(city)) {
        return { valid: false, msg: 'קלט לא תקין עיר' };
    }
    if (!isString(street)) {
        return { valid: false, msg: 'קלט לא תקין רחוב' };
    }
    if (!isNumber(house)) {
        return { valid: false, msg: 'קלט לא תקין בית' };
    }
    if (!isNumber(apartment) && apartment != null) { // can be null (a private house)
        return { valid: false, msg: 'קלט לא תקין דירה' };
    }
    if (!isValidCoordinates(lon, lat)) {
        return { valid: false, msg: 'קלט לא תקין' };
    }
    if (notes !== null && !isString(notes) || notes !== null && notes.length > 100) {
        return { valid: false, msg: 'תיאור לא תקין או ארוך מידי' };
    }
    if (!isString(simplifiedAddress) || simplifiedAddress.length > 51) {
        return { valid: false, msg: 'קלט לא תקין' };
    }

    return { valid: true };
}




function validateAddressData(updatedData) {
    let fieldsToUpdate = Object.keys(updatedData);

    for (let field of fieldsToUpdate) {
        switch (field) {
            case 'apartment':
                if (!isNumber(updatedData.apartment) && apartment != null) { // can be null (private house/ not an apartment building)
                    return { valid: false, msg: 'קלט לא תקין' };
                }
                break;
            case 'house':
                if (!isNumber(updatedData.house)) {
                    return { valid: false, msg: 'קלט לא תקין' };
                }
                break;
            case 'notes':
                if (updatedData.notes !== null && !isString(updatedData.notes) || updatedData.notes !== null && updatedData.notes.length > 100) {
                    return { valid: false, msg: 'תיאור לא תקין או ארוך מידי' };
                }
                break;
            default:
                return { valid: false, msg: `Unexpected field: ${field}` };
        }
    }
    return { valid: true };
}

//NO EDITS YET - NOT SURE IF NECESSARY


//~_____________________REQUESTS________________________________~//

function isValidRequestStatus(requestStatus) {
    if (!isString(requestStatus) || !requestStatuses.includes(requestStatus)) {
        return false;
    }
    return true;
}

function isValidRequestString(requestString) {
    return typeof requestString === 'string' && requestString.length < 301;
}

function validateNewRequestData(sender_id, recipient_id, requestMessage, post_id) {

    if (!isValidObjectId(sender_id)) {
        return { valid: false, msg: 'זיהוי השולח לא תקין' };
    }
    if (!isValidObjectId(recipient_id)) {
        return { valid: false, msg: 'זיהוי הנמען לא תקין' };
    }
    if (!isValidObjectId(post_id)) {
        return { valid: false, msg: 'זיהוי הפוסט לא תקין' };
    }
    if (!isValidRequestString(requestMessage)) {
        return { valid: false, msg: 'מלל הבקשה אינו תקין או ארוך מידי' };
    }

    return { valid: true };
}

function validateRequestData(updatedData) { //assuming the sender, the recipient and the post should NOT be changed.
    let fieldsToUpdate = Object.keys(updatedData);

    for (let field of fieldsToUpdate) {
        switch (field) {
            case 'requestMessage':
                if (!isValidRequestString(updatedData.requestMessage)) {
                    return { valid: false, msg: 'מלל הבקשה אינו תקין או ארוך מידי' };
                }
                break;
            case 'responseMessage':
                if (updatedData.responseMessage && !isValidRequestString(updatedData.responseMessage)) {
                    return { valid: false, msg: 'מלל התשובה אינו תקין או ארוך מידי' };
                }
                break;
            case 'status':
                if (!isValidRequestStatus(updatedData.status)) {
                    return { valid: false, msg: 'סטטוס הבקשה אינו תקין' };
                }
                break;
            case 'recipient_id':
                if (!isValidObjectId(updatedData.recipient_id)) {
                    return { valid: false, msg: 'זיהוי הנמען לא תקין' };
                }
                break;
            case 'sender_id':
                if (!isValidObjectId(updatedData.sender_id)) {
                    return { valid: false, msg: 'זיהוי השולח לא תקין' };
                }
                break;
            case 'post_id':
                if (!isValidObjectId(updatedData.post_id)) {
                    return { valid: false, msg: 'זיהוי הפוסט לא תקין' };
                }
                break;
            case '_id':
                if (!isValidObjectId(updatedData._id)) {
                    return { valid: false, msg: 'זיהוי הבקשה לא תקין' };
                }
                break;
            case 'full':

                break;
            default:
                return { valid: false, msg: `Unexpected field: ${field}` };
        }
    }
    return { valid: true };
}




//----------------------------------------------------------

function validateSort(sortBy, order) {
    if (!isString(sortBy) || order != -1 && order != 1)
        return { valid: false, msg: 'קלט לא תקין' };
    else
        return { valid: true };
}


//a middleware to validate objectIds in the route layer:
function validateObjectId(paramNames) {
    return function (req, res, next) {
        if (!Array.isArray(paramNames)) {
            paramNames = [paramNames];  // handle single paramName for backward compatibility
        }
        for (let paramName of paramNames) {
            let objectId = req.params[paramName];
            if (!isValidObjectId(objectId)) {
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




module.exports = { isValidObjectId, isString, validateSort, validateNewUserData, validateUserData, isValidUserStatus, validateNewPostData, validatePostData, validatePostSearchData, isValidPostStatus, isValidPostCategory, validateNewReportData, validateReportData, isValidReportStatus, validateNewAddressDetails, validateAddressData, isValidPhoto, validateObjectId, validateNewRequestData, validateRequestData, isValidUserRole }