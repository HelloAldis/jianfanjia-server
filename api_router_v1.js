var express = require('express');
var tempUserApi = require('./api/v1/temp_user');
var sign = require('./api/v1/sign');
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

// router.get('/temp_user', tempUserApi.show); //
// router.put('/temp_user', tempUserApi.add); //

//未登录用户拥有的功能
router.post('/send_verify_code', limit.peripperday('send_verify_code', config.send_verify_code_per_day),
  sign.sendVerifyCode); //发送验证码
router.post('/verify_phone', sign.verifyPhone); //验证手机
router.post('/signup', sign.signup); //手机端注册
router.post('/login', sign.login); //手机端登录
router.post('/update_pass', sign.updatePass); //修改密码
router.get('/share', share.list); //获取装修直播分享
router.get('/share/listtop', share.listtop); //获取最火热的装修直播分享
router.get('/share/:_id', share.getOne); //获取某个直播分享
router.get('/product/:_id', product.getOne); //获取某个作品信息
router.get('/designer/:_id/basicinfo', designer.getOne); //获取设计师信息
router.get('/designer/:_id/products', product.list); //获取设计师作品列表
router.get('/designer/listtop', designer.listtop); //获取首页设计师
router.post('/designer/search', designer.search); //搜索设计师
router.get('/image/:_id', image.get); //获取图片
router.get('/thumbnail/:width/:_id', image.thumbnail); //获取缩略图
router.get('/watermark/v1/:_id', image.watermark); //获取有水印图
router.post('/feedback', feedback.add);
//设备使用
router.get('/device/android_build_version', device.android_build_version); //获取android信息

//通用用户功能
router.post('/image/upload', auth.normalUserRequired, upload.single('Filedata'),
  image.add); //上传图片
router.get('/favorite/product', auth.normalUserRequired, favorite.list); //收藏列表
router.post('/favorite/product', auth.normalUserRequired, favorite.add); //收藏作品
router.delete('/favorite/product', auth.normalUserRequired, favorite.delete); //删除收藏作品
router.get('/plan/:_id', auth.normalUserRequired, plan.getOne); //获取某个方案信息
router.post('/plan/comment', auth.normalUserRequired, plan.addCommentForPlan); //添加评论
router.get('/user/:_id/info', auth.normalUserRequired, user.getInfo); //获取业主个人资料
router.get('/signout', auth.normalUserRequired, sign.signout); //登出
router.post('/process/image', auth.normalUserRequired, process.addImage); //上传照片到工地
router.get('/process/list', auth.normalUserRequired, process.list); //获取装修工地列表
router.get('/process/:_id', auth.normalUserRequired, process.getOne); //获取装修进度
router.post('/process/comment', auth.normalUserRequired, process.addComment); //评论装修进度
router.post('/process/done_item', auth.normalUserRequired, process.doneItem); //设置节点为已完成状态
router.post('/process/done_section', auth.normalUserRequired, process.doneSection); //对比验收完成
router.get('/process/reschedule/all', auth.normalUserRequired, process.listReschdule); //获取我的改期提醒
router.post('/process/reschedule', auth.normalUserRequired, process.reschedule); //提交改期提醒
router.post('/process/reschedule/ok', auth.normalUserRequired, process.okReschedule); //同意改期提醒
router.post('/process/reschedule/reject', auth.normalUserRequired, process.rejectReschedule); //拒绝改期提醒
//设备使用
router.post('/device/bind', auth.normalUserRequired, device.bindCid); //并定cid

//业主独有功能
router.put('/user/info', auth.userRequired, user.updateInfo); //修改业主个人资料
router.get('/user/info', auth.userRequired, user.getInfo); //修改业主个人资料
router.put('/user/requirement', auth.userRequired, user.updateRequirement); //更新我的装修需求
router.get('/user/requirement', auth.userRequired, user.getRequirement); //获取我的装修需求
router.get('/user/designer', auth.userRequired, user.myDesigner); //我的设计师
router.post('/user/designer', auth.userRequired, user.addDesigner); //添加设计师到我的设计师列表
router.post('/user/designer/house_check', auth.userRequired, user.addDesigner2HouseCheck); //预约量房
router.get('/user/plan', auth.userRequired, plan.userMyPlan); //我的方案
router.post('/user/plan/final', auth.userRequired, plan.finalPlan); //选定方案
router.post('/user/process', auth.userRequired, process.start); //开启装修流程

