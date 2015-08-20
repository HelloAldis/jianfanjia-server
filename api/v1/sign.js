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
  var phone   = tools.trim(req.body.phone);
  var pass   = tools.trim(req.body.pass);
  var repass = tools.trim(req.body.repass);
  var code   = tools.trim(req.body.code);

  var ep = new eventproxy();
  ep.fail(next);
  ep.on('user_err', function (msg) {
    res.sendErrMsg(msg);
  });

  if ([phone, code, pass, repass].some(function (item) { return item === ''; })) {
    ep.emit('user_err', '信息不完整');
    return;
  }

  if (pass !== repass) {
    return ep.emit('user_err', '两次密码输入不一致');
  }

  VerifyCode.getCodeByPhone(phone, function (err, verifyCode) {
    if (err) {
      return next(err);
    }

    if (verifyCode.code !== code) {
      return ep.emit('user_err', '验证码不对');
    }

    User.getUserByPhone(phone, function (err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return rep.emit('user_err', '用户不存在');;
      }

      tools.bhash(pass, ep.done(function (passhash) {
        user.pass          = passhash;

        user.save(function (err) {
          if (err) {
            return next(err);
          }
          return res.sendSuccessMsg();
        });
      }));
    });
  });
};

exports.sendVerifyCode = function (req, res, next) {
  var phone   = tools.trim(req.body.phone);

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

    var content = '[简繁家]www.jianfanjia.com 您的验证码是：' + code
    + '。5分钟内有效,如非您本人请忽略.';
    // var content = '【微米】您的验证码是：610912，。如非您本人操作，可忽略本消息。';

    sms.send(phone, content);
    res.sendSuccessMsg();
  });
}

exports.signup = function (req, res, next) {
  var phone = validator.trim(req.body.phone);
  var pass = validator.trim(req.body.pass);
  var rePass = validator.trim(req.body.repass);
  var code = validator.trim(req.body.code);
  var type = validator.trim(req.body.type);

  var ep = new eventproxy();
  ep.fail(next);
  ep.on('err', function (msg) {
    res.sendErrMsg(msg);
  });

  if ([pass, rePass, phone, type].some(function (item) { return item === ''; })) {
    ep.emit('err', '信息不完整。');
    return;
  }

  if (pass !== rePass) {
    return ep.emit('err', '两次密码输入不一致');
  }

  if (!validator.isIn(type, [type.role.designer, type.role.user])) {
    return ep.emit('err', '类型不对');
  }

  ep.on('phone_ok', function () {
    //用户名手机号验证通过
    VerifyCode.getCodeByPhone(phone, function (err, code) {
      if (err) {
        return next(err);
      }

      if (code !== code) {
        return ep.emit('err', '验证码不对或已过期');
      }

      tools.bhash(pass, ep.done(function (passhash) {
        ep.emit('final', passhash);
      }));
    });
  });

  ep.on('final', function (passhash) {
    //save user to db
    var user = {};
    user.pass        = passhash;
    user.phone       = phone;

    if (type === type.role.designer) {
      User.newAndSave(user, function (err, user_indb) {
        if (err) {
          return next(err);
        }

        // store session cookie
        authMiddleWare.gen_session(user_indb, res);
        req.session.userid = user_indb._id;
        req.session.usertype = type;

        var data = {};
        data.usertype = type;
        data.phone = user_indb.phone;
        data.username = user_indb.username;
        res.sendData(data);
      });
    } else if (type === type.role.designer) {
      Designer.newAndSave(user, function (err, user_indb) {
        if (err) {
          return next(err);
        }

        // store session cookie
        authMiddleWare.gen_session(user_indb, res);
        req.session.userid = user_indb._id;
        req.session.usertype = type;

        var data = {};
        data.usertype = type;
        data.phone = user_indb.phone;
        data.username = user_indb.username;
        res.sendData(data);
      });
    }
  });

  //检查phone是不是被用了
  ep.all('user', 'designer', function (user, designer) {
    if (user || designer) {
      ep.emit('err', '用户名或手机号码已被使用');
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

  Designer.getDesignerByPhone(phone, function (err, designer) {
    if (err) {
      return next(err);
    }

    ep.emit('designer', designer);
  });
};

exports.login = function (req, res, next) {
  var phone = validator.trim(req.body.phone);
  var pass      = validator.trim(req.body.pass);
  var ep        = new eventproxy();

  ep.fail(next);
  ep.on('err', function (msg) {
    res.sendSuccessMsg();
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
        authMiddleWare.gen_session(user, res);
        req.session.userid = user._id;
        req.session.usertype = type.role.user;

        var data = {};
        data.usertype = type.role.user;
        data.phone = user.phone;
        data.username = user.username;
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
        authMiddleWare.gen_session(designer, res);
        req.session.userid = designer._id;
        req.session.usertype = type.role.designer;

        var data = {};
        data.usertype = type.role.designer;
        data.phone = designer.phone;
        data.username = designer.username;
        res.sendData(data);
      }));
    } else {
      return  ep.emit('err', '用户名或密码错误');
    }
  });


  User.getUserByPhone(phone, function (err, user) {
    if (err) {
      return next(err);
    }

    ep.emit('user', user);
  });

  Designer.getDesignerByPhone(phone, function (err, designer) {
    if (err) {
      return next(err);
    }

    ep.emit('designer', designer);
  });
}
