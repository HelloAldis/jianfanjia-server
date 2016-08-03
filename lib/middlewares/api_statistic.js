var ApiStatistic = require('lib/proxy').ApiStatistic;

/**
 * 需要通用用户登录
 */
exports.api_statistic = function (req, res, next) {
  next();

  if (req.route && req.route.path) {
    ApiStatistic.incOne({
      api: req.route.path,
      platform_type: req.platform_type
    }, {
      count: 1
    }, {
      upsert: true
    });
  }
};
