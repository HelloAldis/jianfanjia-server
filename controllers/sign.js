var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../proxy').User;
var VerifyCode = require('../proxy').VerifyCode;
var Designer = require('../proxy').Designer;
var tools = require('../common/tools');
var authMiddleWare = require('../middlewares/auth');

// sign out
exports.signout = function (req, res, next) {
  req.session.destroy();
  res.clearCookie(config.auth_cookie_name, { path: '/' });
  res.redirect('/');
};
