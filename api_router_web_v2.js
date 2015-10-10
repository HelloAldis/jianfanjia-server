var express = require('express');
var tempUserApi = require('./api/v2/web/temp_user');
var sign = require('./api/v2/web/sign');
var image = require('./api/v2/web/image');
var user = require('./api/v2/web/user');
var requirement = require('./api/v2/web/requirement');
// var plan = require('./api/v2/web/plan');
// var product = require('./api/v2/web/product');
var favorite = require('./api/v2/web/favorite');
// var team = require('./api/v2/web/team');
var share = require('./api/v2/web/share');
// var designer = require('./api/v2/web/designer');
// var admin = require('./api/v2/web/admin');
// var process = require('./api/v2/web/process');
// var device = require('./api/v2/web/device');
// var feedback = require('./api/v2/web/feedback');
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
router.post('/send_verify_code', limit.peripperday('send_verify_code', config.send_verify_code_per_day),
  sign.sendVerifyCode); //发送验证码
router.post('/verify_phone', sign.verifyPhone); //验证手机
router.post('/signup', sign.signup); //web端注册
router.post('/login', sign.login); //web端登录
router.post('/update_pass', sign.updatePass); //修改密码
router.post('/add_angel_user', tempUserApi.add); //提交天使用户
router.post('/search_share', share.search_share); //获取装修直播分享
router.get('/image/:_id', image.get); //获取图片
router.get('/thumbnail/:width/:_id', image.thumbnail); //获取缩略图
router.get('/watermark/v1/:_id', image.watermark); //获取有水印图

//通用用户功能
router.post('/image/upload', auth.normalUserRequired, upload.single('Filedata'),
  image.add); //上传图片
router.post('/image/crop', auth.normalUserRequired, upload.single('Filedata'),
  image.crop); //上传图片

//业主独有功能
router.post('/user/info', auth.userRequired, user.user_update_info); //修改业主个人资料
router.get('/user/info', auth.userRequired, user.user_my_info); //获取业主个人资料
router.post('/user_add_requirement', auth.userRequired, requirement.user_add_requirement); //提交我的装修需求
router.get('/user_my_requiremtne_list', auth.userRequired, requirement.user_my_requiremtne_list); //更新我的装


module.exports = router;
