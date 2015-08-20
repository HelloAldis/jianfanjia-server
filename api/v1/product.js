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

exports.add = function (req, res, next) {
  var product = ApiUtil.buildProduct(req);
  var designerid = ApiUtil.getUserid(req);
  product.designerid = designerid;

  Product.newAndSave(product, function (err) {
    if (err) {
      return next(err);
    }

    Designer.addProductCountForDesigner(designerid, 1);
    res.sendSuccessMsg();
  });
};

exports.update = function (req, res, next) {
  var product = ApiUtil.buildProduct(req);
  var oid = tools.trim(req.body._id);

  if (oid === '') {
    res.sendErrMsg('信息不完全');
    return;
  }

  Product.updateByQuery({_id: oid}, product, function (err) {
    if (err) {
      return next(err);
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

  Product.removeOneByQuery({_id: new ObjectId(oid)}, function (err) {
    if (err) {
      return next(err);
    }

    Designer.addProductCountForDesigner(designerid, -1);
    res.sendSuccessMsg();
  });
}

exports.list = function (req, res, next) {
  var designerid = tools.trim(req.params._id);

  Product.getProductsByDesignerid(designerid, function (err, products) {
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

    res.sendData(product);
  });
}
