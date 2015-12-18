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

exports.top_articles = function (req, res, next) {
  var limit = req.body.limit || 5;
  var ep = eventproxy();
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
  var query = req.body.query || {};
  query.status = type.article_status_public;
  var sort = req.body.sort || {
    create_at: -1
  };
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
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

exports.associate_article = function (req, res, next) {
  var _id = req.body._id;
  var keywords = req.body.keywords;
  var limit = req.body.limit || 5;
  var articletype = req.body.articletype;
  var ep = eventproxy();
  ep.fail(next);

  var query = {};
  keywords = keywords.split(/,|，/);
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
    limit: limit,
  }, ep.done(function (articles, total) {
    res.sendData({
      articles: articles,
      total: total,
    });
  }));
}
