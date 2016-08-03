'use strict'

const Favorite = require('lib/proxy').Favorite;
const type = require('lib/type/type');

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
  if (userid && usertype !== type.role_admin) {
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

exports.is_favorite_diary = function (userid, usertype, diaryid, callback) {
  if (userid && usertype !== type.role_admin) {
    Favorite.findOne({
      userid: userid,
      favorite_diary: diaryid,
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

exports.is_favorite_diary_set = function (userid, usertype, diarySetid, callback) {
  if (userid && usertype !== type.role_admin) {
    Favorite.findOne({
      userid: userid,
      favorite_diary_set: diarySetid,
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
