var express = require('express');
var tempUserApi = require('./api/v2/web/temp_user');
var sign = require('./api/v2/web/sign');
var image = require('./api/v2/web/image');
var user = require('./api/v2/web/user');
var requirement = require('./api/v2/web/requirement');
var plan = require('./api/v2/web/plan');
var product = require('./api/v2/web/product');
var favorite = require('./api/v2/web/favorite');
var team = require('./api/v2/web/team');
var share = require('./api/v2/web/share');
var designer = require('./api/v2/web/designer');
var comment = require('./api/v2/web/comment');
var admin = require('./api/v2/web/admin');
var feedback = require('./api/v2/web/feedback');
var wechat = require('./api/v2/web/wechat');
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
router.post('/designer/listtop', designer.listtop); //获取首页设计师
router.post('/designer/search', designer.search); //搜索设计师
router.post('/designer_home_page', designer.designer_home_page); //游客获取设计师的主页
router.post('/search_designer_product', product.search_designer_product); //游客获取设计师作品
router.post('/product_home_page', product.product_home_page); //游客获取设计师作品
router.get('/verify_email/:key/:phone/:type', sign.verify_email); //游客验证邮箱

//wechat api
router.post('/wechat/receive', wechat.receive); //接收微信平台消息
router.get('/wechat/receive', wechat.signature); //认证微信平台

//通用用户功能
router.post('/signout', auth.normalUserRequired, sign.signout); //登出
router.post('/image/upload', auth.normalUserRequired, upload.single('Filedata'),
  image.add); //上传图片
router.post('/image/crop', auth.normalUserRequired, image.crop); //上传图片
router.post('/favorite/product/list', auth.normalUserRequired, favorite.list_product); //收藏列表
router.post('/favorite/product/add', auth.normalUserRequired, favorite.add_product); //收藏作品
router.post('/favorite/product/delete', auth.normalUserRequired, favorite.delete_product); //删除收藏作品
router.post('/add_comment', auth.normalUserRequired, comment.add_comment); //添加评论
router.post('/unread_comment', auth.normalUserRequired, comment.unread_comment); //获取未读评论
router.post('/topic_comments', auth.normalUserRequired, comment.topic_comments); //获取评论并标记为已读
router.post('/one_plan', auth.normalUserRequired, plan.getOne); //获取某个方案信息
router.post('/one_contract', auth.normalUserRequired, requirement.one_contract); //获取某个合同信息
router.post('/send_verify_email', auth.normalUserRequired, sign.send_verify_email); //发送验证邮箱邮件
router.get('/download_contract/:_id', auth.normalUserRequired, requirement.download_contract); //下载合同

//业主独有功能
router.post('/user/info', auth.userRequired, user.user_update_info); //修改业主个人资料
router.post('/user/info/get', auth.userRequired, user.user_my_info); //获取业主个人资料
router.post('/user_add_requirement', auth.userRequired, requirement.user_add_requirement); //提交我的装修需求
router.post('/user_update_requirement', auth.userRequired, requirement.user_update_requirement); //更新我的装修需求
router.post('/user_my_requirement_list', auth.userRequired, requirement.user_my_requirement_list); //获取我的装修需求列表
router.post('/user_one_requirement', auth.userRequired, requirement.user_one_requirement); //业主获取我的某个需求
router.post('/designers_user_can_order', auth.userRequired, designer.designers_user_can_order); //获取用户可以预约的设计师
router.post('/favorite/designer/list', auth.userRequired, favorite.list_designer); //获取业主的意向设计师列表
router.post('/favorite/designer/add', auth.userRequired, favorite.add_designer); //添加设计师到意向列表
router.post('/favorite/designer/delete', auth.userRequired, favorite.delete_designer); //把设计师从意向列表删除
router.post('/user_order_designer', auth.userRequired, user.order_designer); //预约量房
router.post('/user_change_ordered_designer', auth.userRequired, user.user_change_ordered_designer); //业主更换预约了的设计师
router.post('/user_ordered_designers', auth.userRequired, designer.user_ordered_designers); //获取预约了的设计师
router.post('/user_requirement_plans', auth.userRequired, plan.user_requirement_plans); //业主某个需求的方案
router.post('/designer_house_checked', auth.userRequired, user.designer_house_checked); //确认设计师量完房
router.post('/user/plan/final', auth.userRequired, plan.finalPlan); //选定方案
router.post('/user_evaluate_designer', auth.userRequired, user.user_evaluate_designer); //业主评价设计师

