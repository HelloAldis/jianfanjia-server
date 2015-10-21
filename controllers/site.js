var config = require('../apiconfig');
var ApiUtil = require('../common/api_util');
var type = require('../type');

exports.index = function (req, res, next) {
  res.redirect('/tpl/index/index.html');
}

exports.homePage = function (req, res, next) {
  var usertype = ApiUtil.getUsertype(req);

  if (usertype === type.role_user) {
    res.redirect('/tpl/user/owner.html');
  } else if (usertype === type.role_designer) {
    res.redirect('/tpl/user/design.html');
  }
}
