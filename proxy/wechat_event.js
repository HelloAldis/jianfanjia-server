var models = require('../models');
var WechatEvent = models.WechatEvent;

exports.incOne = function (query, update, option) {
  WechatEvent.findOneAndUpdate(query, {
    $inc: update
  }, option, function (err) {});
}

exports.find = function (query, project, option, callback) {
  WechatEvent.find(query, project, option, callback);
}

exports.findOne = function (query, project, callback) {
  WechatEvent.findOne(query, project, callback);
}

exports.count = function (query, callback) {
  WechatEvent.count(query, callback);
}

exports.newAndSave = function (json, callback) {
  var wechatEvent = new WechatEvent(json);
  wechatEvent.save(callback);
};
