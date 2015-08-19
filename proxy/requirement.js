var models  = require('../models');
var Requirement    = models.Requirement;
var uuid    = require('node-uuid');

exports.saveOrUpdateByUserid = function (userid, json, callback) {
  Requirement.findOneAndUpdate({'userid': userid}, json, {upsert: true}, callback);
}

exports.getRequirementByQuery = function (query, json, callback) {
  Requirement.findOne(query, json, {upsert: true}, callback);
}

exports.getRequirementByUserid = function (userid, callback) {
  Requirement.findOne({userid: userid}, callback);
}

exports.updateByUserid = function (userid, obj, callback) {
  Requirement.findOneAndUpdate({'userid': userid}, obj, callback);
}

exports.updateByQuery = function (query, obj, callback) {
  Requirement.findOneAndUpdate(query, obj, callback);
}
