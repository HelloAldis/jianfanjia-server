var models = require('../models');
var Process = models.Process;

exports.newAndSave = function (json, callback) {
  var process = new Process(json);
  process.save(callback);
};

exports.addImage = function (id, section, item, imageid, callback) {
  var update = {};
  var u = section + '.' + item + '.images';
  update[u] = imageid;

  Process.findOneAndUpdate({
    _id: id
  }, {
    $push: update
  }, callback);
};

exports.addYsImage = function (id, section, key, imageid, callback) {
  var update = {};
  path = section + '.' + 'ys.images';
  update[path] = {
    key: key,
    imageid: imageid
  };

  Process.findOneAndUpdate({
    _id: id
  }, {
    $push: update
  }, callback);
}

exports.updateYsImage = function (id, section, key, imageid, callback) {
  var query = {};
  query._id = id;
  var path = section + '.' + 'ys.images.key';
  query[path] = key;

  path = section + '.' + 'ys.images.$.imageid';
  var update = {};
  update[path] = imageid;
  Process.findOneAndUpdate(query, {
    $set: update
  }, callback);
}

exports.addComment = function (id, section, item, content, by, callback) {
  var update = {};
  var u = section + '.' + item + '.comments';
  update[u] = {
    content: content,
    by: by,
    date: new Date(),
  };

  Process.findOneAndUpdate({
    _id: id
  }, {
    $push: update
  }, callback);
};

exports.updateStatus = function (id, section, item, status, callback) {
  var path = "";
  if (item) {
    path = section + "." + item + ".status";
  } else {
    path = section + ".status";
  }
  var update = {};
  update[path] = status;

  Process.findOneAndUpdate({
    _id: id
  }, {
    $set: update
  }, callback);
}

exports.getProcessById = function (id, callback) {
  Process.findOne({
    _id: id
  }, callback);
}
