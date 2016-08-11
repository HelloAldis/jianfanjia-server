var models = require('lib/models');
var Reschedule = models.Reschedule;

exports.find = function (query, project, option, callback) {
  Reschedule.find(query, project, option, callback);
}

exports.newAndSave = function (json, callback) {
  var reschedule = new Reschedule(json);
  reschedule.request_date = new Date().getTime();
  reschedule.save(callback);
};

exports.setOne = function (query, update, option, callback) {
  Reschedule.findOneAndUpdate(query, {
    $set: update
  }, option, callback)
}

exports.findOne = function (query, project, callback) {
  Reschedule.findOne(query, project, callback);
}
