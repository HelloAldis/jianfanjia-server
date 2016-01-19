var express = require('express');

var sign = require('./api/v2/app/sign');
var user = require('./api/v2/app/user');
var requirement = require('./api/v2/app/requirement');
// var plan = require('./api/v2/app/plan');
// var favorite = require('./api/v2/app/favorite');
// var team = require('./api/v2/app/team');
// var share = require('./api/v2/app/share');
var designer = require('./api/v2/app/designer');
var process = require('./api/v2/app/process');
var device = require('./api/v2/app/device');
var feedback = require('./api/v2/app/feedback');

var signWeb = require('./api/v2/web/sign');
var imageWeb = require('./api/v2/web/image');
var commentWeb = require('./api/v2/web/comment');
var requirementWeb = require('./api/v2/web/requirement');
var planWeb = require('./api/v2/web/plan');
var userWeb = require('./api/v2/web/user');
var designerWeb = require('./api/v2/web/designer');
var favoriteWeb = require('./api/v2/web/favorite');
var productWeb = require('./api/v2/web/product');
var beautiful_imageWeb = require('./api/v2/web/beautiful_image');

var config = require('./apiconfig');
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
  signWeb.sendVerifyCode); //发送验证码
router.post('/feedback', feedback.add); //游客反馈
router.get('/device/android_build_version', device.android_build_version); //获取android信息
router.post('/user_login', sign.user_login); //业主手机端登录
router.post('/user_wechat_login', sign.user_wechat_login); //业主手机端微信登录
router.post('/designer_login', sign.designer_login); //设计师手机端登录
router.post('/verify_phone', signWeb.verifyPhone); //验证手机
router.post('/user_signup', sign.user_signup); //业主手机端注册
router.post('/designer_signup', sign.designer_signup); //设计师手机端注册
router.post('/update_pass', signWeb.updatePass); //修改密码
router.post('/designer_home_page', designerWeb.designer_home_page); //游客获取设计师的主页
router.post('/product_home_page', productWeb.product_home_page); //游客获取设计师作品
router.post('/search_designer_product', productWeb.search_designer_product); //游客获取设计师作品
router.get('/image/:_id', imageWeb.get); //获取图片
router.get('/thumbnail/:width/:_id', imageWeb.thumbnail); //获取缩略图
router.post('/beautiful_image_homepage', beautiful_imageWeb.beautiful_image_homepage); //游客获取美图主页
router.post('/search_beautiful_image', beautiful_imageWeb.search_beautiful_image); //游客搜索美图
router.post('/user_refresh_session', sign.user_refresh_session); //业主刷新sessiion
//设备使用
router.get('/device/android_build_version', device.android_build_version); //获取android信息
router.get('/device/designer_android_build_version', device.designer_android_build_version); //获取designer android 信息

//通用用户功能
router.get('/signout', auth.normalUserRequired, signWeb.signout); //登出
router.post('/image/upload', auth.normalUserRequired, upload.single('Filedata'),
  imageWeb.add); //上传图片
router.post('/add_comment', auth.normalUserRequired, commentWeb.add_comment); //添加评论
router.post('/topic_comments', auth.normalUserRequired, commentWeb.topic_comments); //获取评论并标记为已读
router.post('/one_plan', auth.normalUserRequired, planWeb.getOne); //获取某个方案信息
router.post('/one_contract', auth.normalUserRequired, requirementWeb.one_contract); //获取某个方案信息
router.get('/process/list', auth.normalUserRequired, process.list); //获取装修工地列表
router.get('/process/:_id', auth.normalUserRequired, process.getOne); //获取装修进度
router.post('/process/image', auth.normalUserRequired, process.addImage); //上传照片到工地
router.post('/process/add_images', auth.normalUserRequired, process.add_images); //上传多张照片到工地
router.post('/process/delete_image', auth.normalUserRequired, process.delete_image); //上传照片到工地
router.post('/process/done_item', auth.normalUserRequired, process.doneItem); //设置节点为已完成状态
router.get('/process/reschedule/all', auth.normalUserRequired, process.listReschdule); //获取我的改期提醒
router.post('/process/reschedule', auth.normalUserRequired, process.reschedule); //提交改期提醒
router.post('/process/reschedule/ok', auth.normalUserRequired, process.okReschedule); //同意改期提醒
router.post('/process/reschedule/reject', auth.normalUserRequired, process.rejectReschedule); //拒绝改期提醒
router.post('/favorite/product/list', auth.normalUserRequired, favoriteWeb.list_product); //收藏列表
router.post('/favorite/product/add', auth.normalUserRequired, favoriteWeb.add_product); //收藏作品
router.post('/favorite/product/delete', auth.normalUserRequired, favoriteWeb.delete_product); //删除收藏作品
router.post('/favorite/beautiful_image/list', auth.normalUserRequired,
  favoriteWeb.list_beautiful_image); //收藏美图列表
