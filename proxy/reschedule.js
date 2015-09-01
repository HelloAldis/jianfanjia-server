var models = require('../models');
var Reschedule = models.Reschedule;

exports.findOneByQueryAndProject = function (query, project, callback) {
  Reschedule.findOne(query, project, callback);
}

exports.findByQueryAndProjectAndOption = function (query, project, option,
  callback) {
  Reschedule.find(query, project, option, callback);
}

exports.newAndSave = function (json, callback) {
  var reschedule = new Reschedule(json);
  reschedule.request_date = new Date().getTime();
  reschedule.save(callback);
};

exports.updateOneByQueryAndOption = function (query, update, option, callback) {
  Reschedule.findOneAndUpdate(query, {
    $set: update
  }, option, callback);
}
