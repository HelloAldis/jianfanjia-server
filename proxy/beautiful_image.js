var models = require('../models');
var BeautifulImage = models.BeautifulImage;

exports.newAndSave = function (json, callback) {
  var beautifulImage = new BeautifulImage(json);
  beautifulImage.create_at = new Date().getTime();
  beautifulImage.lastupdate = beautifulImage.create_at;
  beautifulImage.save(callback);
};

exports.removeOne = function (query, option, callback) {
  BeautifulImage.findOneAndRemove(query, option, callback)
};

exports.setOne = function (query, update, option, callback) {
  update.lastupdate = new Date().getTime();
  BeautifulImage.findOneAndUpdate(query, {
    $set: update
  }, option, callback);
}

exports.incOne = function (query, update, option) {
  BeautifulImage.findOneAndUpdate(query, {
    $inc: update
  }, option, function () {});
}

exports.find = function (query, project, option, callback) {
  BeautifulImage.find(query, project, option, callback);
}

exports.findOne = function (query, project, callback) {
  BeautifulImage.findOne(query, project, callback);
}

exports.paginate = function (query, project, option, callback) {
  BeautifulImage.count(query, function (err, count) {
    if (err) {
      return callback(err, null);
    }

    exports.find(query, project, option, function (err, comments) {
      callback(err, comments, count);
    });
  });
}

exports.count = function (query, callback) {
  BeautifulImage.count(query, callback);
}
