var models = require('lib/models');
var Feedback = models.Feedback;

exports.newAndSave = function (json, callback) {
  var feedback = new Feedback(json);
  feedback.create_at = new Date().getTime();

  feedback.save(callback);
};

exports.find = function (query, project, option, callback) {
  Feedback.find(query, project, option, callback);
}

exports.paginate = function (query, project, option, callback) {
  Feedback.count(query, function (err, count) {
    if (err) {
      return callback(err, null);
    }

    exports.find(query, project, option, function (err, products) {
      callback(err, products, count);
    });
  });
};
