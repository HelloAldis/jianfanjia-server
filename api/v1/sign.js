var validator = require('validator');
var eventproxy = require('eventproxy');
var Designer = require('../../proxy').Designer;
var User = require('../../proxy').User;
var VerifyCode = require('../../proxy').VerifyCode;
var tools = require('../../common/tools');
var authMiddleWare = require('../../middlewares/auth');
var utility = require('utility');
var sms = require('../../common/sms');
var ApiUtil = require('../../common/api_util');
var type = require('../../type');

exports.updatePass = function (req, res, next) {
  var phone = tools.trim(req.body.phone);
  var pass = tools.trim(req.body.pass);
  var code = tools.trim(req.body.code);

  var ep = new eventproxy();
  ep.fail(next);
  ep.on('user_err', function (msg) {
    res.sendErrMsg(msg);
  });

  if ([phone, code, pass].some(function (item) {
      return item === '';
    })) {
    ep.emit('user_err', '信息不完整');
    return;
  }

  //检查phone是不是被用了
  ep.all('user', 'designer', function (user, designer) {
    if (user || designer) {
      var user = user || designer;
      tools.bhash(pass, ep.done(function (passhash) {
        user.pass = passhash;

        user.save(function (err) {
          if (err) {
            return next(err);
          }
          return res.sendSuccessMsg();
        });
      }));
    } else {
      return ep.emit('user_err', '用户不存在');
    }
  });

  VerifyCode.getCodeByPhone(phone, function (err, verifyCode) {
    if (err) {
      return next(err);
    }

    //暂时关闭验证码功能
    // if (!verifyCode) {
    //   return ep.emit('user_err', '验证码不对');
    // }
    //
    // if (verifyCode.code !== code) {
    //   return ep.emit('user_err', '验证码不对');
    // }

    User.getUserByPhone(phone, function (err, user) {
      if (err) {
        return next(err);
      }

      ep.emit('user', user);
    });

    Designer.findOne({
      phone: phone
    }, {}, function (err, designer) {
      if (err) {
        return next(err);
      }

      ep.emit('designer', designer);
    });
  });
};

exports.sendVerifyCode = function (req, res, next) {
  var phone = tools.trim(req.body.phone);

  var ep = new eventproxy();
  ep.fail(next);
  ep.on('user_err', function (msg) {
    res.sendErrMsg(msg);
  });

  if (phone === '') {
    return ep.emit('user_err', '信息不完整');
  }

  var code = utility.randomString(6, '0123456789');
  VerifyCode.saveOrUpdate(phone, code, function (err) {
    if (err) {
      return next(err);
    }

    sms.sendVerifyCode(phone, code);
    res.sendSuccessMsg();
  });
}

