const jwt = require('jsonwebtoken');


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ msg: 'התנתקת מהמערכת, נא התחבר מחדש' }); // if there isn't any token

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) return res.status(403).json({ msg: 'גישה נדחתה' });
        req.user = user;
        next();
    })
}



//for endpoints that only admins need to have access to.checks that the request was made by an admin and not a regular user.
function checkAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'גישה נדחתה' });
    }
    next();
}

function isAdmin(user) {
    return user && user.role === 'admin';
}

module.exports = { authenticateToken, checkAdmin, isAdmin };