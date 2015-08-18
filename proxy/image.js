var models  = require('../models');
var Image    = models.Image;

/**
 * 根据key获取图片
 * Callback:
 * - err, 数据库异常
 * - users, 图片data
 * @param {String} key 关键字
 * @param {Function} callback 回调函数
 */
exports.getImageByMd5AndUserid = function (md5, userid, callback) {
  Image.findOne({'md5':md5, 'userid': userid}, callback);
};

exports.newAndSave = function (md5, data, userid, callback) {
  var image         = new Image();
  image.md5   = md5;
  image.data        = data;
  image.userid = userid;
  image.save(callback);
};

exports.getImageById = function (id, callback) {
  Image.findOne({_id: id}, callback);
};
