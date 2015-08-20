var express = require('express');
var config = require('./config');
var sign = require('./controllers/sign');
var site = require('./controllers/site');

var router = express.Router();

// home page
router.get('/', site.index);

// router.post('/signup', sign.signup);
// router.post('/login', sign.login);

module.exports = router;
