'use strict'

const eventproxy = require('eventproxy');
const DecStrategy = require('../proxy').DecStrategy;
const _ = require('lodash');
const async = require('async');
const type = require('../type');
const limit = require('../middlewares/limit');
const pc_web_header = require('../business/pc_web_header');
const ApiUtil = require('../common/api_util');
const tools = require('../common/tools');
const user_habit_collect = require('../business/user_habit_collect');

exports.dec_strategy_homepage = function (req, res, next) {
  const _id = req.query.pid || req.params._id;
  const userid = ApiUtil.getUserid(req);
  const usertype = ApiUtil.getUsertype(req);
  const associate_limit = 4;
  var ep = eventproxy();
  ep.fail(next);

  if (!tools.isValidObjectId(_id)) {
    return next();
  }

  DecStrategy.findOne({
    _id: _id
  }, null, ep.done(function (dec_strategy) {
    if (dec_strategy) {
      async.parallel({
        previous_article: function (callback) {
          DecStrategy.find({
            // articletype: dec_strategy.articletype,
            status: type.article_status_public,
            create_at: {
              $gt: dec_strategy.create_at
            },
          }, {
            title: 1
          }, {
            skip: 0,
            limit: 1,
            sort: {
              create_at: 1
            }
          }, callback);
        },
        next_article: function (callback) {
          DecStrategy.find({
            // articletype: dec_strategy.articletype,
            status: type.article_status_public,
            create_at: {
              $lt: dec_strategy.create_at
            },
          }, {
            title: 1
          }, {
            skip: 0,
            limit: 1,
            sort: {
              create_at: -1
            }
          }, callback);
        },
        associate_articles: function (callback) {
          var query = {};
          var keywords = dec_strategy.keywords.split(/[,，\|｜]/);
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

          DecStrategy.find(query, {
            title: 1,
            cover_imageid: 1,
            articletype: 1,
          }, {
            sort: {
              create_at: -1,
            },
            skip: 0,
            limit: associate_limit,
          }, function (err, arr) {
            if (arr.length < associate_limit) {
              DecStrategy.find({
                _id: {
                  $ne: _id
                },
                status: type.article_status_public,
              }, {
                title: 1,
                cover_imageid: 1,
                articletype: 1,
              }, null, function (err, dec_strategies) {
                callback(err, arr.concat(_.sample(dec_strategies, 4 - arr.length)));
              });
            } else {
              callback(err, arr);
            }
          });
        },
        header_info: function (callback) {
          if (req.isMobile) {
            callback(null, undefined);
          } else {
            pc_web_header.statistic_info(userid, usertype, callback);
          }
        }
      }, ep.done(function (result) {
        res.ejs('page/dec_strategy', {
          dec_strategy: dec_strategy,
          previous_article: result.previous_article,
          next_article: result.next_article,
          associate_articles: result.associate_articles,
          header_info: result.header_info
        }, req);
      }));

      limit.perwhatperdaydo('dec_strategy_homepage', req.ip + _id, 1, function () {
        DecStrategy.incOne({
          _id: _id
        }, {
          view_count: 1
        });
      });

      user_habit_collect.add_strategy_history(userid, usertype, _id);
    } else {
      next();
    }
  }));
}
