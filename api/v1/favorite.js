var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../proxy').User;
var Favorite = require('../../proxy').Favorite;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../config');
var ApiUtil = require('../../common/api_util');

exports.list = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);

  Favorite.getProductFavorites(userid, function (err, favorite) {
    if (err) {
      return next(err);
    }

    res.send({data: favorite});
  });
};

exports.add = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var productid = tools.trim(req.body._id);


  Favorite.getProductFavorites(userid, function (err, favorite) {
    if (err) {
      return next(err);
    }

    if (favorite) {
      Favorite.addProduct2Favorite(userid, productid, function (err) {
        if (err) {
          return next(err);
        }

        res.send({msg: '添加成功'});
      });
    } else {
      Favorite.newAndSave({userid: userid, favorite_product:[productid]}, function (err) {
        if (err) {
          return next(err);
        }

        res.send({msg: '添加成功'});
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

    res.send({msg: '删除成功'});
  });
};
