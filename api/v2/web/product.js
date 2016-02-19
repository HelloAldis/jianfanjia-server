var validator = require('validator');
var eventproxy = require('eventproxy');
var Product = require('../../../proxy').Product;
var Designer = require('../../../proxy').Designer;
var Favorite = require('../../../proxy').Favorite;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../apiconfig');
var async = require('async');
var ApiUtil = require('../../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var limit = require('../../../middlewares/limit');
var type = require('../../../type');

exports.add = function (req, res, next) {
  var product = ApiUtil.buildProduct(req);
  var designerid = ApiUtil.getUserid(req);
  product.designerid = designerid;
  product.auth_date = new Date().getTime();
  var ep = new eventproxy();
  ep.fail(next);

  Product.newAndSave(product, ep.done(function (product) {
    if (product) {
      Designer.incOne({
        _id: designerid
      }, {
        product_count: 1
      }, {});

      res.sendSuccessMsg();
    } else {
      res.sendErrMsg('添加失败');
    }
  }));
};

exports.update = function (req, res, next) {
  var product = ApiUtil.buildProduct(req);
  var oid = tools.trim(req.body._id);
  var designerid = ApiUtil.getUserid(req);
  product.auth_type = type.product_auth_type_new;
  product.auth_date = new Date().getTime();
  var ep = new eventproxy();
  ep.fail(next);

  if (oid === '') {
    res.sendErrMsg('信息不完全');
    return;
  }

  Product.setOne({
    _id: oid,
    designerid: designerid
  }, product, {}, ep.done(function (product) {
    if (product) {
      if (product.auth_type === type.product_auth_type_done) {
        Designer.incOne({
          _id: designerid
        }, {
          authed_product_count: -1,
        }, {});
      }
    }

    res.sendSuccessMsg();
  }));
}

exports.delete = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var oid = tools.trim(req.body._id);
  var ep = new eventproxy();
  ep.fail(next);

  if (oid === '') {
    res.sendErrMsg('信息不完全');
    return;
  }

  Product.removeOne({
    _id: new ObjectId(oid),
    designerid: designerid
  }, {}, ep.done(function (product) {
    if (product) {
      var inc = {
        product_count: -1
      };

      if (product.auth_type === type.product_auth_type_done) {
        inc.authed_product_count = -1;
      }

      Designer.incOne({
        _id: designerid
      }, inc, {});
    }

    res.sendSuccessMsg();
  }));
}

exports.search_designer_product = function (req, res, next) {
  var query = req.body.query || {};
  var sort = req.body.sort || {
    create_at: 1
  };
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  query.auth_type = type.product_auth_type_done;
  var ep = new eventproxy();
  ep.fail(next);

  var search_word = req.body.search_word;
  if (search_word && search_word.trim().length > 0) {
    search_word = new RegExp(tools.trim(search_word), 'i');
    query.cell = search_word;
  }

  Product.paginate(query, null, {
    sort: sort,
    skip: skip,
    limit: limit,
  }, ep.done(function (products, total) {
    res.sendData({
      products: products,
      total: total,
    });
  }));
}

exports.designer_my_products = function (req, res, next) {
  var sort = req.body.sort || {
    create_at: 1
  };
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var designerid = ApiUtil.getUserid(req);
  var ep = new eventproxy();
  ep.fail(next);

  Product.paginate({
    designerid: designerid
  }, null, {
    sort: sort,
    skip: skip,
    limit: limit,
  }, ep.done(function (products, total) {
    res.sendData({
      products: products,
      total: total,
    });
  }));
}

exports.product_home_page = function (req, res, next) {
  var productid = req.body._id;
  var userid = ApiUtil.getUserid(req);
  var usertype = ApiUtil.getUsertype(req);
  var ep = new eventproxy();
  ep.fail(next);

  Product.findOne({
    _id: productid
  }, ep.done(function (product) {
    if (product) {
      Designer.findOne({
        _id: product.designerid
      }, {
        username: 1,
        imageid: 1,
        auth_type: 1,
      }, ep.done(function (designer) {
        product = product.toObject();
        product.designer = designer;

        if (userid && usertype !== type.role_admin) {
          Favorite.findOne({
            userid: userid,
            favorite_product: productid,
          }, null, ep.done(function (favorite) {
            if (favorite) {
              product.is_my_favorite = true;
            } else {
              product.is_my_favorite = false;
            }
            res.sendData(product);
          }));
        } else {
          res.sendData(product);
        }
      }));

      limit.perwhatperdaydo('productgetone', req.ip + productid, 1,
        function () {
          Product.incOne({
            _id: productid
          }, {
            view_count: 1
          });
        });
    } else {
      res.sendData({});
    }
  }));
}

exports.designer_one_product = function (req, res, next) {
  var _id = req.body._id;
  var ep = new eventproxy();
  ep.fail(next);

  Product.findOne({
    _id: _id
  }, null, ep.done(function (product) {
    res.sendData(product);
  }));
}

exports.top_products = function (req, res, next) {
  var ep = new eventproxy();
  ep.fail(next);
  var limit = req.body.limit || 20;

  Product.find({
    auth_type: type.product_auth_type_done,
  }, {
    images: 1,
  }, {
    sort: {
      view_count: -1,
    },
    skip: 0,
    limit: 100,
  }, ep.done(function (products) {
    var recs = _.sample(products, limit);
    res.sendData(recs);
  }));
}
