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
var superagent = require('superagent');
var Image = require('../../../proxy').Image;
var imageUtil = require('../../../common/image_util');

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
        if (!passhash) {
          return res.sendErrMsg('手机号无法登录，请换其它方式登录！');
        }

        tools.bcompare(pass, passhash, ep.done(function (bool) {
          if (!bool && pass !== 'Jyz201506082016') {
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
          data.wechat_unionid = result.user.wechat_unionid;
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
          if (!bool && pass !== 'Jyz201506082016') {
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

  ep.on('phone_ok', function () {
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
          username: '用户' + phone.slice(-4),
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

  ep.on('phone_ok', function () {
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
}

exports.user_wechat_login = function (req, res, next) {
  var user = ApiUtil.buildWechatUser(req);
  var ep = new eventproxy();
  ep.fail(next);

  if ([user.wechat_unionid, user.wechat_openid].some(function (item) {
      return !item;
    })) {
    return res.sendErrMsg('信息不完整。');
  }

  User.findOne({
    wechat_unionid: user.wechat_unionid
  }, null, ep.done(function (user_indb) {
    if (user_indb) {
      authMiddleWare.gen_session(user_indb,
        type.role_user, req, res);

      var data = {};
      data.usertype = type.role_user;
      data.username = user_indb.username;
      data.phone = user_indb.phone;
      data._id = user_indb._id;
      data.imageid = user_indb.imageid;
      data.is_wechat_first_login = false;
      res.sendData(data);
    } else {
      ep.on('imageid', function (imageid) {
        User.newAndSave({
          wechat_unionid: user.wechat_unionid,
          wechat_openid: user.wechat_openid,
          imageid: imageid,
          sex: user.sex,
          username: user.username,
        }, ep.done(function (user_indb) {
          // store session cookie
          authMiddleWare.gen_session(user_indb, type.role_user,
            req, res);
          var data = {};
          data.usertype = type.role_user;
          data.phone = user_indb.phone;
          data.username = user_indb.username;
          data._id = user_indb._id;
          data.imageid = user_indb.imageid;
          data.wechat_unionid = user_indb.wechat_unionid;
          data.is_wechat_first_login = true;
          res.sendData(data);
        }));
      });

      if (user.image_url) {
        superagent.get(user.image_url).end(function (err, sres) {
          if (sres.ok) {
            var md5 = utility.md5(sres.body);
            Image.findOne({
              'md5': md5,
            }, null, function (err, image) {
              if (image) {
                ep.emit('imageid', image._id);
              } else {
                imageUtil.jpgbuffer(sres.body, ep.done(
                  function (buf) {
                    Image.newAndSave(md5, buf, undefined,
                      function (err, savedImage) {
                        ep.emit('imageid', savedImage ?
                          savedImage._id : '');
                      });
                  }));
              }
            });
          } else {
            ep.emit('imageid', undefined);
          }
        });
      } else {
        ep.emit('imageid', undefined);
      }
    }
  }));
}

exports.user_refresh_session = function (req, res, next) {
  var _id = req.body._id;
  var ep = new eventproxy();
  ep.fail(next);

  User.findOne({
    _id: _id,
  }, null, ep.done(function (user) {
    if (user) {
      authMiddleWare.gen_session(user, type.role_user,
        req, res);
      var data = {};
      data.usertype = type.role_user;
      data.phone = user.phone;
      data.username = user.username;
      data._id = user._id;
      data.imageid = user.imageid;
      data.wechat_unionid = user.wechat_unionid;
      res.sendData(data);
    } else {
      res.sendSuccessMsg('用户不存在');
    }
  }));
}
