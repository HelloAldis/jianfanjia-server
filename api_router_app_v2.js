var express = require('express');
var tempUserApi = require('./api/v1/temp_user');
var sign = require('./api/v2/app/sign');
var image = require('./api/v1/image');
var user = require('./api/v1/user');
var plan = require('./api/v1/plan');
var product = require('./api/v1/product');
var favorite = require('./api/v1/favorite');
var team = require('./api/v1/team');
var share = require('./api/v1/share');
var designer = require('./api/v1/designer');
var admin = require('./api/v1/admin');
var process = require('./api/v1/process');
var device = require('./api/v1/device');
var feedback = require('./api/v1/feedback');
var config = require('./config');
var auth = require('./middlewares/auth');
var limit = require('./middlewares/limit');

var router = express.Router();

var multer = require('multer')
var storage = multer.memoryStorage();
var upload = multer({
  limits: '3mb',
  storage: storage
});

//未登录用户拥有的功能
router.post('/login', sign.login); //手机端登录

module.exports = router;
