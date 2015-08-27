var models = require('../models');
var User = models.User;
var uuid = require('node-uuid');

exports.getOneByQueryAndProject = function (query, project, callback) {
  User.findOne(query, project, callback);
}

exports.getUserByPhone = function (phone, callback) {
  User.findOne({
    'phone': phone
  }, callback);
};

exports.getUserById = function (id, callback) {
  User.findOne({
    _id: id
  }, callback);
};

exports.getUsersByQuery = function (query, opt, callback) {
  User.find(query, '', opt, callback);
};

exports.newAndSave = function (json, callback) {
  var user = new User(json);
  user.accessToken = uuid.v4();

  user.save(callback);
};

exports.updateByQuery = function (query, json, callback) {
  User.update(query, {
    $set: json
  }, callback);
}

exports.pushUpdateByQuery = function (query, json, callback) {
  User.update(query, {
    $push: json
  }, callback);
}
