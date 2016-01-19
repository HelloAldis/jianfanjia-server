var models = require('../models');
var Answer = models.Answer;

exports.newAndSave = function (json, callback) {
  var answer = new Answer(json);
  answer.create_at = new Date().getTime();

  answer.save(callback);
};

exports.find = function (query, project, option, callback) {
  Answer.find(query, project, option, callback);
}

exports.findOne = function (query, project, callback) {
  Answer.findOne(query, project, callback);
}

exports.paginate = function (query, project, option, callback) {
  Answer.count(query, function (err, count) {
    if (err) {
      return callback(err, null);
    }

    exports.find(query, project, option, function (err, products) {
      callback(err, products, count);
    });
  });
};
