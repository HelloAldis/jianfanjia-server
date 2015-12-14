var validator = require('validator');
var eventproxy = require('eventproxy');
var Share = require('../../proxy').Share;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../apiconfig');
var async = require('async');
var ApiUtil = require('../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var type = require('../../type');

Share.find({}, null, null, function (err, shares) {
  shares.forEach(function (share) {
    share.process.forEach(function (process) {
      var a = parseInt(process.name.slice(0, 1));
      process.name = (a + 1) + '';
    });
    share.save(function () {
      console.log('save to ' + JSON.stringify(share));
    });
  });
});

console.log('over');
