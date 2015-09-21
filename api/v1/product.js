var validator = require('validator');
var eventproxy = require('eventproxy');
var Product = require('../../proxy').Product;
var Designer = require('../../proxy').Designer;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../config');
var async = require('async');
var ApiUtil = require('../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var limit = require('../../middlewares/limit');
var type = require('../../type');

exports.add = function (req, res, next) {
  var product = ApiUtil.buildProduct(req);
  var designerid = ApiUtil.getUserid(req);
  product.designerid = designerid;
  product.auth_date = new Date().getTime();

  Product.newAndSave(product, function (err, product) {
    if (err) {
      return next(err);
    }

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
  });
};

exports.update = function (req, res, next) {
  var product = ApiUtil.buildProduct(req);
  var oid = tools.trim(req.body._id);
  var designerid = ApiUtil.getUserid(req);
  product.auth_type = type.product_auth_type_new;
  product.auth_date = new Date().getTime();

  if (oid === '') {
    res.sendErrMsg('信息不完全');
    return;
  }

  Product.setOne({
    _id: oid,
    designerid: designerid
  }, product, {}, function (err, product) {
    if (err) {
      return next(err);
    }

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
  });
}

exports.delete = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var oid = tools.trim(req.body._id);

  if (oid === '') {
    res.sendErrMsg('信息不完全');
    return;
  }

  Product.removeOne({
    _id: new ObjectId(oid),
    designerid: designerid
  }, {}, function (err, product) {
    if (err) {
      return next(err);
    }

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
  });
}

exports.list = function (req, res, next) {
  var designerid = tools.trim(req.params._id);

  Product.find({
    designerid: designerid,
    auth_type: type.product_auth_type_done,
  }, null, null, function (err, products) {
    if (err) {
      return next(err);
    }

    res.sendData(products);
  });
}

exports.listForDesigner = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);

  Product.find({
    designerid: designerid
  }, null, null, function (err, products) {
    if (err) {
      return next(err);
    }

    res.sendData(products);
  });
}

exports.getOne = function (req, res, next) {
  var productid = tools.trim(req.params._id);
  Product.getProductById(productid, function (err, product) {
    if (err) {
      return next(err);
    }

    if (product) {
      limit.perwhatperdaydo('productgetone', req.ip + productid, 1,
        function () {
          Product.addViewCountForProduct(productid, 1);
        });
    }

    res.sendData(product);
  });
}
