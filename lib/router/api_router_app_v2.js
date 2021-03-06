var express = require('express');

var sign = require('lib/api/v2/app/sign');
var user = require('lib/api/v2/app/user');
var requirement = require('lib/api/v2/app/requirement');
var process = require('lib/api/v2/app/process');
var device = require('lib/api/v2/app/device');
var feedback = require('lib/api/v2/app/feedback');
var beautiful_image = require('lib/api/v2/app/beautiful_image');
var message = require('lib/api/v2/app/message');
var supervisor = require('lib/api/v2/app/supervisor');
var diary = require('lib/api/v2/app/diary');
var quotation = require('lib/api/v2/app/quotation');

var signWeb = require('lib/api/v2/web/sign');
var imageWeb = require('lib/api/v2/web/image');
var commentWeb = require('lib/api/v2/web/comment');
var requirementWeb = require('lib/api/v2/web/requirement');
var planWeb = require('lib/api/v2/web/plan');
var userWeb = require('lib/api/v2/web/user');
var designerWeb = require('lib/api/v2/web/designer');
var favoriteWeb = require('lib/api/v2/web/favorite');
var productWeb = require('lib/api/v2/web/product');
var beautiful_imageWeb = require('lib/api/v2/web/beautiful_image');
var messageWeb = require('lib/api/v2/web/message');
var shareWeb = require('lib/api/v2/web/share');
var teamWeb = require('lib/api/v2/web/team');
var diaryWeb = require('lib/api/v2/web/diary');
var temp_userWeb = require('lib/api/v2/web/temp_user');

var config = require('lib/config/apiconfig');
var auth = require('lib/middlewares/auth');
var limit = require('lib/middlewares/limit');

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
router.post('/top_products', productWeb.top_products); //游客获取top作品
router.post('/product_home_page', productWeb.product_home_page); //游客获取设计师作品
router.post('/search_designer_product', productWeb.search_designer_product); //游客搜索设计师作品
router.post('/search_designer', designerWeb.search); //搜索设计师
router.get('/image/:_id', imageWeb.get); //获取图片
router.get('/thumbnail/:width/:_id', imageWeb.thumbnail); //获取缩略图
router.get('/thumbnail2/:width/:height/:_id', imageWeb.thumbnail2); //获取缩略图2
router.post('/beautiful_image_homepage', beautiful_imageWeb.beautiful_image_homepage); //游客获取美图主页
router.post('/search_beautiful_image', beautiful_image.search_beautiful_image); //游客搜索美图
router.post('/user_refresh_session', sign.user_refresh_session); //业主刷新sessiion
router.post('/designer_refresh_session', sign.designer_refresh_session); //设计师刷新sessiion
router.post('/search_share', shareWeb.search_share); //获取装修直播分享
//设备使用
router.get('/device/android_build_version', device.android_build_version); //获取android信息
router.get('/device/designer_android_build_version', device.designer_android_build_version); //获取designer android 信息
router.get('/device/supervisor_android_build_version', device.supervisor_android_build_version); //获取supervisor android 信息
router.post('/image/upload', upload.single('Filedata'), imageWeb.add); //上传图片
router.post('/one_plan', planWeb.getOne); //获取某个方案信息
router.post('/search_diary_set', diaryWeb.search_diary_set); // 游客搜索日记集
router.post('/search_diary', diaryWeb.search_diary); // 游客搜索日记
router.post('/get_diary_changes', diary.get_diary_changes); // 游客获取日记更新数据
router.post('/diary_info', diary.diary_info); // 游客获取日记详情
router.post('/diary_set_info', diary.diary_set_info); // 游客获取日记集详情
router.post('/top_diary_set', diaryWeb.top_diary_set); // 游客热门日记集
router.post('/topic_comments', commentWeb.topic_comments); //获取评论并标记为已读
router.post('/add_angel_user', temp_userWeb.add); //提交天使用户
router.post('/generate_quotation', quotation.generate_quotation); //提交天使用户

