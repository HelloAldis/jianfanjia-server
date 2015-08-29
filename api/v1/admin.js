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

exports.authed = function (req, res, next) {
  var designerid = tools.trim(req.body._id);

  Designer.updateByQuery({
      _id: designerid
    }, {
      'auth_type': type.designer_auth_type_done,
      'auth_date': new Date().getTime(),
    },
    function (err) {
      if (err) {
        return next(err);
      }

      res.sendSuccessMsg();
    });
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

exports.listAuthingDesigner = function (req, res, next) {
  Designer.getSByQueryAndProject({
    auth_type: type.designer_auth_type_processing
  }, {
    pass: 0,
    accessToken: 0
  }, function (err, designers) {
    if (err) {
      return next(err);
    }

    res.sendData(designers);
  });
};