//设计师独有功能
router.post('/designer/agree', auth.designerRequired, designer.agree); //同意条款
router.post('/designer/info', auth.designerRequired, designer.updateInfo); //修改设计师个人资料
router.post('/designer/update_business_info', auth.designerRequired, designer.update_business_info); //修改设计师个人资料
router.post('/designer/info/get', auth.designerRequired, designer.getInfo); //获取设计师自己个人资料
router.post('/designer/uid_bank_info', auth.designerRequired, designer.uid_bank_info); //更新银行卡信息
router.post('/designer/email_info', auth.designerRequired, designer.email_info); //更新邮箱信息
router.post('/designer/product', auth.designerRequired, product.designer_my_products); //设计师获取自己的作品列表
router.post('/designer/product/one', auth.designerRequired, product.designer_one_product); //设计师获取自己的某个作品
router.post('/designer/product/add', auth.designerRequired, product.add); //上传作品
router.post('/designer/product/update', auth.designerRequired, product.update); //更新作品
router.post('/designer/product/delete', auth.designerRequired, product.delete); //删除作品
router.post('/designer/team/get', auth.designerRequired, team.list); //获取施工队伍
router.post('/designer/team/one', auth.designerRequired, team.designer_one_team); //设计师获取自己的某个施工队伍
router.post('/designer/team/add', auth.designerRequired, team.add); //添加施工队伍
router.post('/designer/team/update', auth.designerRequired, team.update); //更新施工队伍
router.post('/designer/team/delete', auth.designerRequired, team.delete); //删除施工队伍
router.post('/designer/auth', auth.designerRequired, designer.auth); //提交认证申请
router.post('/designer/update_online_status', auth.designerRequired, designer.update_online_status); //更改在线状态
router.post('/designer_my_requirement_list', auth.designerRequired, requirement
  .designer_my_requirement_list); //设计获取和自己相关的需求列表
router.post('/designer_my_requirement_history_list', auth.designerRequired,
  requirement.designer_my_requirement_history_list); //设计获取和自己相关的历史需求列表
router.post('/designer_one_requirement', auth.designerRequired, requirement.designer_one_requirement); //设计获取某个需求
router.post('/designer/user/ok', auth.designerRequired, designer.okUser); //响应业主
router.post('/designer/user/reject', auth.designerRequired, designer.rejectUser); //拒绝业主
router.post('/designer/plan/add', auth.designerRequired, plan.add); //提交方案
router.post('/designer/plan/update', auth.designerRequired, plan.update); //更新方案
router.post('/designer_requirement_plans', auth.designerRequired, plan.designer_requirement_plans); //设计师获取某个需求下的方案
router.post('/config_contract', auth.designerRequired, requirement.config_contract); //配置合同

//管理员独有的功能
router.post('/admin/login', admin.login); //审核设计师
router.post('/admin/update_basic_auth', auth.adminRequired, admin.update_basic_auth); //更改设计师基本信息认证
router.post('/admin/update_uid_auth', auth.adminRequired, admin.update_uid_auth); //更改设计师身份证信息认证
router.post('/admin/update_work_auth', auth.adminRequired, admin.update_work_auth); //更改设计师工地信息认证
router.post('/share/search', auth.adminRequired, admin.search_share); //搜索分享
router.post('/share/add', auth.adminRequired, admin.add); //创建直播分享
router.post('/share/update', auth.adminRequired, admin.update); //更新直播分享
router.post('/share/delete', auth.adminRequired, admin.delete); //删除直播分享
router.post('/admin/search_designer', auth.adminRequired, admin.searchDesigner); //搜索设计师
router.post('/admin/search_user', auth.adminRequired, admin.searchUser); //搜索业主
router.post('/admin/designer/:_id', auth.adminRequired, admin.getDesigner); //获取设计师信息
router.post('/admin/search_team', auth.adminRequired, admin.search_team); //搜索设计师的团队
router.post('/admin/api_statistic', auth.adminRequired, admin.api_statistic); //获取Api调用数据统计
router.post('/admin/feedback/search', auth.adminRequired, feedback.search); //获取用户反馈
router.post('/admin/product/search', auth.adminRequired, admin.searchProduct); //搜素作品
router.post('/admin/update_product_auth', auth.adminRequired, admin.update_product_auth); //搜素作品
router.post('/admin/requirement/search', auth.adminRequired, admin.search_requirement); //搜素需求
router.post('/admin/update_team', auth.adminRequired, admin.update_team); //管理员更新装修团队信息
router.post('/admin/update_designer_online_status', auth.adminRequired, admin.update_designer_online_status); //管理员更新设计师在线状态
router.post('/admin/search_plan', auth.adminRequired, admin.search_plan); //管理员搜索方案
router.post('/admin/search_angel_user', auth.adminRequired, tempUserApi.search_temp_user); //搜索天使用户

module.exports = router;
