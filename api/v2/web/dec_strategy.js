"use strict"

const validator = require('validator');
const eventproxy = require('eventproxy');
const DecStrategy = require('../../../proxy').DecStrategy;
const tools = require('../../../common/tools');
const _ = require('lodash');
const config = require('../../../apiconfig');
const async = require('async');
const ApiUtil = require('../../../common/api_util');
const type = require('../../../type');
const limit = require('../../../middlewares/limit');
const reg_util = require('../../../common/reg_util');

exports.top_articles = function (req, res, next) {
  let limit = req.body.limit || 5;
  let ep = eventproxy();
  ep.fail(next);

  async.parallel({
    dec_strategies: function (callback) {
      DecStrategy.find({
        status: type.article_status_public,
        articletype: type.articletype_dec_strategy,
      }, {
        title: 1,
        description: 1,
        cover_imageid: 1,
        articletype: 1,
      }, {
        sort: {
          create_at: -1,
        },
        skip: 0,
        limit: limit,
      }, callback);
    },
    dec_tips: function (callback) {
      DecStrategy.find({
        status: type.article_status_public,
        articletype: type.articletype_dec_tip,
      }, {
        title: 1,
        description: 1,
        cover_imageid: 1,
        articletype: 1,
      }, {
        sort: {
          create_at: -1,
        },
        skip: 0,
        limit: limit,
      }, callback);
    },
  }, ep.done(function (result) {
    res.sendData(result);
  }));
}

exports.search_article = function (req, res, next) {
  let query = req.body.query || {};
  query.status = type.article_status_public;
  let sort = req.body.sort || {
    create_at: -1
  };
  let skip = req.body.from || 0;
  let limit = req.body.limit || 10;
  let ep = eventproxy();
  ep.fail(next);

  DecStrategy.paginate(query, {
    title: 1,
    description: 1,
    cover_imageid: 1,
    articletype: 1,
  }, {
    sort: {
      create_at: -1,
    },
    skip: skip,
    limit: limit,
  }, ep.done(function (articles, total) {
    res.sendData({
      articles: articles,
      total: total,
    });
  }));
}

// exports.associate_article = function (req, res, next) {
//   let _id = req.body._id;
//   let keywords = req.body.keywords;
//   let limit = req.body.limit || 5;
//   let articletype = req.body.articletype;
//   let ep = eventproxy();
//   ep.fail(next);
//
//   let query = {};
//   keywords = keywords.split(/,|，/);
//   _.remove(keywords, function (k) {
//     return k.trim().length === 0;
//   });
//   if (keywords.length > 0) {
//     let regex = reg_util.reg(keywords.join('|'), 'i');
//     query.keywords = regex;
//   }
//   query.status = type.article_status_public;
//   query.articletype = articletype;
//   query._id = {
//     $ne: _id
//   };
//
//   DecStrategy.paginate(query, {
//     title: 1,
//     cover_imageid: 1,
//     articletype: 1,
//   }, {
//     sort: {
//       create_at: -1,
//     },
//     skip: 0,
//     limit: limit,
//   }, ep.done(function (articles, total) {
//     res.sendData({
//       articles: articles,
//       total: total,
//     });
//   }));
// }
