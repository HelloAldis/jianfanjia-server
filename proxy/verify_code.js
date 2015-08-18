var models  = require('../models');
var VerifyCode    = models.VerifyCode;

exports.getCodeByPhone = function (phone, callback) {
  VerifyCode.findOne({'phone': phone}, callback);
}

exports.saveOrUpdate = function (phone, code, callback) {
  var vc = {};
  vc.phone = phone;
  vc.code =  code;

  VerifyCode.findOneAndUpdate({'phone': phone}, vc, {upsert: true}, callback);
}
