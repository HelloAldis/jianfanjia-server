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
var config            = require('./config');

var router            = express.Router();

router.get('/temp_user', tempUserApi.show); //
router.put('/temp_user', tempUserApi.add); //

//未登录用户拥有的功能
router.post('/send_verify_code', sign.sendVerifyCode); //发送验证码
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
router.put('/image/upload', image.add); //
router.get('/favorite/product', favorite.list); //
router.post('/favorite/product', favorite.add); //
router.delete('/favorite/product', favorite.delete); //
router.post('/plan/comment', comment.add); //
router.post('/share', share.add); //创建直播分享
router.put('/share', share.update); //
router.get('/user/info', user.getInfo); //获取业主个人资料

//业主独有功能
router.put('/user/info', user.updateInfo); //修改业主个人资料
router.put('/user/requirement', user.updateRequirement); //更新我的装修需求
router.get('/user/requirement', user.getRequirement); //获取我的装修需求
router.get('/user/designer', user.myDesigner); //我的设计师
router.post('/user/designer', user.addDesigner); //添加设计师到我的设计师列表
router.post('/user/designer/house_check', user.addDesigner2HouseCheck); //预约量房
router.get('/user/plan', user.myDesigner); //我的方案
router.get('/user/plan/final', plan.finalPlan); //选定方案

//设计师独有功能
router.put('/designer/info', designer.updateInfo); //修改设计师个人资料
router.get('/designer/info', designer.getInfo); //获取设计师个人资料
router.get('/designer/user', designer.myUser); //我的业主
router.post('/designer/user/ok', designer.okUser); //响应业主
router.post('/designer/user/reject', designer.rejectUser); //拒绝业主
router.get('/designer/plan', plan.designerMyPlan); //我的装修方案
router.post('/designer/plan', plan.add); //
router.put('/designer/plan', plan.update); //
router.post('/designer/product', product.add); //
router.put('/designer/product', product.update); //
router.delete('/designer/product', product.delete); //
router.get('/designer/team', team.list); //
router.post('/designer/team', team.add); //
router.put('/designer/team', team.update); //
router.delete('/designer/team', team.delete); //
router.post('/designer/auth', designer.auth); //

module.exports = router;
