var models  = require('../models');
var User    = models.User;
var uuid    = require('node-uuid');

exports.getUserByPhone = function (phone, callback) {
  User.findOne({'phone': phone}, callback);
};

/**
 * 根据用户ID，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户ID
 * @param {Function} callback 回调函数
 */
exports.getUserById = function (id, callback) {
  User.findOne({_id: id}, callback);
};

/**
 * 根据关键字，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getUsersByQuery = function (query, opt, callback) {
  User.find(query, '', opt, callback);
};

exports.newAndSave = function (json, callback) {
  var user         = new User(json);
  user.accessToken = uuid.v4();

  user.save(callback);
};

exports.updateByQuery = function (query, json, callback) {
  User.update(query, {$set: json}, callback);
}

exports.pushUpdateByQuery = function (query, json, callback) {
  User.update(query, {$push: json}, callback);
}
