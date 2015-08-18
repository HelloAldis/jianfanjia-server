var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../proxy').User;
var Share = require('../../proxy').Share;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../config');
var ApiUtil = require('../../common/api_util');


exports.list = function (req, res, next) {
  Share.getAll(function (err, shares) {
    if (err) {
      return next(err);
    }

    res.send({data: shares});
  });
}

exports.listtop = function (req, res, next) {
  Share.getByRange(config.index_top_share_count, function (err, shares) {
    if (err) {
      return next(err);
    }

    res.send({data: shares});
  });
}

exports.add = function (req, res, next) {
  var share = ApiUtil.buildShare(req);
  var userid = ApiUtil.getUserid(req);
  var usertype = ApiUtil.getUsertype(req);

  if (usertype === '1') {
    share.userid = userid;
  } else if (usertype === '3') {
    share.designerid = userid;
  }

  Share.newAndSave(share, function (err) {
    if (err) {
      return next(err);
    }

    res.send({msg:'添加成功'});
  });
}

exports.update = function (req, res, next) {
  var share = ApiUtil.buildShare(req);
  var shareid = tools.trim(req.body._id);

  Share.updateById(shareid, share, function (err) {
    console.log(err);
    if (err) {
      return next(err);
    }

    res.send({msg:'更新成功'});
  })
}
