var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../proxy').User;
var VerifyCode = require('../proxy').VerifyCode;
var Designer = require('../proxy').Designer;
var tools = require('../common/tools');
var authMiddleWare = require('../middlewares/auth');
var config = require('../apiconfig');
var superagent = require('superagent');
var Image = require('../proxy').Image;
var imageUtil = require('../common/image_util');

exports.wechat_login_callback = function (req, res, next) {
  var code = req.query.code;
  var state = req.query.state;
  var ep = new eventproxy();
  ep.fail(next);

  console.log('code = ' + code);
  console.log('state = ' + code);
  ep.on('access_token_ok', function (sres) {
    superagent.get(
      'https://api.weixin.qq.com/sns/userinfo?access_token=ACCESS_TOKEN&openid=OPENID'
    ).query({
      access_token: sres.access_token,
      openid: sres.openid,
    }).end(ep.done(function (sres) {
      if (sres.ok) {
        console.log(sres.body);
        User.findOne({
          wechat_unionid: wechat_unionid,
        }, null, ep.done(function (user) {
          if (user) {
            //已经登录过
            ep.emit('wechat_not_first_login', user);
          } else {
            //第一次登录
            ep.emit('wechat_first_login', sres);
          }
        }));
      } else {
        res.sendErrMsg('获取个人信息失败，授权失败')
      }
    }));
  });

  ep.on('wechat_not_first_login', function (user_indb) {
    authMiddleWare.gen_session(user_indb,
      type.role_user, req, res);
    if (user_indb.phone) {
      res.redirect(config.user_home_url);
    } else {
      res.redirect('/');
    }
  });

  ep.on('wechat_first_login', function (sres) {
    ep.on('imageid', function (imageid) {
      User.newAndSave({
        wechat_unionid: sres.unionid,
        wechat_openid: sres.openid,
        imageid: imageid,
        sex: sres.sex - 1 + '',
        username: sres.nickname,
      }, ep.done(function (user_indb) {
        // store session cookie
        authMiddleWare.gen_session(user_indb,
          type.role_user, req, res);
        res.redirect('/');
      }));
    });

    if (sres.headimgurl) {
      superagent.get(sres.headimgurl).end(function (err,
        sres) {
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
  });

  if (code) {
    //用户统一授权
    superagent.get(
      'https://api.weixin.qq.com/sns/oauth2/access_token'
    ).query({
      appid: config.wechat_open_web_appid,
      secret: config.wechat_open_web_appsecret,
      code: code,
      grant_type: 'authorization_code',
    }).end(ep.done(function (sres) {
      if (sres.ok) {
        console.log(sres.body);
        ep.emit('access_token_ok', sres);
      } else {
        res.sendErrMsg('获取access_token失败，授权失败');
      }
    }));
  } else {
    //用户拒绝授权
    res.sendErrMsg('用户拒绝授权');
  }
}

//https://open.weixin.qq.com/connect/qrconnect?appid=wxbdc5610cc59c1631&redirect_uri=https%3A%2F%2Fpassport.yhd.com%2Fwechat%2Fcallback.do&response_type=code&scope=snsapi_login&state=894a6cf426cb0cf80c51a2ef7cfdd240#wechat_redirect
