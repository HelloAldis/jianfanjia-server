var models  = require('../models');
var Requirement    = models.Requirement;
var uuid    = require('node-uuid');

exports.saveOrUpdateByUserid = function (userid, json, callback) {
  Requirement.findOneAndUpdate({'userid': userid}, json, {upsert: true}, callback);
}

exports.getRequirementByUserid = function (userid, callback) {
  Requirement.findOne({userid: userid}, callback);
}
