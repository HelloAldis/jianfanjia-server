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
