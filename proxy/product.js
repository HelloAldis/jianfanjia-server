var models = require('../models');
var Product = models.Product;

exports.getProductsByDesignerid = function (designerid, callback) {
  Product.find({
    'designerid': designerid
  }, callback);
};

exports.getProductById = function (productid, callback) {
  Product.findOne({
    _id: productid
  }, callback);
};

exports.newAndSave = function (json, callback) {
  var product = new Product(json);
  product.save(callback);
};

exports.updateByQuery = function (query, json, callback) {
  Product.update(query, {
    $set: json
  }, callback);
}

exports.addViewCountForProduct = function (productid, num) {
  Product.update({
    _id: productid
  }, {
    '$inc': {
      'view_count': num
    }
  }, function (err) {});
};

exports.addFavoriteCountForProduct = function (productid, num) {
  Product.update({
    _id: productid
  }, {
    '$inc': {
      'favorite_count': num
    }
  }, function (err) {});
};

exports.setOne = function (query, update, option, callback) {
  Product.findOneAndUpdate(query, {
    $set: update
  }, option, callback)
};

exports.find = function (query, project, option, callback) {
  Product.find(query, project, option, callback);
};

exports.paginate = function (query, project, option, callback) {
  Product.count(query, function (err, count) {
    if (err) {
      return callback(err, null);
    }

    exports.find(query, project, option, function (err, products) {
      callback(err, products, count);
    });
  });
};

exports.removeOne = function (query, option, callback) {
  Product.findOneAndRemove(query, option, callback)
};
