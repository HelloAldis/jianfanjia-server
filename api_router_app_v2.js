var express = require('express');
// var tempUserApi = require('./api/v2/app/temp_user');
var sign = require('./api/v2/app/sign');
// var image = require('./api/v2/app/image');
// var user = require('./api/v2/app/user');
// var plan = require('./api/v2/app/plan');
// var product = require('./api/v2/app/product');
// var favorite = require('./api/v2/app/favorite');
// var team = require('./api/v2/app/team');
// var share = require('./api/v2/app/share');
var designer = require('./api/v2/app/designer');
var designerWeb = require('./api/v2/web/designer');
// var admin = require('./api/v2/app/admin');
var process = require('./api/v2/app/process');
var device = require('./api/v2/app/device');
var feedback = require('./api/v2/app/feedback');
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
router.post('/feedback', feedback.add); //游客反馈
router.post('/user_login', sign.user_login); //业主手机端登录
router.post('/designer_login', sign.designer_login); //设计师手机端登录
router.post('/user_signup', sign.user_signup); //业主手机端注册
router.post('/designer_signup', sign.designer_signup); //设计师手机端注册
router.get('/device/android_build_version', device.android_build_version); //获取android信息
router.post('/designer_home_page', designerWeb.designer_home_page); //游客获取设计师的主页

//业主独有功能
router.post('/user/process', auth.userRequired, process.start); //开启装修流程
router.post('/process/done_section', auth.userRequired, process.doneSection); //对比验收完成
router.get('/home_page_designers', auth.userRequired, designer.home_page_designers); //获取业主移动端首页数据

//通用用户功能
router.get('/process/list', auth.normalUserRequired, process.list); //获取装修工地列表
router.get('/process/:_id', auth.normalUserRequired, process.getOne); //获取装修进度
router.post('/process/image', auth.normalUserRequired, process.addImage); //上传照片到工地
router.post('/process/done_item', auth.normalUserRequired, process.doneItem); //设置节点为已完成状态
router.get('/process/reschedule/all', auth.normalUserRequired, process.listReschdule); //获取我的改期提醒
router.post('/process/reschedule', auth.normalUserRequired, process.reschedule); //提交改期提醒
router.post('/process/reschedule/ok', auth.normalUserRequired, process.okReschedule); //同意改期提醒
router.post('/process/reschedule/reject', auth.normalUserRequired, process.rejectReschedule); //拒绝改期提醒

//设计师独有功能
router.post('/process/ysimage', auth.designerRequired, process.addYsImage); //提交验收照片
router.post('/process/ysimage/delete', auth.designerRequired, process.deleteYsImage); //删除验收照片
router.post('/process/can_ys', auth.designerRequired, process.ys); //可以开始验收了

module.exports = router;
