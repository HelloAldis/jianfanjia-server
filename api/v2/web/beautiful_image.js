var validator = require('validator');
var eventproxy = require('eventproxy');
var BeautifulImage = require('../../../proxy').BeautifulImage;
var Favorite = require('../../../proxy').Favorite;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../apiconfig');
var async = require('async');
var ApiUtil = require('../../../common/api_util');
var type = require('../../../type');
var limit = require('../../../middlewares/limit');

exports.beautiful_image_homepage = function (req, res, next) {
  var _id = req.body._id;
  var userid = ApiUtil.getUserid(req);
  var usertype = ApiUtil.getUsertype(req);
  var ep = eventproxy();
  ep.fail(next);

  BeautifulImage.findOne({
    _id: _id
  }, null, ep.done(function (beautiful_image) {
    if (beautiful_image) {
      BeautifulImage.paginate({
        _id: {
          $ne: beautiful_image._id
        },
        house_type: beautiful_image.house_type,
        dec_style: beautiful_image.dec_style,
        section: beautiful_image.section,
        status: type.beautiful_image_status_public,
      }, {
        images: 1,
      }, {
        sort: {
          lastupdate: -1
        },
        skip: 0,
        limit: 6
      }, ep.done(function (associate_beautiful_images, total) {
        beautiful_image = beautiful_image.toObject();
        beautiful_image.associate_beautiful_images =
          associate_beautiful_images;
        if (userid && usertype !== type.role_admin) {
          beautiful_image = beautiful_image.toObject();
          Favorite.findOne({
            userid: userid,
            favorite_beautiful_image: _id,
          }, null, ep.done(function (favorite) {
            if (favorite) {
              beautiful_image.is_my_favorite = true;
            } else {
              beautiful_image.is_my_favorite = false;
            }
            res.sendData(beautiful_image);
          }));
        } else {
          res.sendData(beautiful_image);
        }
      }));

      limit.perwhatperdaydo('beautiful_image_homepage', req.ip + _id,
        1,
        function () {
          BeautifulImage.incOne({
            _id: _id
          }, {
            view_count: 1
          });
        });
    } else {
      res.sendData({});
    }
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
    section: 1,
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
