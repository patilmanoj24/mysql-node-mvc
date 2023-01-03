express = require('express');
app = express();
request = require('request');
axios = require('axios');
router = express.Router();
http = require('http');
fs = require('fs');
AWS = require('aws-sdk');
jwt  = require('jsonwebtoken');
cors = require('cors');
app.use(cors());
crypto = require('crypto');
path = require("path");
expressValidator = require('express-validator');
app.use(expressValidator());
bodyParser = require('body-parser'); 
app.use(bodyParser.json({limit: '50mb'}));
// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));
app.use(express.static(path.join(__dirname, 'static')));

var moment = require('moment'); // for date formats 
// mysql = require('mysql');
mysql = require('mysql2');

rootDir = __dirname;
commonFunctions = require(rootDir+'/functions/functions');
config = require(rootDir+'/config/config.json');
routes = require(rootDir + '/app/routes/routes');

const PORT = 8181;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});