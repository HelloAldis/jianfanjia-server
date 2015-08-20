var validator = require('validator');
var eventproxy = require('eventproxy');
var Favorite = require('../../proxy').Favorite;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../config');
var ApiUtil = require('../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports.list = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);

  Favorite.getProductFavorites(userid, function (err, favorite) {
    if (err) {
      return next(err);
    }

    res.sendData(favorite);
  });
};

exports.add = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  console.log(tools.trim(req.body._id));
  var productid = new ObjectId(tools.trim(req.body._id));

  Favorite.getProductFavorites(userid, function (err, favorite) {
    if (err) {
      return next(err);
    }

    if (favorite) {
      Favorite.addProduct2Favorite(userid, productid, function (err) {
        if (err) {
          return next(err);
        }

        res.sendSuccessMsg();
      });
    } else {
      Favorite.newAndSave({userid: userid, favorite_product:[productid]}, function (err) {
        if (err) {
          return next(err);
        }

        res.sendSuccessMsg();
      });
    }

  });
};

exports.delete = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var productid = tools.trim(req.body._id);

  Favorite.deleteProductFavorite(userid, productid, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
};
