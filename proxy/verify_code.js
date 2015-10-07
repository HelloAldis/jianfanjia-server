var models = require('../models');
var VerifyCode = models.VerifyCode;

exports.findOne = function (query, project, callback) {
  VerifyCode.findOne(query, project, callback);
}

exports.saveOrUpdate = function (phone, code, callback) {
  var vc = {};
  vc.phone = phone;
  vc.code = code;
  vc.create_at = new Date();

  VerifyCode.findOneAndUpdate({
    'phone': phone
  }, vc, {
    upsert: true
  }, callback);
}
