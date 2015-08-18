var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../proxy').User;
var VerifyCode = require('../../proxy').VerifyCode;
var tools = require('../../common/tools');
var authMiddleWare = require('../../middlewares/auth');
var utility = require('utility');
var sms = require('../../common/sms');

exports.updatePass = function (req, res, next) {
  var phone   = tools.trim(req.body.phone);
  var pass   = tools.trim(req.body.pass);
  var repass = tools.trim(req.body.repass);
  var code   = tools.trim(req.body.code);

  var ep = new eventproxy();
  ep.fail(next);
  ep.on('user_err', function (msg) {
    res.status(200);
    res.send({error_msg: msg });
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
          return res.send({msg: '密码更新成功'});
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
    res.status(200);
    res.send({error_msg: msg });
  });

  if (phone === '') {
    return ep.emit('user_err', '信息不完整');
  }

  var code = utility.randomString(6, '0123456789');
  VerifyCode.saveOrUpdate(phone, code, function (err) {
    if (err) {
      return next(err);
    }

    // var content = '[简繁家 www.jianfanjia.com]您的验证码是：' + code
    // + '。不要告知他人,如非您本人请忽略。';
    var content = '【微米】您的验证码是：610912，3分钟内有效。如非您本人操作，可忽略本消息。';

    sms.send(phone, content);
    res.send({msg: '发送成功'});
  });
}
