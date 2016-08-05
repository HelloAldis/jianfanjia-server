'use strict'

const User = require('lib/proxy').User;
const type = require('lib/type/type');

exports.add_product_history = function (userid, usertype, productid, callback) {
  if (usertype !== type.role_user) {
    return;
  }

  if (!userid || !productid) {
    return;
  }

  User.push({
    _id: userid
  }, {
    product_view_history: productid
  }, callback || function () {});
}

exports.add_beautiful_image_history = function (userid, usertype, beautiful_imageid, callback) {
  if (usertype !== type.role_user) {
    return;
  }

  if (!userid || !beautiful_imageid) {
    return;
  }

  User.push({
    _id: userid
  }, {
    beautiful_image_view_history: beautiful_imageid
  }, callback || function () {});
}

exports.add_designer_history = function (userid, usertype, designerid, callback) {
  if (usertype !== type.role_user) {
    return;
  }

  if (!userid || !designerid) {
    return;
  }

  User.push({
    _id: userid
  }, {
    designer_view_history: designerid
  }, callback || function () {});
}

exports.add_share_history = function (userid, usertype, shareid, callback) {
  if (usertype !== type.role_user) {
    return;
  }

  if (!userid || !shareid) {
    return;
  }

  User.push({
    _id: userid
  }, {
    share_view_history: shareid
  }, callback || function () {});
}

exports.add_strategy_history = function (userid, usertype, strategyid, callback) {
  if (usertype !== type.role_user) {
    return;
  }

  if (!userid || !strategyid) {
    return;
  }

  User.push({
    _id: userid
  }, {
    strategy_view_history: strategyid
  }, callback || function () {});
}
