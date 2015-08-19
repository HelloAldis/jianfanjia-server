var config       = require('../config');
var eventproxy   = require('eventproxy');
var _            = require('lodash');

exports.index = function (req, res, next) {
  res.redirect('/tpl/index/index.html');
}
