var eventproxy = require('eventproxy');
var Designer = require('../../../proxy').Designer;
var Share = require('../../../proxy').Share;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../apiconfig');
var async = require('async');
var ApiUtil = require('../../../common/api_util');
var type = require('../../../type');
var fs = require('fs');
var path = require('path');
var gt = require('../../../getui/gt.js');

var apkDir = path.normalize(__dirname + '/../../../public/user_build');

exports.bindCid = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var cid = tools.trim(req.body.cid);

  gt.aliasBind(userid, cid);
  res.sendSuccessMsg();
}

exports.android_build_version = function (req, res, next) {
  var ep = eventproxy();
  ep.fail(next);
  console.log(apkDir);
  fs.readdir(apkDir, ep.done(function (apks) {
    console.log(apks);
    apks.sort();
    console.log(apks)
    var apk = apks.pop();
    if (apk) {
      var arr = apk.split('_');
      if (arr.length != 5) {
        res.sendErrMsg('bad apk');
      } else {
        version_name = arr[4].replace(/.apk/g, '');
        res.sendData({
          version_name: version_name,
          version_code: arr[3],
          updatetype: arr[2],
          download_url: 'http://' + req.headers.host +
            '/user_build/' + apk,
        });
      }
    } else {
      res.sendErrMsg('no apk');
    }
  }));
}

//jianfanjia_20151117_0_9999_1.0.99.apk
