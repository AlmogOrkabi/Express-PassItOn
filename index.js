// step 1: import and initialize the packages:
require('dotenv').config({ path: './utils/.env' });
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 5500;


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
server.use(express.json({ limit: '100mb' }));
server.use(cors());



// const bodyParser = require('body-parser');
// server.use(bodyParser.json({ limit: '50mb' }));
// server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//step 3: routes:

//#1:users:
server.use('/api/users', require('./routes/users.route'));

//#2:addresses:
server.use('/api/addresses', require('./routes/addresses.route'));

//#2:posts:
server.use('/api/posts', require('./routes/posts.route'));

//#2:reports:
server.use('/api/reports', require('./routes/reports.route'));


//step 4: activate the server:
server.listen(PORT, () => console.log(`http://localhost:${PORT}`));  