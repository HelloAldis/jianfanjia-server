var models = require('../models');
var Team = models.Team;
var uuid = require('node-uuid');

exports.getTeamsByDesignerid = function (designerid, callback) {
  Team.find({
    'designerid': designerid
  }, callback);
};

exports.newAndSave = function (json, callback) {
  var team = new Team(json);
  team.create_at = new Date().getTime();
  team.save(callback);
};

exports.updateByQuery = function (query, json, callback) {
  Team.findOneAndUpdate(query, {
    $set: json
  }, callback);
}

exports.removeOneByQuery = function (_id, callback) {
  Team.findOneAndRemove({
    _id: _id
  }, callback);
}

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