exports.signup = function (req, res, next) {
  var phone = validator.trim(req.body.phone);
  var pass = validator.trim(req.body.pass);
  var code = validator.trim(req.body.code);
  var usertype = validator.trim(req.body.type);

  var ep = new eventproxy();
  ep.fail(next);
  ep.on('err', function (msg) {
    res.sendErrMsg(msg);
  });

  if ([pass, phone, usertype].some(function (item) {
      return item === '';
    })) {
    ep.emit('err', '信息不完整。');
    return;
  }

  if (!validator.isIn(usertype, [type.role_designer, type.role_user])) {
    return ep.emit('err', '类型不对');
  }

  ep.on('phone_ok', function () {
    //用户名手机号验证通过
    VerifyCode.getCodeByPhone(phone, function (err, verifyCode) {
      if (err) {
        return next(err);
      }

      // if (verifyCode) {
      // if (code === verifyCode.code) {
      tools.bhash(pass, ep.done(function (passhash) {
        ep.emit('final', passhash);
      }));
      //   } else {
      //     return ep.emit('err', '验证码不对或已过期');
      //   }
      // } else {
      //   return ep.emit('err', '验证码不对或已过期');
      // }
    });
  });

  ep.on('final', function (passhash) {
    //save user to db
    var user = {};
    user.pass = passhash;
    user.phone = phone;

    if (usertype === type.role_user) {
      User.newAndSave(user, function (err, user_indb) {
        if (err) {
          return next(err);
        }

        // store session cookie
        authMiddleWare.gen_session(user_indb, usertype, req, res);

        var data = {};
        data.usertype = usertype;
        data.phone = user_indb.phone;
        data.username = user_indb.username;
        data._id = user_indb._id;
        data.imageid = user_indb.imageid;
        res.sendData(data);
      });
    } else if (usertype === type.role_designer) {
      Designer.newAndSave(user, function (err, user_indb) {
        if (err) {
          return next(err);
        }

        // store session cookie
        authMiddleWare.gen_session(user_indb, usertype, req, res);

        var data = {};
        data.usertype = usertype;
        data.phone = user_indb.phone;
        data.username = user_indb.username;
        data._id = user_indb._id;
        data.imageid = user_indb.imageid;
        res.sendData(data);
      });
    }
  });

  //检查phone是不是被用了
  ep.all('user', 'designer', function (user, designer) {
    if (user || designer) {
      ep.emit('err', '手机号码已被使用');
    } else {
      ep.emit('phone_ok');
    }
  });


  User.getUserByPhone(phone, function (err, user) {
    if (err) {
      return next(err);
    }

    ep.emit('user', user);
  });

  Designer.findOne({
    phone: phone
  }, {}, function (err, designer) {
    if (err) {
      return next(err);
    }

    ep.emit('designer', designer);
  });
};

exports.login = function (req, res, next) {
  var phone = validator.trim(req.body.phone);
  var pass = validator.trim(req.body.pass);
  var ep = new eventproxy();

  ep.fail(next);
  ep.on('err', function (msg) {
    res.sendErrMsg(msg);
    return;
  });

  if (!phone || !pass) {
    return ep.emit('err', '信息不完整');
  }

  ep.all('user', 'designer', function (user, designer) {
    if (user && !designer) {
      //业主登录
      var passhash = user.pass;
      tools.bcompare(pass, passhash, ep.done(function (bool) {
        if (!bool) {
          return ep.emit('err', '用户名或密码错误');
        }

        // store session cookie
        authMiddleWare.gen_session(user, type.role_user, req, res);

        var data = {};
        data.usertype = type.role_user;
        data.phone = user.phone;
        data.username = user.username;
        data._id = user._id;
        data.imageid = user.imageid;
        res.sendData(data);
      }));
    } else if (!user && designer) {
      //设计师登录
      var passhash = designer.pass;
      tools.bcompare(pass, passhash, ep.done(function (bool) {
        if (!bool) {
          return ep.emit('err', '用户名或密码错误');
        }

        // store session cookie
        authMiddleWare.gen_session(designer, type.role_designer,
          req, res);

        var data = {};
        data.usertype = type.role_designer;
        data.phone = designer.phone;
        data.username = designer.username;
        data._id = designer._id;
        data.imageid = designer.imageid;
        res.sendData(data);
      }));
    } else {
      return ep.emit('err', '用户名或密码错误');
    }
  });


  User.getUserByPhone(phone, function (err, user) {
    if (err) {
      return next(err);
    }

    ep.emit('user', user);
  });

  Designer.findOne({
    phone: phone
  }, {}, function (err, designer) {
    if (err) {
      return next(err);
    }

    ep.emit('designer', designer);
  });
}

// sign out
exports.signout = function (req, res, next) {
  authMiddleWare.clear_session(req, res);
  res.sendSuccessMsg();
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

  User.getUserByPhone(phone, function (err, user) {
    if (err) {
      return next(err);
    }

    ep.emit('user', user);
  });

  Designer.findOne({
    phone: phone
  }, {}, function (err, designer) {
    if (err) {
      return next(err);
    }

    ep.emit('designer', designer);
  });
}
