var models = require('lib/models');
var Favorite = models.Favorite;

exports.newAndSave = function (json, callback) {
  var favorite = new Favorite(json);

  favorite.save(callback);
}

exports.addToSet = function (query, addToSet, option, callback) {
  Favorite.findOneAndUpdate(query, {
    '$addToSet': addToSet
  }, option, callback);
}

exports.pull = function (query, pull, option, callback) {
  Favorite.findOneAndUpdate(query, {
    '$pull': pull
  }, option, callback);
}

exports.incOne = function (query, update, option, callback) {
  Favorite.findOneAndUpdate(query, {
    $inc: update
  }, option, function (err) {});
}

exports.findOne = function (query, project, callback) {
  Favorite.findOne(query, project, callback);
}

exports.find = function (query, project, option, callback) {
  Favorite.find(query, project, option, callback);
}

exports.setOne = function (query, update, option, callback) {
  Favorite.findOneAndUpdate(query, {
    $set: update
  }, option, callback)
}
