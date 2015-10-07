var models = require('../models');
var Share = models.Share;

exports.findOne = function (query, project, callback) {
  Share.findOne(query, project, callback);
}

exports.find = function (query, project, option, callback) {
  Share.find(query, project, option, callback);
}

exports.setOne = function (query, update, option, callback) {
  Share.findOneAndUpdate(query, {
    $set: update
  }, option, callback)
}

exports.newAndSave = function (json, callback) {
  var share = new Share(json);
  share.create_at = new Date().getTime();
  share.save(callback);
};

exports.removeOne = function (query, option, callback) {
  Share.findOneAndRemove(query, option, callback)
};
