var models = require('../models');
var Favorite = models.Favorite;

exports.getProductFavorites = function (userid, callback) {
  Favorite.findOne({
    'userid': userid
  }, callback);
};

exports.newAndSave = function (json, callback) {
  var favorite = new Favorite(json);

  favorite.save(callback);
}

exports.addProduct2Favorite = function (userid, productid, callback) {
  Favorite.findOneAndUpdate({
      'userid': userid
    }, {
      '$addToSet': {
        favorite_product: productid
      }
    },
    callback);
}

exports.deleteProductFavorite = function (userid, productid, callback) {
  Favorite.findOneAndUpdate({
      'userid': userid
    }, {
      '$pull': {
        favorite_product: productid
      }
    },
    callback);
};

exports.incOne = function (query, update, option, callback) {
  Designer.findOneAndUpdate(query, {
    $inc: update
  }, option, function (err) {});
}

exports.findOne = function (query, project, callback) {
  Designer.findOne(query, project, callback);
}

exports.find = function (query, project, option, callback) {
  Designer.find(query, project, option, callback);
}

exports.setOne = function (query, update, option, callback) {
  Designer.findOneAndUpdate(query, {
    $set: update
  }, option, callback)
}
