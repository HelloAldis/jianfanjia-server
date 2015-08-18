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
