var models = require('../models');
var DecStrategy = models.DecStrategy;
var uuid = require('node-uuid');

exports.newAndSave = function (json, callback) {
  var decStrategy = new DecStrategy(json);
  decStrategy.lastupdate = new Date().getTime();
  decStrategy.save(callback);
};

exports.removeOne = function (query, option, callback) {
  DecStrategy.findOneAndRemove(query, option, callback)
};

exports.setOne = function (query, update, option, callback) {
  DecStrategy.findOneAndUpdate(query, {
    $set: update
  }, option, callback);
}

exports.find = function (query, project, option, callback) {
  DecStrategy.find(query, project, option, callback);
}

exports.findOne = function (query, project, callback) {
  DecStrategy.findOne(query, project, callback);
}

exports.paginate = function (query, project, option, callback) {
  DecStrategy.count(query, function (err, count) {
    if (err) {
      return callback(err, null);
    }

    exports.find(query, project, option, function (err, comments) {
      callback(err, comments, count);
    });
  });
}
