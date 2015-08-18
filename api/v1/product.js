var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../proxy').User;
var Product = require('../../proxy').Product;
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

    res.send({msg: '添加成功'});
  });
};

exports.update = function (req, res, next) {
  var product = ApiUtil.buildProduct(req);
  var oid = tools.trim(req.body._id);

  if (oid === '') {
    res.send({msg: '信息不完全'});
    return;
  }

  Product.updateByQuery({_id: oid}, product, function (err) {
    if (err) {
      return next(err);
    }

    res.send({msg: '更新成功'});
  });
}

exports.delete = function (req, res, next) {
  var user = req.user || req.session.user;
  var oid = tools.trim(req.body._id);

  if (oid === '') {
    res.send({msg: '信息不完全'});
    return;
  }

  Product.removeOneByQuery({_id: new ObjectId(oid)}, function (err) {
    if (err) {
      return next(err);
    }

    res.send({msg: '删除成功'});
  });
}

exports.list = function (req, res, next) {
  var desingerid = tools.trim(req.params._id);

  Product.getProductsByDesignerid(desingerid, function (err, products) {
    if (err) {
      return next(err);
    }

    res.send({
      data: products
    });
  });
}

exports.getOne = function (req, res, next) {
  var productid = tools.trim(req.params._id);

  Product.getProductById(productid, function (err, product) {
    if (err) {
      return next(err);
    }

    res.send({
      data: product
    });
  });
}
