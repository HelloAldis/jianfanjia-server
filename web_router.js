var express = require('express');
var config = require('./apiconfig');
var sign = require('./controllers/sign');
var site = require('./controllers/site');

var router = express.Router();

// home page
router.get('/', site.index);
router.get('/tpl/user/', site.homePage);
router.get('/download/user/app', site.download_user_app);
router.get('/download/user/apk', site.download_user_apk);
// router.post('/signup', sign.signup);
// router.post('/login', sign.login);

module.exports = router;
