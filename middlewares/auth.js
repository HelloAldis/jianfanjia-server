var mongoose   = require('mongoose');
var UserModel  = mongoose.model('User');
var Message    = require('../proxy').Message;
var config     = require('../config');
var eventproxy = require('eventproxy');
var UserProxy  = require('../proxy').User;
var type = require('../type');


/**
 * 需要通用用户登录
 */
exports.normalUserRequired = function (req, res, next) {
  if (!req.session.userid) {
    return res.status(403).send('forbidden!');
  }

  next();
};

/**
 * 需要业主登录
 */
exports.userRequired = function (req, res, next) {
  if (req.session.usertype !== type.role.user &&
    req.session.usertype !== type.role.admin) {
    return res.status(403).send('forbidden!');
  }

  next();
};

/**
 * 需要设计师登录
 */
exports.designerRequired = function (req, res, next) {
  if (req.session.usertype !== type.role.designer &&
    req.session.usertype !== type.role.admin) {
    return res.status(403).send('forbidden!');
  }

  next();
};

/**
 * 需要admin登录
 */
exports.adminRequired = function (req, res, next) {
  if (req.session.usertype !== type.role.admin) {
    return res.status(403).send('forbidden!');
  }

  next();
};

function gen_session(user, res) {
  var auth_token = user._id + '$$$$'; // 以后可能会存储更多信息，用 $$$$ 来分隔
  var opts = {
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 30,
    signed: true,
    httpOnly: true
  };
  res.cookie(config.auth_cookie_name, auth_token, opts); //cookie 有效期30天
}

exports.gen_session = gen_session;

// 验证用户是否登录
exports.authUser = function (req, res, next) {
  var ep = new eventproxy();
  ep.fail(next);

  ep.all('get_user', function (userid) {
    if (!userid) {
      return next();
    }

    req.session.userid = userid;
    return next();
  });

  if (req.session.userid) {
    ep.emit('get_user', req.session.userid);
  } else {
    var auth_token = req.signedCookies[config.auth_cookie_name];
    if (!auth_token) {
      return next();
    }

    var auth = auth_token.split('$$$$');
    var user_id = auth[0];
    ep.emit('get_user', user_id);
  }
};

// exports.apiAuth = function (req, res, next) {
//   if (req.session.user) {
//     next();
//     return;
//   }
//
//   var ep = new eventproxy();
//   ep.fail(next);
//
//   var accessToken = req.body.accesstoken || req.query.accesstoken;
//   accessToken = validator.trim(accessToken);
//
//   UserModel.findOne({accessToken: accessToken}, ep.done(function (user) {
//     if (!user) {
//       res.status(403);
//       return res.send({error_msg: 'wrong accessToken'});
//     }
//     req.user = user;
//     next();
//   }));
//
// };
