
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
    //password validation by rules.
}

function isValidPhoto(photo) {
    //file size and type validation
}

function validateUserData(username, firstName, lastName, email, password, photo) {
    if (!isString(username) || !isString(firstName) || !isString(lastName) || !isValidEmail(email) || isValidPassword(password)) {
    }
}


module.exports = { isValidObjectId }