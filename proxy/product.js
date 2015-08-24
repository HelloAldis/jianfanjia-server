var models  = require('../models');
var Product    = models.Product;

exports.getProductsByDesignerid = function (designerid, callback) {
  Product.find({'designerid':designerid}, callback);
};

exports.getProductById = function (productid, callback) {
  Product.findOne({_id:productid}, callback);
};

exports.newAndSave = function (json, callback) {
  var product         = new Product(json);
  product.save(callback);
};

exports.updateByQuery = function (query, json, callback) {
  Product.update(query, {$set: json}, callback);
}

exports.removeOneByQuery = function (_id, callback) {
  Product.findOneAndRemove({_id:_id}, callback);
}

exports.addViewCountForProduct = function (productid, num) {
  Product.update({_id:productid}, {'$inc': {'view_count': num}}, function (err) {});
};

exports.addFavoriteCountForProduct = function (productid, num) {
  Product.update({_id:productid}, {'$inc': {'favorite_count': num}}, function (err) {});
};
