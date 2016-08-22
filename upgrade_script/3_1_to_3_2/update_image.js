'use strict'

require('app-module-path').addPath(__dirname + '../../');

var TempUser = require('lib/proxy').TempUser;
var type = require('lib/type/type');
var async = require('async');

TempUser.count({}, function (err, count) {
  if (err) {
    return console.log('err = ' + err);
  }

  async.timesSeries(count, function (n, next) {
      TempUser.find({}, null, {
        skip: n,
        limit: 1,
        sort: {
          _id: 1,
        }
      }, function (err, tempUsers) {
        if (err) {
          next(err);
        } else {
          var tempUser = tempUsers[0];

          if (tempUser.district === '201606微信简+') {
            tempUser.district = '简+';
            tempUser.platform_type = tempUser.platform_type || type.platform_wechat;
          }

          if (tempUser.district === '3.1web免费设计' || tempUser.district === '3.1web免费报价') {
            tempUser.platform_type = tempUser.platform_type || type.platform_pc;
          }

          if (tempUser.district === '201604微信推广') {
            tempUser.platform_type = tempUser.platform_type || type.platform_wechat;
          }

          tempUser.platform_type = tempUser.platform_type || type.platform_pc;

          tempUser.save(function (err) {
            next(err);
          })
        }
      });
    },
    function (err) {
      if (err) {
        console.log('complete wit err =' + err);
      } else {
        console.log('complete ok');
      }
      process.exit();
    });
});
