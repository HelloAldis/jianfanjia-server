var validator = require('validator');
var eventproxy = require('eventproxy');
var Designer = require('../../../proxy').Designer;
var User = require('../../../proxy').User;
var VerifyCode = require('../../../proxy').VerifyCode;
var tools = require('../../../common/tools');
var authMiddleWare = require('../../../middlewares/auth');
var utility = require('utility');
var sms = require('../../../common/sms');
var ApiUtil = require('../../../common/api_util');
var type = require('../../../type');
var config = require('../../../apiconfig');
var async = require('async');

exports.user_login = function (req, res, next) {
  var phone = validator.trim(req.body.phone);
  var pass = validator.trim(req.body.pass);
  var ep = new eventproxy();
  ep.fail(next);

  if (!phone || !pass) {
    return res.sendErrMsg('信息不完整');
  }

  async.parallel({
      user: function (callback) {
        User.findOne({
          phone: phone
        }, null, callback);
      }
    },

    ep.done(function (result) {
      if (result.user) {
        //业主登录
        var passhash = result.user.pass;
        tools.bcompare(pass, passhash, ep.done(function (bool) {
          if (!bool) {
            return res.sendErrMsg('用户名或密码错误');
          }

          // store session cookie
          authMiddleWare.gen_session(result.user, type.role_user,
            req, res);

          var data = {};
          data.usertype = type.role_user;
          data.phone = result.user.phone;
          data.username = result.user.username;
          data._id = result.user._id;
          data.imageid = result.user.imageid;
          res.sendData(data);
        }));
      } else {
        return res.sendErrMsg('用户名或密码错误');
      }
    }));
}

exports.designer_login = function (req, res, next) {
  var phone = validator.trim(req.body.phone);
  var pass = validator.trim(req.body.pass);
  var ep = new eventproxy();
  ep.fail(next);

  if (!phone || !pass) {
    return res.sendErrMsg('信息不完整');
  }

  async.parallel({
      designer: function (callback) {
        Designer.findOne({
          phone: phone
        }, null, callback);
      }
    },

    ep.done(function (result) {
      console.log(result);
      if (result.designer) {
        //设计师登录
        var passhash = result.designer.pass;
        tools.bcompare(pass, passhash, ep.done(function (bool) {
          if (!bool) {
            return res.sendErrMsg('用户名或密码错误');
          }

          // store session cookie
          authMiddleWare.gen_session(result.designer, type.role_designer,
            req, res);

          var data = {};
          data.usertype = type.role_designer;
          data.phone = result.designer.phone;
          data.username = result.designer.username;
          data._id = result.designer._id;
          data.imageid = result.designer.imageid;
          res.sendData(data);

          Designer.incOne({
            _id: result.designer._id
          }, {
            login_count: 1
          }, {});
        }));
      } else {
        return res.sendErrMsg('用户名或密码错误');
      }
    }));
}

exports.user_signup = function (req, res, next) {
  var phone = validator.trim(req.body.phone);
  var pass = validator.trim(req.body.pass);
  var code = validator.trim(req.body.code);
  var usertype = type.role_user;
  var ep = new eventproxy();
  ep.fail(next);

  if ([pass, phone, code].some(function (item) {
      return item === '';
    })) {
    return res.sendErrMsg('信息不完整。');
  }

  User.findOne({
    phone: phone
  }, null, ep.done(function (user) {
    if (user) {
      return res.sendErrMsg('手机号码已被使用');
    } else {
      //用户名手机号验证通过
      VerifyCode.findOne({
        phone: phone
      }, ep.done(function (verifyCode) {
        if (config.need_verify_code) {
          if (!verifyCode) {
            return res.sendErrMsg('验证码不对或已过期');
          }

          if (verifyCode.code !== code) {
            return res.sendErrMsg('验证码不对或已过期');
          }
        }

        tools.bhash(pass, ep.done(function (passhash) {
          User.newAndSave({
            pass: passhash,
            phone: phone,
            username: '尾号' + phone.slice(-4),
          }, ep.done(function (user_indb) {
            // store session cookie
            authMiddleWare.gen_session(user_indb,
              usertype, req, res);

            var data = {};
            data.usertype = type.role_user;
            data.phone = user_indb.phone;
            data.username = user_indb.username;
            data._id = user_indb._id;
            data.imageid = user_indb.imageid;
            res.sendData(data);
          }));
        }));
      }));
    }
  }));
}

exports.designer_signup = function (req, res, next) {
  var phone = validator.trim(req.body.phone);
  var pass = validator.trim(req.body.pass);
  var code = validator.trim(req.body.code);
  var usertype = type.role_designer;
  var ep = new eventproxy();
  ep.fail(next);

  if ([pass, phone, code].some(function (item) {
      return item === '';
    })) {
    return res.sendErrMsg('信息不完整。');
  }

  Designer.findOne({
    phone: phone
  }, null, ep.done(function (designer) {
    if (designer) {
      return res.sendErrMsg('手机号码已被使用');
    } else {
      //用户名手机号验证通过
      VerifyCode.findOne({
        phone: phone
      }, ep.done(function (verifyCode) {
        if (config.need_verify_code) {
          if (!verifyCode) {
            return res.sendErrMsg('验证码不对或已过期');
          }

          if (verifyCode.code !== code) {
            return res.sendErrMsg('验证码不对或已过期');
          }
        }

        tools.bhash(pass, ep.done(function (passhash) {
          Designer.newAndSave({
            phone: phone,
            pass: passhash,
          }, ep.done(function (user_indb) {
            // store session cookie
            authMiddleWare.gen_session(user_indb,
              usertype, req, res);

            var data = {};
            data.usertype = type.role_designer;
            data.phone = user_indb.phone;
            data._id = user_indb._id;
            data.imageid = user_indb.imageid;
            res.sendData(data);
          }));
        }));
      }));
    }
  }));
}
