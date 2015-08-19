var validator = require('validator');
var eventproxy = require('eventproxy');
var Designer = require('../../proxy').Designer;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../config');
var async = require('async');
var ApiUtil = require('../../common/api_util');

exports.authed = function (req, res, next) {
  var designerid = tools.trim(req.body._id);

  Designer.updateByQuery({_id:designerid}, {'auth_type': '2', 'auth_date': new Date()},
  function (err) {
    if (err) {
      return next(err);
    }

    res.send({msg:'审核完成'});
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
};

exports.update = function (req, res, next) {
  var share = ApiUtil.buildShare(req);
  var shareid = tools.trim(req.body._id);

  Share.updateById(shareid, share, function (err) {
    console.log(err);
    if (err) {
      return next(err);
    }

    res.send({msg:'更新成功'});
  });
};
