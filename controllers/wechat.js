var eventproxy = require('eventproxy');
var User = require('../proxy').User;
var authMiddleWare = require('../middlewares/auth');
var config = require('../apiconfig');
var superagent = require('superagent');
var Image = require('../proxy').Image;
var imageUtil = require('../common/image_util');
var type = require('../type');
var utility = require('utility');
var logger = require('../common/logger');

exports.user_wenjuan = function (req, res, next) {
  var wenjuanid = req.params.wenjuanid;
  var redirect_uri =
    'http%3a%2f%2f{host}%2fwechat%2fuser_wenjuan_callback%2f{wenjuanid}';
  var url =
    'https://open.weixin.qq.com/connect/oauth2/authorize?appid={appid}&redirect_uri={redirect_uri}&response_type=code&scope=snsapi_userinfo&state={state}#wechat_redirect';
  var state = utility.randomString(16, 'abcdef0123456789');
  redirect_uri = redirect_uri.replace(/{host}/g, req.headers.host).replace(
    /{wenjuanid}/g, wenjuanid);
  var url = url.replace(/{appid}/g, config.wechat_appid).replace(
    /{redirect_uri}/g, redirect_uri).replace(/{state}/g, state);
  res.redirect(url);
}

function wechat_auth(req, res, next, redirect) {
  var code = req.query.code;
  var state = req.query.state;
  var ep = new eventproxy();
  ep.fail(next);

  logger.debug('code = ' + code);
  logger.debug('state = ' + state);
  ep.on('access_token_ok', function (sres) {
    superagent.get(
      'https://api.weixin.qq.com/sns/userinfo'
    ).query({
      access_token: sres.body.access_token,
      openid: sres.body.openid,
    }).end(ep.done(function (sres) {
      sres.body = JSON.parse(sres.text);
      logger.debug(sres.body);
      if (sres.ok && sres.body.unionid) {
        User.findOne({
          wechat_unionid: sres.body.unionid,
        }, null, ep.done(function (user) {
          if (user) {
            //已经登录过
            ep.emit('wechat_not_first_login', user, sres);
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

  ep.on('wechat_not_first_login', function (user_indb, sres) {
    ep.on('imageid', function (imageid) {
      user_indb.wechat_openid = sres.body.openid;
      user_indb.imageid = imageid;
      user_indb.username = sres.body.nickname;
      user_indb.save(function () {
        // store session cookie
        authMiddleWare.gen_session(user_indb,
          type.role_user, req, res);
        res.redirect(redirect);
      });
    });

    logger.debug('sres.body.headimgurl = ' + sres.body.headimgurl);
    if (sres.body.headimgurl) {
      superagent.get(sres.body.headimgurl).end(function (err, sres) {
        if (sres.ok) {
          var md5 = utility.md5(sres.body);
          logger.debug(sres.body);
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

  ep.on('wechat_first_login', function (sres) {
    ep.on('imageid', function (imageid) {
      User.newAndSave({
        wechat_unionid: sres.body.unionid,
        wechat_openid: sres.body.openid,
        imageid: imageid,
        sex: sres.body.sex - 1 + '',
        username: sres.body.nickname,
        platform_check: type.platform_wechat
      }, ep.done(function (user_indb) {
        // store session cookie
        authMiddleWare.gen_session(user_indb,
          type.role_user, req, res);
        res.redirect(redirect);
      }));
    });

    logger.debug('sres.body.headimgurl = ' + sres.body.headimgurl);
    if (sres.body.headimgurl) {
      superagent.get(sres.body.headimgurl).end(function (err, sres) {
        if (sres.ok) {
          var md5 = utility.md5(sres.body);
          logger.debug(sres.body);
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
      appid: config.wechat_appid,
      secret: config.wechat_app_Secret,
      code: code,
      grant_type: 'authorization_code',
    }).end(ep.done(function (sres) {
      sres.body = JSON.parse(sres.text);
      logger.debug(sres.body);
      if (sres.ok && sres.body.access_token && sres.body.openid) {
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

exports.user_wenjuan_callback = function (req, res, next) {
  var wenjuanid = req.params.wenjuanid;
  var ep = new eventproxy();
  ep.fail(next);

  var wenjuan_url = ['', '/weixin/survey/index.html', ''];
  wechat_auth(req, res, next, wenjuan_url[wenjuanid]);
}
