var bcrypt = require('bcrypt');
var moment = require('moment');
var validator = require('validator');
var _ = require('lodash');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

moment.locale('zh-cn'); // 使用中文

// 格式化时间
exports.formatDate = function (date, friendly) {
  date = moment(date);

  if (friendly) {
    return date.fromNow();
  } else {
    return date.format('YYYY-MM-DD HH:mm');
  }

};

exports.bhash = function (str, callback) {
  bcrypt.hash(str, 10, callback);
};

exports.bcompare = function (str, hash, callback) {
  bcrypt.compare(str, hash, callback);
};

exports.trim = function (str) {
  return validator.trim(str) || '';
}

exports.findIndexObjectId = function (array, oid) {
  return _.findIndex(array, function (o) {
    return o.toString() === oid.toString();
  });
}

exports.isValidObjectId = function (oid) {
  return oid && ObjectId.isValid(oid);
}
