var models = require('../models');
var Image = models.Image;

exports.findOne = function (query, project, callback) {
  Image.findOne(query, project, callback);
}

exports.newAndSave = function (md5, data, userid, callback) {
  var image = new Image();
  image.md5 = md5;
  image.data = data;
  image.userid = userid;
  image.save(callback);
};

exports.find = function (query, project, option, callback) {
  Image.find(query, project, option, callback);
}

exports.setOne = function (query, update, option, callback) {
  Image.findOneAndUpdate(query, {
    $set: update
  }, option, callback)
}

exports.paginate = function (query, project, option, callback) {
  Image.count(query, function (err, count) {
    if (err) {
      return callback(err, null);
    }

    exports.find(query, project, option, function (err, designers) {
      callback(err, designers, count);
    });
  });
}

exports.count = function (query, callback) {
  Image.count(query, callback);
}
