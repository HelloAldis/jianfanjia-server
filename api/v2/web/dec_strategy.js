var validator = require('validator');
var eventproxy = require('eventproxy');
var DecStrategy = require('../../../proxy').DecStrategy;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../apiconfig');
var async = require('async');
var ApiUtil = require('../../../common/api_util');
var type = require('../../../type');

exports.dec_strategy_homepage = function (req, res, next) {
  var _id = req.body._id;
  var ep = eventproxy();
  ep.fail(next);

  DecStrategy.findOne({
    _id: _id
  }, null, ep.done(function (dec_strategy) {
    res.render('dec_strategy', {
      dec_strategy: dec_strategy,
    });
  }));
}
