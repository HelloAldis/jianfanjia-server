'use strict'

const async = require('async');
const config = require('lib/config/apiconfig');
const VerifyCode = require('lib/proxy').VerifyCode;
const User = require('lib/proxy').User;
const Designer = require('lib/proxy').Designer;

/**
  如果code 不UI返回错误信息
*/
exports.verify_code = function (phone, code, clearCodeIfOk, callback) {
  VerifyCode.findOne({
    phone: phone
  }, function (err, verifyCode) {
    if (err) {
      return callback('验证码验证失败');
    }

    if (config.need_verify_code) {
      if (!verifyCode) {
        return callback('验证码不对或已过期');
      }

      if (verifyCode.code !== code) {
        return callback('验证码不对或已过期');
      }
    }

    if (clearCodeIfOk && verifyCode) {
      verifyCode.code = undefined;
      verifyCode.save(function () {});
    }

    return callback(null);
  });
}

exports.verify_phone = function (phone, callback) {
  async.parallel({
    user: function (callback) {
      User.findOne({
        phone: phone
      }, {
        _id: 1
      }, callback);
    },
    designer: function (callback) {
      Designer.findOne({
        phone: phone
      }, {
        _id: 1
      }, callback);
    }
  }, function (err, result) {
    callback(err, result.user || result.designer);
  });
}
