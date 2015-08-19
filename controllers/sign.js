var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../proxy').User;
var VerifyCode = require('../proxy').VerifyCode;
var Designer = require('../proxy').Designer;
var tools = require('../common/tools');
var authMiddleWare = require('../middlewares/auth');

exports.signup = function (req, res, next) {
  var phone = validator.trim(req.body.phone);
  var pass = validator.trim(req.body.pass);
  var rePass = validator.trim(req.body.repass);
  var code = validator.trim(req.body.code);
  var type = validator.trim(req.body.type);

  var ep = new eventproxy();
  ep.fail(next);
  ep.on('err', function (msg) {
    res.status(200);
    res.send({error_msg: msg});
  });

  if ([pass, rePass, phone, type].some(function (item) { return item === ''; })) {
    ep.emit('err', '信息不完整。');
    return;
  }

  if (pass !== rePass) {
    return ep.emit('err', '两次密码输入不一致');
  }

  if (!validator.isIn(type, ['1', '2'])) {
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

    if (type === '1') {
      User.newAndSave(user, function (err, user_indb) {
        if (err) {
          return next(err);
        }

        // store session cookie
        authMiddleWare.gen_session(user_indb, res);
        req.session.userid = user_indb._id;
        req.session.usertype = type;
        res.redirect('/tpl/user/owner.html');
      });
    } else if (type === '2') {
      Designer.newAndSave(user, function (err, user_indb) {
        if (err) {
          return next(err);
        }

        // store session cookie
        authMiddleWare.gen_session(user_indb, res);
        req.session.userid = user_indb._id;
        req.session.usertype = type;
        res.redirect('/tpl/user/designer.html');
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
    res.status(200);
    res.send({error_msg: msg });
  });

  if (!phone || !pass) {
    ep.emit('err', '信息不完整');
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
        req.session.usertype = '1';
        res.redirect('/tpl/user/owner.html');
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
        req.session.usertype = '2';
        res.redirect('/tpl/user/designer.html');
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
};

// sign out
exports.signout = function (req, res, next) {
  req.session.destroy();
  res.clearCookie(config.auth_cookie_name, { path: '/' });
  res.redirect('/');
};
