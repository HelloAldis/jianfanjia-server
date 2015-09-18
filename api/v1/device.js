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
var gt = require('../../getui/gt.js');

exports.bindCid = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var cid = tools.trim(req.body.cid);

  gt.aliasBind(userid, cid);
  res.sendSuccessMsg();
}

exports.android_build_version = function (req, res, next) {
  res.sendData({
    version_name: '1.0.99',
    version_code: '9999',
    download_url: 'http://' + req.headers.host +
      '/android_build/JianFanJia.apk',
  });
}
