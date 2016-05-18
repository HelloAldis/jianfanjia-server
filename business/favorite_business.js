'use strict'

const Favorite = require('../proxy').Favorite;
const type = require('../type');
const async = require('async');

exports.is_favorite_designer = function (userid, usertype, designerid, callback) {
  if (userid && usertype === type.role_user) {
    Favorite.findOne({
      userid: userid,
      favorite_designer: designerid,
    }, null, function (err, favorite) {
      if (favorite) {
        callback(err, true);
      } else {
        callback(err, false);
      }
    });
  } else {
    callback(null, undefined);
  }
}

exports.is_favorite_product = function (userid, usertype, productid, callback) {
  if (userid && usertype === type.role_user) {
    Favorite.findOne({
      userid: userid,
      favorite_product: productid,
    }, null, function (err, favorite) {
      if (favorite) {
        callback(err, true);
      } else {
        callback(err, false);
      }
    });
  } else {
    callback(null, undefined);
  }
}
