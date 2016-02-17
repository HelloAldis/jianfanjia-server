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

exports.search_beautiful_image = function (req, res, next) {
  var query = req.body.query || {};
  query.status = type.beautiful_image_status_public;
  var sort = req.body.sort || {
    lastupdate: -1
  };
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var userid = ApiUtil.getUserid(req);
  var usertype = ApiUtil.getUsertype(req);

  var ep = eventproxy();
  ep.fail(next);

  var search_word = req.body.search_word;
  if (search_word && search_word.trim().length > 0) {
    search_word = new RegExp(tools.trim(search_word), 'i');
    query['$or'] = [{
      title: search_word
    }, {
      description: search_word
    }, {
      keywords: search_word
    }];
  }

  BeautifulImage.paginate(query, null, {
    sort: sort,
    skip: skip,
    limit: limit,
    lean: true,
  }, ep.done(function (beautiful_images, total) {
    async.mapLimit(beautiful_images, 3, function (beautiful_image, callback) {
      if (userid && usertype !== type.role_admin) {
        Favorite.findOne({
          userid: userid,
          favorite_beautiful_image: beautiful_image._id,
        }, {
          userid: 1
        }, function (err, favorite) {
          if (favorite) {
            beautiful_image.is_my_favorite = true;
          } else {
            beautiful_image.is_my_favorite = false;
          }
          callback(err, beautiful_image);
        });
      } else {
        beautiful_image.is_my_favorite = false;
        callback(null, beautiful_image);
      }
    }, ep.done(function (beautiful_images) {
      res.sendData({
        beautiful_images: beautiful_images,
        total: total
      });
    }));
  }));
}
