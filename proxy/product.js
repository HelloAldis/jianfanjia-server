var models = require('../models');
var Product = models.Product;

exports.newAndSave = function (json, callback) {
  var product = new Product(json);
  product.create_at = new Date().getTime();
  product.save(callback);
};

exports.incOne = function (query, update, option, callback) {
  Product.findOneAndUpdate(query, {
    $inc: update
  }, option, function (err) {});
}

exports.setOne = function (query, update, option, callback) {
  Product.findOneAndUpdate(query, {
    $set: update
  }, option, callback)
};

exports.findOne = function (query, project, callback) {
  Product.findOne(query, project, callback);
}

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
