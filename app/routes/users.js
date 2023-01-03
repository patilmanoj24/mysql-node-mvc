var express = require('express');
var router = express.Router();

var usersController = require(rootDir + '/app/controllers/usersController.js');

router.post('/signin', usersController.signin);

module.exports = router;
