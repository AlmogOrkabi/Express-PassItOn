const jwt = require('jsonwebtoken');
const cookie = require('cookie');


// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (token == null) return res.status(401).json({ error: 'ACCESS_DENIED', msg: 'גישה נדחתה' }); // if there isn't any token

//     jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
//         if (err) return res.status(403).json({ error: 'ACCESS_DENIED', msg: 'נותקת מהמערכת' });
//         req.user = user;
//         next();
//     })
// }




function authenticateToken(req, res, next) {
    let token = null;
    let fromCookie = false;

    console.log("req header: " + req.headers)
    // Check the Authorization header (requests from the react native app)
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        token = authHeader.split(' ')[1];
    }

    // If no token in Authorization header, check cookies (requests from web application)
    if (!token) {
        const cookies = cookie.parse(req.headers.cookie || '');
        if (cookies && cookies.token) {
            token = cookies.token;
            fromCookie = true;
        }
    }

    // If token is still null, return 401 Unauthorized
    if (token == null) {
        return res.status(401).json({ error: 'ACCESS_DENIED', msg: 'גישה נדחתה' });
    }

    // Verify token
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) return res.status(403).json({ error: 'ACCESS_DENIED', msg: 'נותקת מהמערכת' });


        // If token is from a cookie (management site) and the user is not an admin, return 403 aunauthorized access
        if (fromCookie && user.role !== 'admin') {
            return res.status(403).json({ error: 'UNAUTHORIZED', msg: 'גישה נדחתה' });
        }

        req.user = user;
        next();
    });
}



//for endpoints that only admins need to have access to.checks that the request was made by an admin and not a regular user.
function checkAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'UNAUTHORIZED', msg: 'גישה נדחתה' });
    }
    next();
}

function isAdmin(user) {
    return user && user.role === 'admin';
}

module.exports = { authenticateToken, checkAdmin, isAdmin };