//通用用户功能
router.get('/signout', auth.normalUserRequired, signWeb.signout); //登出
// router.post('/image/upload', auth.normalUserRequired, upload.single('Filedata'), imageWeb.add); //上传图片
router.post('/add_comment', auth.normalUserRequired, commentWeb.add_comment); //添加评论
// router.post('/topic_comments', auth.normalUserRequired, commentWeb.topic_comments); //获取评论并标记为已读
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
router.post('/favorite/beautiful_image/list', auth.normalUserRequired, favoriteWeb.list_beautiful_image); //收藏美图列表
router.post('/favorite/beautiful_image/add', auth.normalUserRequired, favoriteWeb.add_beautiful_image); //收藏美图
router.post('/favorite/beautiful_image/delete', auth.normalUserRequired, favoriteWeb.delete_beautiful_image); //删除收藏美图
router.post('/favorite/diary/add', auth.normalUserRequired, favoriteWeb.add_diary); //点赞日记
router.post('/favorite/diarySet/list', auth.normalUserRequired, favoriteWeb.list_diary_set); //收藏日记本列表
router.post('/favorite/diarySet/add', auth.normalUserRequired, favoriteWeb.add_diary_set); //收藏日记本
router.post('/favorite/diarySet/delete', auth.normalUserRequired, favoriteWeb.delete_diary_set); //取消收藏日记本
router.post('/send_verify_email', auth.normalUserRequired, signWeb.send_verify_email); //发送验证邮箱邮件
//设备使用
// router.post('/device/bind', auth.normalUserRequired, device.bindCid); //并定cid
router.post('/add_diary_set', auth.normalUserRequired, diaryWeb.add_diary_set); // 用户添加日记集
router.post('/my_diary_set', auth.normalUserRequired, diaryWeb.my_diary_set); // 用户我的日记集
router.post('/update_diary_set', auth.normalUserRequired, diaryWeb.update_diary_set); // 用户更新日记集
router.post('/add_diary', auth.normalUserRequired, diaryWeb.add_diary); // 用户添加日记
router.post('/delete_diary', auth.normalUserRequired, diaryWeb.delete_diary); // 用户删除日记

//业主独有功能
router.post('/user/info', auth.userRequired, userWeb.user_update_info); //修改业主个人资料
router.get('/user/info', auth.userRequired, userWeb.user_my_info); //获取业主个人资料
router.post('/user_add_requirement', auth.userRequired, requirementWeb.user_add_requirement); //提交我的装修需求        --- 未来要废弃
router.post('/user_update_requirement', auth.userRequired, requirementWeb.user_update_requirement); //更新我的装修需求        --- 未来要废弃
router.get('/user_my_requirement_list', auth.userRequired, requirement.user_my_requirement_list); //获取我的装修需求列表        --- 未来要废弃
router.post('/designers_user_can_order', auth.userRequired, designerWeb.designers_user_can_order); //获取用户可以预约的设计师        --- 未来要废弃
router.post('/favorite/designer/list', auth.userRequired, favoriteWeb.list_designer); //获取业主的意向设计师列表
router.post('/favorite/designer/add', auth.userRequired, favoriteWeb.add_designer); //添加设计师到意向列表
router.post('/favorite/designer/delete', auth.userRequired, favoriteWeb.delete_designer); //把设计师从意向列表删除
router.post('/user_order_designer', auth.userRequired, userWeb.order_designer); //预约量房        --- 未来要废弃
router.post('/user_change_ordered_designer', auth.userRequired, userWeb.user_change_ordered_designer); //业主更换预约了的设计师        --- 未来要废弃
router.post('/user_evaluate_designer', auth.userRequired, userWeb.user_evaluate_designer); //业主评价设计师
router.post('/user_ordered_designers', auth.userRequired, designerWeb.user_ordered_designers); //获取预约了的设计师         --- 未来要废弃
router.post('/designer_house_checked', auth.userRequired, userWeb.designer_house_checked); //确认设计师量完房  --- 未来要废弃
router.post('/user_requirement_plans', auth.userRequired, planWeb.user_requirement_plans); //业主某个需求的方案  --- 未来要废弃
router.post('/user/plan/final', auth.userRequired, planWeb.finalPlan); //选定方案  --- 未来要废弃
router.post('/user/process', auth.userRequired, process.start); //开启装修流程  --- 未来要废弃
router.post('/process/done_section', auth.userRequired, process.doneSection); //对比验收完成
router.post('/user_bind_phone', auth.userRequired, userWeb.user_bind_phone); //业主绑定手机号
router.post('/user_bind_wechat', auth.userRequired, user.user_bind_wechat); //业主绑定微信
router.post('/search_user_message', auth.userRequired, messageWeb.search_user_message); //搜索业主通知
router.post('/user_message_detail', auth.userRequired, messageWeb.user_message_detail); //业主通知详情
router.post('/delete_user_message', auth.userRequired, messageWeb.delete_user_message); //删除业主消息
router.post('/unread_user_message_count', auth.userRequired, messageWeb.unread_user_message_count); //未读消息个数
router.post('/search_user_comment', auth.userRequired, message.search_user_comment); //获取业主评论通知

