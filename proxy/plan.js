var models = require('../models');
var Plan = models.Plan;
var uuid = require('node-uuid');

exports.newAndSave = function (json, callback) {
  var plan = new Plan(json);
  plan.request_date = new Date().getTime();
  plan.last_status_update_time = new Date().getTime();
  plan.save(callback);
};

exports.removeOne = function (query, option, callback) {
  Plan.findOneAndRemove(query, option, callback)
};

exports.push = function (query, push, option, callback) {
  Plan.findOneAndUpdate(query, {
    '$push': push
  }, option, callback);
}

exports.setOne = function (query, update, option, callback) {
  Plan.findOneAndUpdate(query, {
    $set: update
  }, option, callback);
}

exports.update = function (query, update, option, callback) {
  Plan.update(query, {
    $set: update
  }, option, callback);
}

exports.find = function (query, project, option, callback) {
  Plan.find(query, project, option, callback);
}

exports.findOne = function (query, project, callback) {
  Plan.findOne(query, project, callback);
}

exports.paginate = function (query, project, option, callback) {
  Plan.count(query, function (err, count) {
    if (err) {
      return callback(err, null);
    }

    exports.find(query, project, option, function (err, designers) {
      callback(err, designers, count);
    });
  });
}

exports.count = function (query, callback) {
  Plan.count(query, callback);
}
