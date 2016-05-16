var models = require('../models');
var Evaluation = models.Evaluation;
var uuid = require('node-uuid');

exports.newAndSave = function (json, callback) {
  var evaluation = new Evaluation(json);
  evaluation.create_at = new Date().getTime();
  evaluation.save(callback);
};

exports.find = function (query, project, option, callback) {
  Evaluation.find(query, project, option, callback);
}

exports.findOne = function (query, project, callback) {
  Evaluation.findOne(query, project, callback);
}

exports.count = function (query, callback) {
  Evaluation.count(query, callback);
}

exports.paginate = function (query, project, option, callback) {
  Evaluation.count(query, function (err, count) {
    if (err) {
      return callback(err, null);
    }

    exports.find(query, project, option, function (err, evaluations) {
      callback(err, evaluations, count);
    });
  });
}

exports.setOne = function (query, update, option, callback) {
  Evaluation.findOneAndUpdate(query, {
    $set: update
  }, option, callback)
}

exports.group = function (group, match, callback) {
  Evaluation.aggregate().match(match).group(group).exec(callback);
}
