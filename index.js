// step 1: import and initialize the packages:
require('dotenv').config({ path: './utils/.env' });
const express = require('express');
const cors = require('cors'); // cross origin resource 
const PORT = process.env.PORT || 5500;



//*for the local host testing with cookies 🍪
const corsOptions = {
    origin: function (origin, callback) {
        if (/^http:\/\/localhost(:\d+)?$/.test(origin) || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}


//~Images:

// Require the cloudinary library
const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
    secure: true,
    cloud_name: process.env.C_CLOUD_NAME,
    api_key: process.env.C_API_KEY,
    api_secret: process.env.C_API_SECRET,
});



// Step 2: creation of the server:

let server = express();
server.use(express.json({ limit: '100mb' })); //size limit for the request body - for an issue with the base64 images
server.use(cors(corsOptions));


//step 3: routes:

//#1:users:
server.use('/api/users', require('./routes/users.route'));

//#2:addresses:
server.use('/api/addresses', require('./routes/addresses.route'));

//#3:posts:
server.use('/api/posts', require('./routes/posts.route'));

//#4:reports:
server.use('/api/reports', require('./routes/reports.route'));

//#5:requests:
server.use('/api/requests', require('./routes/requests.route'));

//step 4: activate the server:
server.listen(PORT, () => console.log(`http://localhost:${PORT}`));  