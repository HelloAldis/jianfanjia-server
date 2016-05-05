var eventproxy = require('eventproxy');
var DecStrategy = require('../proxy').DecStrategy;
var _ = require('lodash');
var async = require('async');
var type = require('../type');
var limit = require('../middlewares/limit');

exports.dec_strategy_homepage = function (req, res, next) {
  var _id = req.query.pid;
  var ep = eventproxy();
  ep.fail(next);

  if (!_id) {
    return next();
  }

  DecStrategy.findOne({
    _id: _id
  }, null, ep.done(function (dec_strategy) {
    if (dec_strategy) {
      async.parallel({
        previous_article: function (callback) {
          DecStrategy.find({
            articletype: dec_strategy.dec_strategy,
            status: type.article_status_public,
            create_at: {
              $lt: dec_strategy.create_at
            },
          }, {
            title: 1
          }, {
            skip: 0,
            limit: 1,
          }, callback);
        },
        next_article: function (callback) {
          DecStrategy.find({
            articletype: dec_strategy.dec_strategy,
            status: type.article_status_public,
            create_at: {
              $gt: dec_strategy.create_at
            },
          }, {
            title: 1
          }, {
            skip: 0,
            limit: 1,
          }, callback);
        },
        associate_articles: function (callback) {
          var query = {};
          var keywords = dec_strategy.keywords.split(/,|，/);
          _.remove(keywords, function (k) {
            return k.trim().length === 0;
          });
          if (keywords.length > 0) {
            var regex = new RegExp(keywords.join('|'), 'i');
            query.keywords = regex;
          }
          query.status = type.article_status_public;
          // query.articletype = articletype;
          query._id = {
            $ne: _id
          };

          DecStrategy.paginate(query, {
            title: 1,
            cover_imageid: 1,
            articletype: 1,
          }, {
            sort: {
              create_at: -1,
            },
            skip: 0,
            limit: 4,
          }, callback);
        },
      }, ep.done(function (result) {
        res.ejs('page/dec_strategy', {
          dec_strategy: dec_strategy,
          previous_article: result.previous_article,
          next_article: result.next_article,
          associate_articles: result.associate_articles[0],
        }, req);
      }));

      limit.perwhatperdaydo('dec_strategy_homepage', req.ip + _id,
        1,
        function () {
          DecStrategy.incOne({
            _id: _id
          }, {
            view_count: 1
          });
        });
    } else {
      next();
    }
  }));
}
