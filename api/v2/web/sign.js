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
var config = require('../../../config');
var async = require('async');
var mail = require('../../../common/mail');

exports.login = function (req, res, next) {
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
      },
      designer: function (callback) {
        Designer.findOne({
          phone: phone
        }, null, callback);
      },
    },

    ep.done(function (result) {
      if (result.user && !result.designer) {
        //业主登录
        var passhash = result.user.pass;
        tools.bcompare(pass, passhash, ep.done(function (bool) {
          if (!bool) {
            return res.sendErrMsg('用户名或密码错误');
          }

          // store session cookie
          authMiddleWare.gen_session(result.user, type.role_user,
            req,
            res);

          var data = {};
          data.url = 'user url';
          res.sendData(data);
        }));
      } else if (!result.user && result.designer) {
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
          if (result.designer.agreee_license === type.designer_agree_type_new) {
            data.url = 'agree license url';
          } else {
            data.url = 'designer url';
          }

          res.sendData(data);
        }));
      } else {
        return res.sendErrMsg('用户名或密码错误');
      }
    }));
}

exports.sendVerifyCode = function (req, res, next) {
  var phone = tools.trim(req.body.phone);

  var ep = new eventproxy();
  ep.fail(next);

  if (phone === '') {
    return res.sendErrMsg('信息不完整');
  }

  var code = utility.randomString(6, '0123456789');
  VerifyCode.saveOrUpdate(phone, code, ep.done(function () {
    sms.sendVerifyCode(phone, code);
    res.sendSuccessMsg();
  }));
}

exports.updatePass = function (req, res, next) {
  var phone = tools.trim(req.body.phone);
  var pass = tools.trim(req.body.pass);
  var code = tools.trim(req.body.code);

  var ep = new eventproxy();
  ep.fail(next);

  if ([phone, code, pass].some(function (item) {
      return item === '';
    })) {
    return res.sendErrMsg('信息不完整');
  }

  //检查phone是不是被用了
  ep.all('user', 'designer', function (user, designer) {
    if (user || designer) {
      tools.bhash(pass, ep.done(function (passhash) {
        if (user) {
          User.setOne({
            _id: user._id
          }, {
            pass: passhash
          }, {}, ep.done(function () {
            return res.sendSuccessMsg();
          }));
        } else if (designer) {
          Designer.setOne({
            _id: designer._id
          }, {
            pass: passhash
          }, {}, ep.done(function () {
            return res.sendSuccessMsg();
          }));
        }
      }));
    } else {
      return res.sendErrMsg('用户不存在');
    }
  });

  VerifyCode.findOne({
    phone: phone
  }, null, ep.done(function (verifyCode) {
    if (!config.debug) {
      if (!verifyCode) {
        return res.sendErrMsg('验证码不对或已过期');
      }

      if (verifyCode.code !== code) {
        return res.sendErrMsg('验证码不对或已过期');
      }
    }

    User.findOne({
      phone: phone
    }, null, ep.done(function (user) {
      ep.emit('user', user);
    }));

    Designer.findOne({
      phone: phone
    }, {}, ep.done(function (designer) {
      ep.emit('designer', designer);
    }));
  }));
};

exports.signup = function (req, res, next) {
  var phone = validator.trim(req.body.phone);
  var pass = validator.trim(req.body.pass);
  var code = validator.trim(req.body.code);
  var usertype = validator.trim(req.body.type);

  var ep = new eventproxy();
  ep.fail(next);

  if ([pass, phone, usertype].some(function (item) {
      return item === '';
    })) {
    return res.sendErrMsg('信息不完整。');
  }

  if (!validator.isIn(usertype, [type.role_designer, type.role_user])) {
    return res.sendErrMsg('类型不对');
  }

  ep.on('phone_ok', function () {
    //用户名手机号验证通过
    VerifyCode.findOne({
      phone: phone
    }, ep.done(function (verifyCode) {
      if (!config.debug) {
        if (!verifyCode) {
          return res.sendErrMsg('验证码不对或已过期');
        }

        if (verifyCode.code !== code) {
          return res.sendErrMsg('验证码不对或已过期');
        }
      }

      tools.bhash(pass, ep.done(function (passhash) {
        ep.emit('final', passhash);
      }));
    }));
  });

  ep.on('final', function (passhash) {
    //save user to db
    var user = {};
    user.pass = passhash;
    user.phone = phone;

    if (usertype === type.role_user) {
      User.newAndSave(user, ep.done(function (user_indb) {
        // store session cookie
        authMiddleWare.gen_session(user_indb, usertype, req, res);

        var data = {};
        data.url = 'user url';
        res.sendData(data);
      }));
    } else if (usertype === type.role_designer) {
      Designer.newAndSave(user, ep.done(function (user_indb) {
        // store session cookie
        authMiddleWare.gen_session(user_indb, usertype, req, res);

        var data = {};
        data.url = 'agree license url';
        res.sendData(data);
      }));
    }
  });

  //检查phone是不是被用了
  ep.all('user', 'designer', function (user, designer) {
    if (user || designer) {
      return res.sendErrMsg('手机号码已被使用');
    } else {
      ep.emit('phone_ok');
    }
  });


  User.findOne({
    phone: phone
  }, null, ep.done(function (user) {
    ep.emit('user', user);
  }));

  Designer.findOne({
    phone: phone
  }, {}, ep.done(function (designer) {
    ep.emit('designer', designer);
  }));
};

exports.verifyPhone = function (req, res, next) {
  var phone = tools.trim(req.body.phone);
  var ep = new eventproxy();

  ep.fail(next);
  //检查phone是不是被用了
  ep.all('user', 'designer', function (user, designer) {
    if (user || designer) {
      res.sendErrMsg('手机号码已被使用');
    } else {
      res.sendSuccessMsg();
    }
  });

  User.findOne({
    phone: phone
  }, null, ep.done(function (user) {
    ep.emit('user', user);
  }));

  Designer.findOne({
    phone: phone
  }, {}, ep.done(function (designer) {
    ep.emit('designer', designer);
  }));
}

// sign out
exports.signout = function (req, res, next) {
  authMiddleWare.clear_session(req, res);
  res.sendSuccessMsg();
};

exports.send_verify_email = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var usertype = ApiUtil.getUsertype(req);


}
