var models = require('lib/models');
var Kpi = models.Kpi;

exports.incOne = function (query, update, option) {
  Kpi.findOneAndUpdate(query, {
    $inc: update
  }, option, function (err) {});
}

exports.setOne = function (query, update, option, callback) {
  Kpi.findOneAndUpdate(query, {
    $set: update
  }, option, callback);
}

exports.find = function (query, project, option, callback) {
  Kpi.find(query, project, option, callback);
}

exports.findOne = function (query, project, callback) {
  Kpi.findOne(query, project, callback);
}

exports.count = function (query, callback) {
  Kpi.count(query, callback);
}

exports.newAndSave = function (json, callback) {
  var kpi = new Kpi(json);
  kpi.save(callback);
};
