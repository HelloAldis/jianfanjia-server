var validator = require('validator');
var eventproxy = require('eventproxy');
var Designer = require('../../proxy').Designer;
var Share = require('../../proxy').Share;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../config');
var async = require('async');
var ApiUtil = require('../../common/api_util');
var type = require('../../type');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var sms = require('../../common/sms');

exports.login = function (req, res, next) {
  if (req.body.username === 'admin' && req.body.pass === 'admin') {
    req.session.userid = 'Admin';
    req.session.usertype = type.role_admin;
    res.cookie('username', 'Admin'); //cookie 有效期1天
    res.cookie('usertype', type.role_admin);

    res.sendSuccessMsg();
  } else {
    res.sendErrMsg('ooooooOps');
  }
}

exports.authed = function (req, res, next) {
  var designerid = tools.trim(req.body._id);
  var ep = eventproxy();
  ep.fail(next);

  Designer.setOne({
    _id: 'designerid'
  }, {
    auth_type: type.designer_auth_type_done,
    auth_date: new Date().getTime(),
  }, {}, ep.done(function (err, designer) {
    // if (err) {
    //   return next(err);
    // }
    console.log(err);
    if (designer) {
      // console.log(designer);
      // sms.sendYzxAuthSuccess(designer.phone, designer.username);
      // sms.sendYzxAuthSuccess('18682109074', designer.username);
    }

    res.sendSuccessMsg();
  }));
}

exports.add = function (req, res, next) {
  var share = ApiUtil.buildShare(req);
  var designerid = tools.trim(req.body.designerid);
  var userid = tools.trim(req.body.userid);

  if (userid) {
    share.userid = new ObjectId(userid);
  } else if (designerid) {
    share.designerid = new ObjectId(designerid);
  }

  Share.newAndSave(share, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
};

exports.update = function (req, res, next) {
  var share = ApiUtil.buildShare(req);
  var shareid = tools.trim(req.body._id);

  share.lastupdate = new Date().getTime();
  Share.updateById(shareid, share, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
};

exports.delete = function (req, res, next) {
  var _id = tools.trim(req.body._id);

  Share.removeOneById(_id, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
}

exports.listAuthingDesigner = function (req, res, next) {
  Designer.find({
    auth_type: type.designer_auth_type_processing
  }, {
    pass: 0,
    accessToken: 0
  }, {}, function (err, designers) {
    if (err) {
      return next(err);
    }

    res.sendData(designers);
  });
};

exports.searchDesigner = function (req, res, next) {
  var phone = new RegExp('^' + tools.trim(req.body.phone));

  Designer.find({
    phone: phone
  }, {
    pass: 0,
    accessToken: 0
  }, {
    sort: {
      phone: 1
    }
  }, function (err, designers) {
    if (err) {
      return next(err);
    }

    res.sendData(designers);
  });
}