//设计师独有功能
router.post('/designer/agree', auth.designerRequired, designerWeb.agree); //同意条款
router.post('/designer/info', auth.designerRequired, designerWeb.updateInfo); //修改设计师个人资料
router.post('/designer/update_business_info', auth.designerRequired, designerWeb.update_business_info); //修改设计师接单资料
router.post('/designer/uid_bank_info', auth.designerRequired, designerWeb.uid_bank_info); //更新银行卡信息
router.post('/designer/email_info', auth.designerRequired, designerWeb.email_info); //更新邮箱信息
router.get('/designer/info', auth.designerRequired, designerWeb.getInfo); //获取设计师自己个人资料
router.post('/process/ysimage', auth.designerRequired, process.addYsImage); //提交验收照片
router.post('/process/ysimage/delete', auth.designerRequired, process.deleteYsImage); //删除验收照片
router.post('/process/can_ys', auth.designerRequired, process.ys); //可以开始验收了
router.post('/designer_get_user_requirements', auth.designerRequired, requirement.designer_get_user_requirements); //设计师获取我的业主需求信息
router.post('/designer/user/ok', auth.designerRequired, designerWeb.okUser); //响应业主
router.post('/designer/user/reject', auth.designerRequired, designerWeb.rejectUser); //拒绝业主
router.post('/designer_requirement_plans', auth.designerRequired, planWeb.designer_requirement_plans); //设计师获取某个需求下的方案
router.post('/config_contract', auth.designerRequired, requirementWeb.config_contract); //配置合同
router.post('/search_designer_message', auth.designerRequired, messageWeb.search_designer_message); //搜索设计师通知
router.post('/designer_message_detail', auth.designerRequired, messageWeb.designer_message_detail); //设计师通知详情
router.post('/delete_designer_message', auth.designerRequired, messageWeb.delete_designer_message); //删除设计师消息
router.post('/unread_designer_message_count', auth.designerRequired, messageWeb.unread_designer_message_count); //未读消息个数
router.post('/search_designer_comment', auth.designerRequired, message.search_designer_comment); //获取设计师评论通知
router.post('/designer_remind_user_house_check', auth.designerRequired, limit.peruserplanperday('designer_remind_user_house_check', config.designer_remind_user_house_check_time_one_day),
  designerWeb.designer_remind_user_house_check); //设计师提醒业主确认量房
router.post('/designer/product', auth.designerRequired, productWeb.designer_my_products); //设计师获取自己的作品列表
router.post('/designer/product/one', auth.designerRequired, productWeb.designer_one_product); //设计师获取自己的某个作品
router.post('/designer/product/add', auth.designerRequired, productWeb.add); //上传作品
router.post('/designer/product/update', auth.designerRequired, productWeb.update); //更新作品
router.post('/designer/product/delete', auth.designerRequired, productWeb.delete); //删除作品
router.post('/designer/team/get', auth.designerRequired, teamWeb.list); //获取施工队伍
router.post('/designer/team/one', auth.designerRequired, teamWeb.designer_one_team); //设计师获取自己的某个施工队伍
router.post('/designer/team/add', auth.designerRequired, teamWeb.add); //添加施工队伍
router.post('/designer/team/update', auth.designerRequired, teamWeb.update); //更新施工队伍
router.post('/designer/team/delete', auth.designerRequired, teamWeb.delete); //删除施工队伍

//监理独有功能
router.post('/supervisor_login', sign.supervisor_login);
router.post('/supervisor_refresh_session', sign.supervisor_refresh_session);
router.post('/supervisor/info/get', supervisor.supervisor_my_info);
router.post('/supervisor/info/update', supervisor.supervisor_update_info);

module.exports = router;
