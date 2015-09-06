var validator = require('validator');
var eventproxy = require('eventproxy');
var Designer = require('../../proxy').Designer;
var Share = require('../../proxy').Share;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../config');
var ApiUtil = require('../../common/api_util');
var async = require('async');

exports.list = function (req, res, next) {
  Share.getAll(function (err, shares) {
    if (err) {
      return next(err);
    }

    async.mapLimit(shares, 3, function (share, callback) {
      Designer.findOne({
        _id: share.designerid
      }, {
        _id: 1,
        username: 1,
        imageid: 1
      }, function (err, designer_indb) {
        var s = share.toObject();
        s.designer = designer_indb;
        callback(err, s);
      });
    }, function (err, results) {
      if (err) {
        return next(err);
      }

      res.sendData(results);
    });
  });
}

exports.listtop = function (req, res, next) {
  Share.getByRange(config.index_top_share_count, function (err, shares) {
    if (err) {
      return next(err);
    }

    async.mapLimit(shares, 3, function (share, callback) {
      Designer.findOne({
        _id: share.designerid
      }, {
        _id: 1,
        username: 1,
        imageid: 1
      }, function (err, designer_indb) {
        var s = share.toObject();
        s.designer = designer_indb;
        callback(err, s);
      });
    }, function (err, results) {
      if (err) {
        return next(err);
      }

      res.sendData(results);
    });
  });
}

exports.getOne = function (req, res, next) {
  var _id = req.params._id;

  Share.getOneById(_id, function (err, share) {
    if (err) {
      return next(err);
    }

    res.sendData(share);
  });
}
