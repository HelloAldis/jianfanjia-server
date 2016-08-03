'use strict'

const eventproxy = require('eventproxy');
const tools = require('lib/common/tools');
const ApiUtil = require('lib/common/api_util');
const fs = require('fs');
const path = require('path');
const gt = require('lib/getui/gt.js');

const apkDir = path.normalize(__dirname + '/../../../web/pc/res/user_build');
const designerApkDir = path.normalize(__dirname + '/../../../web/pc/res/designer_build');
const supervisorApkDir = path.normalize(__dirname + '/../../../web/pc/res/supervisor_build');

exports.android_build_version = function (req, res, next) {
  // gt.pushMessageToUser('568494454ade4cb02eeff7c5', {
  //   content: '水电材料',
  //   section: 'shui_dian',
  //   cell: '清江山水',
  //   type: type.message_type_procurement,
  //   time: new Date().getTime(),
  //   processid: '5684d3e7f04423733566b06e',
  // });

  let ep = eventproxy();
  ep.fail(next);

  fs.readdir(apkDir, ep.done(function (apks) {
    apks.sort();
    let apk = apks.pop();
    if (apk) {
      let arr = apk.split('_');
      if (arr.length === 5) {
        let version_name = arr[4].replace(/.apk/g, '');
        res.sendData({
          version_name: version_name,
          version_code: arr[3],
          updatetype: arr[2],
          download_url: 'http://' + req.headers.host +
            '/user_build/' + apk,
        });
      } else {
        res.sendErrMsg('bad apk');
      }
    } else {
      res.sendErrMsg('no apk');
    }
  }));
}

//jianfanjia_20151117_0_9999_1.0.99.apk

exports.designer_android_build_version = function (req, res, next) {
  let ep = eventproxy();
  ep.fail(next);

  fs.readdir(designerApkDir, ep.done(function (apks) {
    apks.sort();
    let apk = apks.pop();
    if (apk) {
      let arr = apk.split('_');

      if (arr.length === 5) {
        let version_name = arr[4].replace(/.apk/g, '');
        res.sendData({
          version_name: version_name,
          version_code: arr[3],
          updatetype: arr[2],
          download_url: 'http://' + req.headers.host +
            '/designer_build/' + apk,
        });
      } else {
        res.sendErrMsg('bad apk');
      }
    } else {
      res.sendErrMsg('no apk');
    }
  }));
}

exports.supervisor_android_build_version = function (req, res, next) {
  let ep = eventproxy();
  ep.fail(next);

  fs.readdir(supervisorApkDir, ep.done(function (apks) {
    apks.sort();
    let apk = apks.pop();
    if (apk) {
      let arr = apk.split('_');

      if (arr.length === 5) {
        let version_name = arr[4].replace(/.apk/g, '');
        res.sendData({
          version_name: version_name,
          version_code: arr[3],
          updatetype: arr[2],
          download_url: 'http://' + req.headers.host +
            '/supervisor_build/' + apk,
        });
      } else {
        res.sendErrMsg('bad apk');
      }
    } else {
      res.sendErrMsg('no apk');
    }
  }));
}
