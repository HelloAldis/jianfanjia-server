var models = require('../models');
var Designer = models.Designer;
var uuid = require('node-uuid');
var type = require('../type');

exports.newAndSave = function (json, callback) {
  var designer = new Designer(json);
  designer.accessToken = uuid.v4();
  designer.create_at = new Date().getTime();

  designer.save(callback);
};

exports.incOne = function (query, update, option, callback) {
  Designer.findOneAndUpdate(query, {
    $inc: update
  }, option, function (err) {});
}

exports.findOne = function (query, project, callback) {
  Designer.findOne(query, project, callback);
}

exports.find = function (query, project, option, callback) {
  Designer.find(query, project, option, callback);
}

exports.setOne = function (query, update, option, callback) {
  Designer.findOneAndUpdate(query, {
    $set: update
  }, option, callback)
}
