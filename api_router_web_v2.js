var express = require('express');
var tempUserApi = require('./api/v2/web/temp_user');
var sign = require('./api/v2/web/sign');
var image = require('./api/v2/web/image');
var user = require('./api/v2/web/user');
var requirement = require('./api/v2/web/requirement');
// var plan = require('./api/v2/web/plan');
var product = require('./api/v2/web/product');
var favorite = require('./api/v2/web/favorite');
var team = require('./api/v2/web/team');
var share = require('./api/v2/web/share');
var designer = require('./api/v2/web/designer');
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
router.post('/designer/search', designer.search); //搜索设计师
router.post('/designer_home_page', designer.designer_home_page); //游客获取设计师

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

//设计师独有功能
router.post('/designer/agree', auth.designerRequired, designer.agree); //同意条款
router.post('/designer/info', auth.designerRequired, designer.updateInfo); //修改设计师个人资料
router.get('/designer/info', auth.designerRequired, designer.getInfo); //获取设计师自己个人资料
router.post('/designer/uid_bank_info', auth.designerRequired, designer.uid_bank_info); //更新银行卡信息
router.post('/designer/email_info', auth.designerRequired, designer.email_info); //更新邮箱信息
router.get('/designer/product', auth.designerRequired, product.listForDesigner); //设计师获取自己的作品列表
router.post('/designer/product/add', auth.designerRequired, product.add); //上传作品
router.post('/designer/product/update', auth.designerRequired, product.update); //更新作品
router.post('/designer/product/delete', auth.designerRequired, product.delete); //删除作品
router.get('/designer/team', auth.designerRequired, team.list); //获取施工队伍
router.post('/designer/team/add', auth.designerRequired, team.add); //添加施工队伍
router.post('/designer/team/update', auth.designerRequired, team.update); //更新施工队伍
router.post('/designer/team/delete', auth.designerRequired, team.delete); //删除施工队伍
router.post('/designer/update_online_status', auth.designerRequired, designer.update_online_status); //更改在线状态

module.exports = router;
