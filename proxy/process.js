var models = require('../models');
var Process = models.Process;
var type = require('../type');
var _ = require('lodash');

exports.newAndSave = function (json, callback) {
  var process = new Process(json);
  process.create_at = new Date().getTime();
  process.save(callback);
};

exports.addImage = function (id, section, item, imageid, callback) {
  var index = _.indexOf(type.process_work_flow, section);
  var path = 'sections.' + index + '.items.name';
  var query = {};
  query._id = id;
  query[path] = item;
  path = 'sections.' + index + '.items.$.images';
  var update = {};
  update[path] = imageid;
  var set = {};
  set['sections.' + index + '.items.$.date'] = new Date().getTime();

  Process.findOneAndUpdate(query, {
    $push: update,
    $set: set,
  }, callback);
};

exports.addYsImage = function (id, section, key, imageid, callback) {
  var update = {};
  update['sections.$.ys.images'] = {
    key: key,
    imageid: imageid
  };
  var set = {};
  set['sections.$.ys.date'] = new Date().getTime();

  Process.findOneAndUpdate({
    _id: id,
    'sections.name': section
  }, {
    $push: update,
    $set: set,
  }, callback);
}

exports.updateYsImage = function (id, section, key, imageid, callback) {
  var index = _.indexOf(type.process_work_flow, section);
  var path = 'sections.' + index + '.ys.images.key'
  var query = {};
  query._id = id;
  query[path] = key;

  var update = {};
  path = 'sections.' + index + '.ys.images.$.imageid'
  update[path] = imageid;
  update['sections.' + index + '.ys.date'] = new Date().getTime();

  Process.findOneAndUpdate(query, {
    $set: update
  }, callback);
}

exports.deleteYsImage = function (id, section, key, callback) {
  exports.updateYsImage(id, section, key, null, callback);
}

exports.addComment = function (id, section, item, comment, callback) {
  var index = _.indexOf(type.process_work_flow, section);
  var path = 'sections.' + index + '.items.name';
  var query = {};
  query[path] = item;
  query._id = id;
  path = 'sections.' + index + '.items.$.comments';
  var update = {};
  update[path] = comment;
  var set = {};
  set['sections.' + index + '.items.$.date'] = new Date().getTime();

  Process.findOneAndUpdate(query, {
    $push: update,
    $set: set,
  }, callback);
};

exports.updateStatus = function (id, section, item, status, callback) {
  var index = _.indexOf(type.process_work_flow, section);
  var query = {};
  var update = {};

  if (item) {
    var path = 'sections.' + index + '.items.name';
    query[path] = item;
    query._id = id;

    path = 'sections.' + index + '.items.$.status';
    update[path] = status;
    update['sections.' + index + '.items.$.date'] = new Date().getTime();
  } else {
    query._id = id;

    var path = 'sections.' + index + '.status';
    update[path] = status;
    update['going_on'] = section;
  }

  Process.findOneAndUpdate(query, {
    $set: update
  }, callback);
}

exports.getProcessById = function (id, callback) {
  Process.findOne({
    _id: id
  }, callback);
}

exports.getProcessByUserid = function (userid, callback) {
  Process.findOne({
    userid: userid
  }, callback);
}

exports.getSByQueryAndProject = function (query, project, callback) {
  Process.find(query, project, callback);
}

exports.removeOneByQuery = function (query, callback) {
  Process.findOneAndRemove(query, callback);
}

exports.findOne = function (query, project, callback) {
  Process.findOne(query, project, callback);
}
