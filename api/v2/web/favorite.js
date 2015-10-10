var validator = require('validator');
var eventproxy = require('eventproxy');
var Favorite = require('../../../proxy').Favorite;
var Product = require('../../../proxy').Product;
var Designer = require('../../../proxy').Designer;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../config');
var ApiUtil = require('../../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports.list = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var ep = eventproxy();
  ep.fail(next);

  Favorite.findOne({
    userid: userid
  }, null, ep.done(function (favorite) {
    res.sendData(favorite);
  }));
};

exports.add_product = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var productid = new ObjectId(tools.trim(req.body._id));
  var ep = eventproxy();
  ep.fail(next);

  Favorite.findOne({
    userid: userid
  }, null, ep.done(function (favorite) {
    if (favorite) {
      Favorite.addToSet({
        userid: userid
      }, {
        favorite_product: productid
      }, null, ep.done(function () {
        var result = _.find(favorite.favorite_product, function (
          o) {
          return o.toString() === productid.toString();
        });

        if (!result) {
          Product.incOne({
            _id: productid
          }, {
            favorite_count: 1
          });
        }

        res.sendSuccessMsg();
      }));
    } else {
      Favorite.newAndSave({
        userid: userid,
        favorite_product: [productid]
      }, ep.done(function () {
        Product.incOne({
          _id: productid
        }, {
          favorite_count: 1
        });
        res.sendSuccessMsg();
      }));
    }

  }));
};

exports.add_designer = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var designerid = new ObjectId(tools.trim(req.body._id));
  var ep = eventproxy();
  ep.fail(next);

  Favorite.findOne({
    userid: userid
  }, null, ep.done(function (favorite) {
    if (favorite) {
      Favorite.addToSet({
        userid: userid
      }, {
        favorite_designer: designerid
      }, null, ep.done(function () {
        var result = _.find(favorite.favorite_designer, function (
          o) {
          return o.toString() === designerid.toString();
        });

        if (!result) {
          Designer.incOne({
            _id: designerid
          }, {
            favorite_count: 1
          }, null);
        }

        res.sendSuccessMsg();
      }));
    } else {
      Favorite.newAndSave({
        userid: userid,
        favorite_designer: [designerid]
      }, ep.done(function () {
        Designer.incOne({
          _id: designerid
        }, {
          favorite_count: 1
        }, null);
        res.sendSuccessMsg();
      }));
    }
  }));
};

exports.delete_product = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var productid = tools.trim(req.body._id);
  var ep = eventproxy();
  ep.fail(next);

  Favorite.pull({
    userid: userid
  }, {
    favorite_product: productid
  }, null, ep.done(function (favorite) {
    if (favorite) {
      var result = _.find(favorite.favorite_product, function (o) {
        return o.toString() === productid.toString();
      });

      if (result) {
        Product.incOne({
          _id: productid
        }, {
          favorite_count: -1
        });
      }
    }

    res.sendSuccessMsg();
  }));
};

exports.delete_designer = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var designerid = tools.trim(req.body._id);
  var ep = eventproxy();
  ep.fail(next);

  Favorite.pull({
    userid: userid
  }, {
    favorite_designer: designerid
  }, null, ep.done(function (favorite) {
    if (favorite) {
      var result = _.find(favorite.favorite_designer, function (o) {
        return o.toString() === designerid.toString();
      });

      if (result) {
        Designer.incOne({
          _id: designerid
        }, {
          favorite_count: -1
        }, null);
      }
    }

    res.sendSuccessMsg();
  }));
};
