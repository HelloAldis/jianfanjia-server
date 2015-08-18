var models  = require('../models');
var Favorite    = models.Favorite;

exports.getProductFavorites = function (userid, callback) {
  Favorite.findOne({'userid': userid}, callback);
};

exports.newAndSave = function (json, callback) {
  var favorite = new Favorite(json);

  favorite.save(callback);
}

exports.addProduct2Favorite = function (userid, productid, callback) {
  Favorite.findOneAndUpdate({'userid': userid},
  {'$addToSet':{favorite_product: productid}},
  callback);
}

exports.deleteProductFavorite = function (userid, productid, callback) {
  Favorite.findOneAndUpdate({'userid': userid},
  {'$pull': {favorite_product: productid}},
  callback);
};
