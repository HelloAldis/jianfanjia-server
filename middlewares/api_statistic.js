var ApiStatistic = require('../proxy').ApiStatistic;
var config = require('../config');
var type = require('../type');
var ApiUtil = require('../common/api_util');
var _ = require('lodash');

/**
 * 需要通用用户登录
 */
exports.api_statistic = function (req, res, next) {
  next();
  ApiStatistic.incOne({
    api: req.route.path
  }, {
    count: 1
  }, {
    upsert: true
  });
};
