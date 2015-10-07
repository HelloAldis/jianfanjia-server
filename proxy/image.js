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
