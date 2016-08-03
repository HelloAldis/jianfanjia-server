var models = require('lib/models');
var TempUser = models.TempUser;

exports.newAndSave = function (json, callback) {
  var tempUser = new TempUser(json);
  tempUser.create_at = new Date().getTime();
  tempUser.save(callback);
};

exports.find = function (query, project, option, callback) {
  TempUser.find(query, project, option, callback);
}

exports.paginate = function (query, project, option, callback) {
  TempUser.count(query, function (err, count) {
    if (err) {
      return callback(err, null);
    }

    exports.find(query, project, option, function (err, products) {
      callback(err, products, count);
    });
  });
};

exports.count = function (query, callback) {
  TempUser.count(query, callback);
}
