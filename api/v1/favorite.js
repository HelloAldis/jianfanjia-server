var validator = require('validator');
var eventproxy = require('eventproxy');
var Favorite = require('../../proxy').Favorite;
var Product = require('../../proxy').Product;
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

        var result = _.find(favorite.favorite_product, function (o) {
          return o.toString() === productid.toString();
        });

        if (!result) {
          Product.addFavoriteCountForProduct(productid, 1);
        }

        res.sendSuccessMsg();
      });
    } else {
      Favorite.newAndSave({
        userid: userid,
        favorite_product: [productid]
      }, function (err) {
        if (err) {
          return next(err);
        }

        Product.addFavoriteCountForProduct(productid, 1);
        res.sendSuccessMsg();
      });
    }

  });
};

exports.delete = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var productid = tools.trim(req.body._id);

  Favorite.deleteProductFavorite(userid, productid, function (err, favorite) {
    if (err) {
      return next(err);
    }

    if (favorite) {
      var result = _.find(favorite.favorite_product, function (o) {
        return o.toString() === productid.toString();
      });

      if (result) {
        Product.addFavoriteCountForProduct(productid, -1);
      }
    }

    res.sendSuccessMsg();
  });
};
