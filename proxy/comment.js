var models = require('../models');
var Comment = models.Comment;
var uuid = require('node-uuid');

exports.newAndSave = function (json, callback) {
  var comment = new Comment(json);
  comment.save(callback);
};

exports.removeOne = function (query, option, callback) {
  Comment.findOneAndRemove(query, option, callback)
};


exports.setOne = function (query, update, option, callback) {
  Comment.findOneAndUpdate(query, {
    $set: update
  }, option, callback);
}

exports.update = function (query, update, option, callback) {
  Comment.update(query, {
    $set: update
  }, option, callback);
}

exports.find = function (query, project, option, callback) {
  Comment.find(query, project, option, callback);
}

exports.findOne = function (query, project, callback) {
  Comment.findOne(query, project, callback);
}

exports.paginate = function (query, project, option, callback) {
  Comment.count(query, function (err, count) {
    if (err) {
      return callback(err, null);
    }

    exports.find(query, project, option, function (err, comments) {
      callback(err, comments, count);
    });
  });
}

exports.count = function (query, callback) {
  Comment.count(query, callback);
}
