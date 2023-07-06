// step 1: import and initialize the packages:
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = 5500 || process.env.PORT;


// Step 2: creation of the server:
let server = express();
server.use(express.json());
server.use(cors());

//step 3: routes:



//step 4: activate the server:
server.listen(PORT, () => console.log(`http://localhost:${PORT}`));  