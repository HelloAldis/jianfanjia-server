var validator = require('validator');
var eventproxy = require('eventproxy');
var DecStrategy = require('../../../proxy').DecStrategy;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../apiconfig');
var async = require('async');
var ApiUtil = require('../../../common/api_util');
var type = require('../../../type');
var limit = require('../../../middlewares/limit');

exports.dec_strategy_homepage = function (req, res, next) {
  var _id = req.params._id;
  var ep = eventproxy();
  ep.fail(next);

  DecStrategy.findOne({
    _id: _id
  }, null, ep.done(function (dec_strategy) {
    res.render('dec_strategy', {
      dec_strategy: dec_strategy,
    });

    limit.perwhatperdaydo('dec_strategy_homepage', req.ip + _id,
      1,
      function () {
        DecStrategy.incOne({
          _id: _id
        }, {
          view_count: 1
        });
      });
  }));
}

exports.search_dec_strategy = function (req, res, next) {

}
