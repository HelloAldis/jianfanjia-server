var models = require('../models');
var ApiStatistic = models.ApiStatistic;

exports.incOne = function (query, update, option) {
  ApiStatistic.findOneAndUpdate(query, {
    $inc: update
  }, option, function (err) {
    console.log(err);
  });
}

exports.find = function (query, project, option, callback) {
  ApiStatistic.find(query, project, option, callback);
}
