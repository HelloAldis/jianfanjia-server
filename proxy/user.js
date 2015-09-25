var models = require('../models');
var User = models.User;
var uuid = require('node-uuid');

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

exports.newAndSave = function (json, callback) {
  var user = new User(json);
  user.accessToken = uuid.v4();
  user.create_at = new Date().getTime();

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

exports.findOne = function (query, project, callback) {
  User.findOne(query, project, callback);
}

exports.setOne = function (query, update, option, callback) {
  User.findOneAndUpdate(query, {
    $set: update
  }, option, callback)
}

exports.find = function (query, project, option, callback) {
  User.find(query, project, option, callback);
}

exports.paginate = function (query, project, option, callback) {
  User.count(query, function (err, count) {
    if (err) {
      return callback(err, null);
    }

    exports.find(query, project, option, function (err, users) {
      callback(err, users, count);
    });
  });
};
