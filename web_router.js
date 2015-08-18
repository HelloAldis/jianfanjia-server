
var express = require('express');
var config = require('./config');
var sign = require('./controllers/sign');

var router = express.Router();

router.post('/signup', sign.signup);
router.post('/login', sign.login);

module.exports = router;
