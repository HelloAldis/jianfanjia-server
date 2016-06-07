var express = require('express');
var config = require('../apiconfig');
var sign = require('../controllers/sign');
var site = require('../controllers/site');
var wechat = require('../controllers/wechat');
var dec_strategy = require('../controllers/dec_strategy');
var home = require('../controllers/pc/home');
var designer = require('../controllers/pc/designer');
var product = require('../controllers/pc/product');
var response_util = require('../middlewares/response_util');
var auth = require('../middlewares/auth');

var router = express.Router();

// home page
// router.get('/', site.index);
router.get('/', response_util, home.index);
router.get('/index.html|/index.htm', function (req, res, next) {
  res.redirect('/');
});
router.get('/tpl/user/', response_util, site.homePage);
router.get('/download/user/app', response_util, site.download_user_app);
router.get('/download/user/apk', response_util, site.download_user_apk);
router.get('/download/designer/apk', response_util, site.download_designer_apk);
// router.post('/signup', sign.signup);
// router.post('/login', sign.login);
// router.get('/tpl/article/detail.html', response_util, dec_strategy.dec_strategy_homepage); //要被废弃掉 SEO不友好
router.get('/tpl/article/strategy/:_id', response_util, dec_strategy.dec_strategy_homepage);
router.get('/tpl/designer/:designerid', response_util, designer.designer_page);
router.get('/tpl/product/:productid', response_util, product.product_page);
router.get('/tpl/user/designer/homepage', auth.designerRequired, response_util, designer.designer_my_homepage);

router.get('/wechat/user_login_callback', sign.wechat_user_login_callback);
router.get('/wechat/user_login', sign.wechat_user_login);
router.get('/wechat/user_wenjuan/:wenjuanid', wechat.user_wenjuan);
router.get('/wechat/user_wenjuan_callback/:wenjuanid', wechat.user_wenjuan_callback);
module.exports = router;
