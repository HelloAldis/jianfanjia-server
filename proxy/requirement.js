var models = require('../models');
var Requirement = models.Requirement;
var uuid = require('node-uuid');

exports.saveOrUpdateByUserid = function (userid, json, callback) {
  json.create_at = new Date().getTime();
  Requirement.findOneAndUpdate({
    'userid': userid
  }, json, {
    upsert: true
  }, callback);
}

exports.getRequirementByQuery = function (query, json, callback) {
  Requirement.findOne(query, json, {
    upsert: true
  }, callback);
}

exports.getRequirementByUserid = function (userid, callback) {
  Requirement.findOne({
    userid: userid
  }, callback);
}

exports.updateByUserid = function (userid, obj, callback) {
  Requirement.findOneAndUpdate({
    'userid': userid
  }, obj, callback);
}

exports.updateByQuery = function (query, obj, callback) {
  Requirement.findOneAndUpdate(query, obj, callback);
}

exports.setOne = function (query, update, option, callback) {
  Requirement.findOneAndUpdate(query, {
    $set: update
  }, option, callback);
};

exports.find = function (query, project, option, callback) {
  Requirement.find(query, project, option, callback);
}

exports.paginate = function (query, project, option, callback) {
  Requirement.count(query, function (err, count) {
    if (err) {
      return callback(err, null);
    }

    exports.find(query, project, option, function (err, requirements) {
      callback(err, requirements, count);
    });
  });
};
