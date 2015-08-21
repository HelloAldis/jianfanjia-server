var validator = require('validator');
var eventproxy = require('eventproxy');
var Designer = require('../../proxy').Designer;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../config');
var async = require('async');
var ApiUtil = require('../../common/api_util');
var type = require('../../type');

exports.authed = function (req, res, next) {
  var designerid = tools.trim(req.body._id);

  Designer.updateByQuery({_id:designerid}, {'auth_type': '2', 'auth_date': new Date()},
  function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
}

exports.add = function (req, res, next) {
  var share = ApiUtil.buildShare(req);
  var userid = ApiUtil.getUserid(req);
  var usertype = ApiUtil.getUsertype(req);

  if (usertype === type.role_user) {
    share.userid = userid;
  } else if (usertype === type.role_user) {
    share.designerid = userid;
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

  Share.updateById(shareid, share, function (err) {
    console.log(err);
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
};
