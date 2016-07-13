'use strict'

const config = require('../apiconfig');
const User = require('../proxy').VerifyCode;

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

    if (clearCodeIfOk) {
      verifyCode.code = undefined;
      verifyCode.save(function () {});
    }

    return callback(null);
  });
}
