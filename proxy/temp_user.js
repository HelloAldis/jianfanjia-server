var models  = require('../models');
var TempUser    = models.TempUser;
var utility = require('utility');

/**
 * 添加临时用户到系统
 * - err, 数据库异常
 * @param {String} username;
 * @param {String} phone;
 */

exports.newAndSave = function (json, callback) {
  var tempUser = new TempUser(json);
  
  tempUser.save(callback);
};

exports.getAll = function (callback) {
  TempUser.find(callback);
};

exports.getOneByNamePhone = function(name, phone, callback) {
  TempUser.findOne({'name':name, 'phone':phone}, callback);
};