//设计师独有功能
router.put('/designer/info', auth.designerRequired, designer.updateInfo); //修改设计师个人资料
router.get('/designer/info', auth.designerRequired, designer.getInfo); //获取设计师自己个人资料
router.get('/designer/user', auth.designerRequired, designer.myUser); //我的业主
router.post('/designer/user/ok', auth.designerRequired, designer.okUser); //响应业主
router.post('/designer/user/reject', auth.designerRequired, designer.rejectUser); //拒绝业主
router.get('/designer/plan', auth.designerRequired, plan.designerMyPlan); //我的装修方案
router.post('/designer/plan', auth.designerRequired, plan.add); //提交方案
router.put('/designer/plan', auth.designerRequired, plan.update); //更新方案
router.get('/designer/product', auth.designerRequired, product.listForDesigner); //上传作品
router.post('/designer/product', auth.designerRequired, product.add); //上传作品
router.put('/designer/product', auth.designerRequired, product.update); //更新作品
router.delete('/designer/product', auth.designerRequired, product.delete); //删除作品
router.get('/designer/team', auth.designerRequired, team.list); //获取施工队伍
router.post('/designer/team', auth.designerRequired, team.add); //添加施工队伍
router.put('/designer/team', auth.designerRequired, team.update); //更新施工队伍
router.delete('/designer/team', auth.designerRequired, team.delete); //删除施工队伍
router.post('/designer/auth', auth.designerRequired, designer.auth); //提交认证申请
router.post('/designer/agree', auth.designerRequired, designer.agree); //提交认证申请
router.post('/process/ysimage', auth.designerRequired, process.addYsImage); //提交验收照片
router.delete('/process/ysimage', auth.designerRequired, process.deleteYsImage); //删除验收照片

//管理员独有的功能
router.post('/admin/login', admin.login); //审核设计师
router.post('/admin/authed', auth.adminRequired, admin.authed); //审核设计师
router.post('/admin/update_basic_auth', auth.adminRequired, admin.update_basic_auth); //更改设计师基本信息认证
router.post('/admin/update_uid_auth', auth.adminRequired, admin.update_uid_auth); //更改设计师身份证信息认证
router.post('/admin/update_work_auth', auth.adminRequired, admin.update_work_auth); //更改设计师工地信息认证
router.post('/share', auth.adminRequired, admin.add); //创建直播分享
router.put('/share', auth.adminRequired, admin.update); //更新直播分享
router.delete('/share', auth.adminRequired, admin.delete); //删除直播分享
router.get('/admin/authing_designer', auth.adminRequired, admin.listAuthingDesigner); //获取申请认证的设计师
router.post('/admin/search_designer', auth.adminRequired, admin.searchDesigner); //搜索设计师
router.post('/admin/search_user', auth.adminRequired, admin.searchUser); //搜索业主
router.get('/admin/designer/:_id', auth.adminRequired, admin.getDesigner); //获取设计师信息
router.get('/admin/designer/team/:_id', auth.adminRequired, admin.listDesignerTeam); //获取某个设计师的所有团队
router.get('/admin/api_statistic', auth.adminRequired, admin.api_statistic); //获取Api调用数据统计
router.post('/admin/feedback/search', auth.adminRequired, feedback.search); //获取用户反馈
router.post('/admin/product/search', auth.adminRequired, admin.searchProduct); //搜素作品
router.post('/admin/update_product_auth', auth.adminRequired, admin.update_product_auth); //搜素作品
router.post('/admin/requirement/search', auth.adminRequired, admin.search_requirement); //搜素需求
router.post('/admin/update_team', auth.adminRequired, admin.update_team);

module.exports = router;
