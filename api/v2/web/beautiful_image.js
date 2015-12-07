var validator = require('validator');
var eventproxy = require('eventproxy');
var BeautifulImage = require('../../../proxy').BeautifulImage;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../apiconfig');
var async = require('async');
var ApiUtil = require('../../../common/api_util');
var type = require('../../../type');
var limit = require('../../../middlewares/limit');

exports.beautiful_image_homepage = function (req, res, next) {
  var _id = req.body._id;
  var ep = eventproxy();
  ep.fail(next);

  BeautifulImage.findOne({
    _id: _id
  }, null, ep.done(function (beautiful_image) {
    res.sendData(beautiful_image);

    limit.perwhatperdaydo('beautiful_image_homepage', req.ip + _id,
      1,
      function () {
        BeautifulImage.incOne({
          _id: _id
        }, {
          view_count: 1
        });
      });
  }));
}

exports.search_beautiful_image = function (req, res, next) {
  var query = req.body.query || {};
  query.status = type.beautiful_image_status_public;
  var sort = req.body.sort || {
    lastupdate: -1
  };
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;

  var ep = eventproxy();
  ep.fail(next);

  var search_word = req.body.search_word;
  if (search_word && search_word.trim().length > 0) {
    search_word = new RegExp(tools.trim(search_word), 'i');
    query['$or'] = [{
      title: search_word
    }, {
      description: search_word
    }];
  }

  BeautifulImage.paginate(query, {
    title: 1,
    house_type: 1,
    dec_type: 1,
    dec_style: 1,
    images: 1,
  }, {
    sort: sort,
    skip: skip,
    limit: limit
  }, ep.done(function (beautifulImages, total) {
    res.sendData({
      beautiful_images: beautifulImages,
      total: total
    });
  }));
}