router.post('/favorite/beautiful_image/add', auth.normalUserRequired,
  favoriteWeb.add_beautiful_image); //收藏美图
router.post('/favorite/beautiful_image/delete', auth.normalUserRequired,
  favoriteWeb.delete_beautiful_image); //删除收藏美图
//设备使用
// router.post('/device/bind', auth.normalUserRequired, device.bindCid); //并定cid

//业主独有功能
router.post('/user/info', auth.userRequired, userWeb.user_update_info); //修改业主个人资料
router.get('/user/info', auth.userRequired, userWeb.user_my_info); //获取业主个人资料
router.post('/home_page_designers', auth.userRequired, designer.home_page_designers); //获取业主移动端首页数据
router.post('/user_add_requirement', auth.userRequired, requirementWeb.user_add_requirement); //提交我的装修需求
router.post('/user_update_requirement', auth.userRequired, requirementWeb.user_update_requirement); //更新我的装修需求
router.get('/user_my_requirement_list', auth.userRequired, requirement.user_my_requirement_list); //获取我的装修需求列表
router.post('/designers_user_can_order', auth.userRequired, designerWeb.designers_user_can_order); //获取用户可以预约的设计师
router.post('/favorite/designer/list', auth.userRequired, favoriteWeb.list_designer); //获取业主的意向设计师列表
router.post('/favorite/designer/add', auth.userRequired, favoriteWeb.add_designer); //添加设计师到意向列表
router.post('/favorite/designer/delete', auth.userRequired, favoriteWeb.delete_designer); //把设计师从意向列表删除
router.post('/user_order_designer', auth.userRequired, userWeb.order_designer); //预约量房
router.post('/user_change_ordered_designer', auth.userRequired, userWeb.user_change_ordered_designer); //业主更换预约了的设计师
router.post('/user_evaluate_designer', auth.userRequired, userWeb.user_evaluate_designer); //业主评价设计师
router.post('/user_ordered_designers', auth.userRequired, designerWeb.user_ordered_designers); //获取预约了的设计师
router.post('/designer_house_checked', auth.userRequired, userWeb.designer_house_checked); //确认设计师量完房
router.post('/user_requirement_plans', auth.userRequired, planWeb.user_requirement_plans); //业主某个需求的方案
router.post('/user/plan/final', auth.userRequired, planWeb.finalPlan); //选定方案
router.post('/user/process', auth.userRequired, process.start); //开启装修流程
router.post('/process/done_section', auth.userRequired, process.doneSection); //对比验收完成
router.post('/user_bind_phone', auth.userRequired, userWeb.user_bind_phone); //业主绑定手机号
router.post('/user_bind_wechat', auth.userRequired, user.user_bind_wechat); //业主绑定微信

//设计师独有功能
router.get('/designer/info', auth.designerRequired, designerWeb.getInfo); //获取设计师自己个人资料
router.post('/process/ysimage', auth.designerRequired, process.addYsImage); //提交验收照片
router.post('/process/ysimage/delete', auth.designerRequired, process.deleteYsImage); //删除验收照片
router.post('/process/can_ys', auth.designerRequired, process.ys); //可以开始验收了
router.post('/designer_get_user_requirements', auth.designerRequired,
  requirement.designer_get_user_requirements); //设计师获取我的业主需求信息

module.exports = router;
