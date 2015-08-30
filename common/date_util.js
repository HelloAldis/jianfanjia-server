var validator = require('validator');
var tools = require('./tools');
var _ = require('lodash');

exports.add = function (date, num, f) {
  var ds = num * f;
  ds = _.round(ds);
  if (ds === 0) {
    ds = 1;
  }

  date = date + (1000 * 60 * 60 * 24 * ds);
  return date;
}
