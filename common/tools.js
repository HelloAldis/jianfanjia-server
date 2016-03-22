"use strict"

const bcrypt = require('bcrypt');
const moment = require('moment');
const validator = require('validator');
const _ = require('lodash');
const xss_util = require('xss');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

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

exports.deleteUndefinedAndNullThenFilterXss = function (obj) {
  for (let p in obj) {
    if (obj[p] === null || obj[p] === undefined) {
      delete obj[p];
    } else if (typeof obj[p] === 'string') {
      obj[p] = xss_util(obj[p]);
    } else if (typeof obj[p] === 'object' && !(obj[p] instanceof ObjectId)) {
      exports.deleteUndefinedAndNullThenFilterXss(obj);
    }
  }

  return obj
}

exports.xss = function (html) {
  if (html === undefined || html === null) {
    return undefined;
  } else {
    return xss_util(html);
  }
}
