var validator = require('validator');
var tools = require('./tools');
var _ = require('lodash');
var moment = require('moment');

exports.add = function (date, num, f) {
  console.log('date= ' + date);
  console.log('num= ' + num);
  console.log('f= ' + f);
  var ds = num * f;
  ds = _.round(ds);
  if (ds === 0) {
    ds = 1;
  }

  date = date + (1000 * 60 * 60 * 24 * ds);
  return date;
}

moment.locale('zh-cn'); // 使用中文
// 格式化时间
exports.YYYY_MM_DD = function (time) {
  var date = moment(new Date(time));
  return date.format('YYYY-MM-DD');
};

exports.YYYYMMDDHHmmssSSS = function () {
  var date = moment(new Date());
  return date.format('YYYYMMDDHHmmssSSS');
}
