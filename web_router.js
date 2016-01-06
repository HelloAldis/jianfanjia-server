var express = require('express');
var config = require('./apiconfig');
var sign = require('./controllers/sign');
var site = require('./controllers/site');
var dec_strategy = require('./controllers/dec_strategy');

var router = express.Router();

// home page
// router.get('/', site.index);
router.get('/tpl/user/', site.homePage);
router.get('/download/user/app', site.download_user_app);
router.get('/download/user/apk', site.download_user_apk);
router.get('/download/designer/apk', site.download_designer_apk);
// router.post('/signup', sign.signup);
// router.post('/login', sign.login);
router.get('/tpl/article/detail.html', dec_strategy.dec_strategy_homepage);
router.get('/wechat/login_callback', sign.wechat_login_callback);
module.exports = router;
