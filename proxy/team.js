var models = require('../models');
var Team = models.Team;
var uuid = require('node-uuid');

exports.newAndSave = function (json, callback) {
  var team = new Team(json);
  team.create_at = new Date().getTime();
  team.save(callback);
};

exports.removeOne = function (query, option, callback) {
  Team.findOneAndRemove(query, option, callback)
};

exports.find = function (query, project, option, callback) {
  Team.find(query, project, option, callback);
}

exports.setOne = function (query, update, option, callback) {
  Team.findOneAndUpdate(query, {
    $set: update
  }, option, callback)
}

exports.paginate = function (query, project, option, callback) {
  Team.count(query, function (err, count) {
    if (err) {
      return callback(err, null);
    }

    exports.find(query, project, option, function (err, designers) {
      callback(err, designers, count);
    });
  });
}
