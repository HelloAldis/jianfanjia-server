var express           = require('express');
var tempUserApi   = require('./api/v1/temp_user');
var sign = require('./api/v1/sign');
var image = require('./api/v1/image');
var user = require('./api/v1/user');
var plan = require('./api/v1/plan');
var product = require('./api/v1/product');
var favorite = require('./api/v1/favorite');
var comment = require('./api/v1/comment');
var team = require('./api/v1/team');
var share = require('./api/v1/share');
var designer = require('./api/v1/designer');
var admin = require('./api/v1/admin');
var config            = require('./config');
var auth            = require('./middlewares/auth');
var limit             = require('./middlewares/limit');
var config            = require('./config');

var router            = express.Router();

var multer  = require('multer')
var storage = multer.memoryStorage();
var upload = multer({ limits:'3mb', storage: storage });

// router.get('/temp_user', tempUserApi.show); //
// router.put('/temp_user', tempUserApi.add); //

//未登录用户拥有的功能
router.post('/send_verify_code', limit.peripperday('send_verify_code', config.send_verify_code_per_day), sign.sendVerifyCode); //发送验证码
router.post('/signup', sign.signup); //手机端注册
router.post('/login', sign.login); //手机端登录
router.post('/update_pass', sign.updatePass); //修改密码
router.get('/share', share.list); //获取装修直播分享
router.get('/share/listtop', share.listtop); //获取最火热的装修直播分享
router.get('/product/:_id', product.getOne); //获取某个作品信息
router.get('/designer/:_id/basicinfo', designer.getOne); //获取设计师信息
router.get('/designer/:_id/products', product.list); //获取设计师作品列表
router.get('/designer/listtop', designer.listtop); //获取首页设计师
router.post('/designer/search', designer.search); //搜索设计师
router.get('/image/:_id', image.get); //获取图片

//通用用户功能
router.put('/image/upload', auth.normalUserRequired, upload.single('image'), image.add); //上传图片
router.get('/favorite/product',auth.normalUserRequired, favorite.list); //收藏列表
router.post('/favorite/product',auth.normalUserRequired, favorite.add); //收藏作品
router.delete('/favorite/product',auth.normalUserRequired, favorite.delete); //删除收藏作品
router.post('/plan/comment',auth.normalUserRequired, comment.add); //添加评论
router.get('/user/info',auth.normalUserRequired, user.getInfo); //获取业主个人资料

//业主独有功能
router.put('/user/info',auth.userRequired, user.updateInfo); //修改业主个人资料
router.put('/user/requirement',auth.userRequired, user.updateRequirement); //更新我的装修需求
router.get('/user/requirement',auth.userRequired, user.getRequirement); //获取我的装修需求
router.get('/user/designer',auth.userRequired, user.myDesigner); //我的设计师
router.post('/user/designer',auth.userRequired, user.addDesigner); //添加设计师到我的设计师列表
router.post('/user/designer/house_check',auth.userRequired, user.addDesigner2HouseCheck); //预约量房
router.get('/user/plan',auth.userRequired, plan.userMyPlan); //我的方案
router.post('/user/plan/final',auth.userRequired, plan.finalPlan); //选定方案

//设计师独有功能
router.put('/designer/info',auth.designerRequired, designer.updateInfo); //修改设计师个人资料
router.get('/designer/info',auth.designerRequired, designer.getInfo); //获取设计师个人资料
router.get('/designer/user',auth.designerRequired, designer.myUser); //我的业主
router.post('/designer/user/ok',auth.designerRequired, designer.okUser); //响应业主
router.post('/designer/user/reject',auth.designerRequired, designer.rejectUser); //拒绝业主
router.get('/designer/plan',auth.designerRequired, plan.designerMyPlan); //我的装修方案
router.post('/designer/plan',auth.designerRequired, plan.add); //提交方案
router.put('/designer/plan',auth.designerRequired, plan.update); //更新方案
router.post('/designer/product',auth.designerRequired, product.add); //上传作品
router.put('/designer/product',auth.designerRequired, product.update); //更新作品
router.delete('/designer/product',auth.designerRequired, product.delete); //删除作品
router.get('/designer/team',auth.designerRequired, team.list); //获取施工队伍
router.post('/designer/team',auth.designerRequired, team.add); //添加施工队伍
router.put('/designer/team',auth.designerRequired, team.update); //更新施工队伍
router.delete('/designer/team',auth.designerRequired, team.delete); //删除施工队伍
router.post('/designer/auth',auth.designerRequired, designer.auth); //提交认证申请

//管理员独有的功能
router.post('/admin/authed',auth.adminRequired, admin.authed); //审核设计师
router.post('/share',auth.adminRequired, admin.add); //创建直播分享
router.put('/share',auth.adminRequired, admin.update); //更新直播分享

module.exports = router;
