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

exports.deleteImage = function (id, section, item, i, callback) {
  var index = _.indexOf(type.process_work_flow, section);
  var path = 'sections.' + index + '.items.name';
  var query = {};
  query._id = id;
  query[path] = item;
  var unset = {};
  unset['sections.' + index + '.items.$.images.' + i] = 1;
  var pull = {};
  pull['sections.' + index + '.items.$.images'] = null;
  var set = {};
  set['sections.' + index + '.items.$.date'] = new Date().getTime();

  Process.findOneAndUpdate(query, {
    $unset: unset,
  }, function (err, process) {
    Process.findOneAndUpdate(query, {
      $pull: pull,
      $set: set,
    }, callback);
  });
}

exports.addCommentCount = function (id, section, item, callback) {
  var index = _.indexOf(type.process_work_flow, section);
  var path = 'sections.' + index + '.items.name';
  var query = {};
  query[path] = item;
  query._id = id;
  var inc = {};
  inc['sections.' + index + '.items.$.comment_count'] = 1;
  var set = {};
  set['sections.' + index + '.items.$.date'] = new Date().getTime();

  Process.findOneAndUpdate(query, {
    $inc: inc,
    $set: set,
  }, callback);
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
  var index = _.indexOf(type.process_work_flow, section);

  var pull = {};
  pull['sections.' + index + '.ys.images'] = {
    key: key
  };

  Process.findOneAndUpdate({
    _id: id
  }, {
    $pull: pull,
  }, callback);
}


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

exports.find = function (query, project, option, callback) {
  Process.find(query, project, option, callback);
}

exports.removeOne = function (query, option, callback) {
  Process.findOneAndRemove(query, option, callback)
};

exports.findOne = function (query, project, callback) {
  Process.findOne(query, project, callback);
}
