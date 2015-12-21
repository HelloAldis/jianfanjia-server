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
var designerApkDir = path.normalize(__dirname +
  '/../../../public/designer_build');

exports.bindCid = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var cid = tools.trim(req.body.cid);

  gt.aliasBind(userid, cid);
  res.sendSuccessMsg();
}

exports.android_build_version = function (req, res, next) {
  // gt.pushMessageToUser('566798dab6c449fd05969fef', {
  //   content: 'hahah测试一下',
  //   section: 'section',
  //   cell: 'cell',
  //   type: 'type',
  //   time: new Date().getTime(),
  //   processid: '566798dab6c449fd05969fef',
  // });

  var ep = eventproxy();
  ep.fail(next);

  fs.readdir(apkDir, ep.done(function (apks) {
    apks.sort();
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

exports.designer_android_build_version = function (req, res, next) {
  var ep = eventproxy();
  ep.fail(next);

  fs.readdir(designerApkDir, ep.done(function (apks) {
    apks.sort();
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
            '/designer_build/' + apk,
        });
      }
    } else {
      res.sendErrMsg('no apk');
    }
  }));
}
