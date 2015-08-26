var validator = require('validator');
var tools = require('./tools');
var _ = require('lodash');

exports.add = function (date, num) {
  var d = new Date(date);
  d.setDate(d.getDate() + num);
  return d;
}
