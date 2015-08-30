var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var config = require('../config');
var eventproxy = require('eventproxy');
var UserProxy = require('../proxy').User;
var type = require('../type');
var ApiUtil = require('../common/api_util');
var _ = require('lodash');

/**
 * 需要通用用户登录
 */
exports.normalUserRequired = function (req, res, next) {
  if (!ApiUtil.getUserid(req)) {
    return res.status(403).send('forbidden!');
  }

  next();
};

/**
 * 需要业主登录
 */
exports.userRequired = function (req, res, next) {
  if (ApiUtil.getUsertype(req) !== type.role_user &&
    ApiUtil.getUsertype(req) !== type.role_admin) {
    return res.status(403).send('forbidden!');
  }

  next();
};

/**
 * 需要设计师登录
 */
exports.designerRequired = function (req, res, next) {
  if (ApiUtil.getUsertype(req) !== type.role_designer &&
    ApiUtil.getUsertype(req) !== type.role_admin) {
    return res.status(403).send('forbidden!');
  }

  next();
};

/**
 * 需要admin登录
 */
exports.adminRequired = function (req, res, next) {
  if (ApiUtil.getUsertype(req) !== type.role_admin) {
    return res.status(403).send('forbidden!');
  }

  next();
};

exports.gen_session = function (user, usertype, req, res) {
  req.session.userid = user._id;
  req.session.usertype = usertype;

  var opts = {
    path: '/',
    maxAge: config.session_time,
    signed: false,
    httpOnly: false,
  };
  res.cookie('username', user.username || user.phone, opts); //cookie 有效期1天
  res.cookie('usertype', usertype, opts);
}

exports.clear_session = function (req, res) {
  if (req.session) {
    req.session.destroy();
  }
  res.clearCookie('username', {
    path: '/'
  });
  res.clearCookie('usertype', {
    path: '/'
  });
}

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


var loginPages = ['/login.html'];
var designerPages = ['/design.html', '/design_agreement.html',
  '/design_info.html', '/design_need.html',
  '/design_offer.html', '/design_owner.html',
  '/design_scheme.html', '/design_team.html',
  '/design_upload.html'
];
var userPages = ['/owner.html', '/owner_design.html',
  '/owner_info.html', '/owner_need.html',
  '/owner_scheme.html'
];

exports.checkCookie = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);

  if (userid) {
    //有ID session 但是username usertype cookies被篡改了 注销session
    if (!req.cookies['username'] || !req.cookies['usertype']) {
      exports.clear_session(req, res);
    }
  } else {
    //清空session
    console.log('sdfsdfsdfsdfs');
    exports.clear_session(req, res);
  }

  next();
}

exports.authWeb = function (req, res, next) {
  var url = req.url
  var userid = ApiUtil.getUserid(req);
  var usertype = ApiUtil.getUsertype(req);

  if (_.indexOf(loginPages, url) >= 0) {
    if (userid) {
      if (usertype === type.role_user) {
        res.redirect('owner.html');
      } else if (usertype === type.role_designer) {
        res.redirect('design.html');
      }
    } else {
      next();
    }
  } else if (_.indexOf(designerPages, url) >= 0) {
    if (userid) {
      if (usertype === type.role_user) {
        res.status(403).send('forbidden!');
      } else if (usertype === type.role_designer) {
        next();
      }
    } else {
      res.redirect('login.html');
    }
  } else if (_.indexOf(userPages, url) >= 0) {
    if (userid) {
      if (usertype === type.role_user) {
        next();
      } else if (usertype === type.role_designer) {
        res.status(403).send('forbidden!');
      }
    } else {
      res.redirect('login.html');
    }
  } else {
    next();
  }
}

var adminLoginPages = ['/login.html'];

exports.authAdminWeb = function (req, res, next) {
  var url = req.url
  var userid = ApiUtil.getUserid(req);
  var usertype = ApiUtil.getUsertype(req);

  if (_.indexOf(adminLoginPages, url) >= 0) {
    if (userid && usertype === type.role_admin) {
      res.redirect('live.html');
    } else {
      next();
    }
  } else {
    if (userid && usertype === type.role_admin) {
      next();
    } else {
      res.status(403).send('forbidden!');
    }
  }
}
