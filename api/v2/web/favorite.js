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
var async = require('async');

exports.list_product = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
  ep.fail(next);

  Favorite.findOne({
    userid: userid
  }, null, ep.done(function (favorite) {
    if (favorite && favorite.favorite_product) {
      var productids = favorite.favorite_product.slice(skip, skip +
        limit);
      async.mapLimit(productids, 3, function (productid, callback) {
        Product.findOne({
          _id: productid
        }, null, function (err, product) {
          if (!product) {
            product = {
              _id: productid
            };
          }

          callback(err, product);
        });
      }, ep.done(function (results) {
        res.send({
          products: results,
          total: favorite.favorite_product.length,
        });
      }));
    } else {
      return res.sendData({
        products: [],
        total: 0,
      });
    }
  }));
}

exports.list_designer = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
  ep.fail(next);

  Favorite.findOne({
    userid: userid
  }, null, ep.done(function (favorite) {
    if (favorite && favorite.favorite_designer) {
      var designerids = favorite.favorite_designer.slice(skip, skip +
        limit);
      async.mapLimit(designerids, 3, function (designerid, callback) {
        Designer.findOne({
          _id: designerid
        }, {
          username: 1,
          imageid: 1,
        }, function (err, designer) {
          callback(err, designer);
        });
      }, ep.done(function (results) {
        res.send({
          designers: results,
          total: favorite.favorite_designer.length,
        })
      }));
    } else {
      return res.sendData([]);
    }
  }));
}

exports.add_product = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var productid = new ObjectId(req.body._id);
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
  var designerid = new ObjectId(req.body._id);
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
  var productid = new ObjectId(req.body._id);
  var ep = eventproxy();
  ep.fail(next);

  console.log(productid);
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