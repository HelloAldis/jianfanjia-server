var models = require('lib/models');
var Requirement = models.Requirement;

exports.newAndSave = function (json, callback) {
  var requirement = new Requirement(json);
  requirement.create_at = new Date().getTime();
  requirement.last_status_update_time = new Date().getTime();
  requirement.save(callback);
};

exports.saveOrUpdateByUserid = function (userid, json, callback) {
  json.create_at = new Date().getTime();
  json.last_status_update_time = new Date().getTime();
  Requirement.findOneAndUpdate({
    'userid': userid
  }, json, {
    upsert: true
  }, callback);
}

exports.addToSet = function (query, addToSet, option, callback) {
  Requirement.findOneAndUpdate(query, {
    '$addToSet': addToSet,
    $set: {
      last_status_update_time: new Date().getTime()
    }
  }, option, callback);
}

exports.pull = function (query, pull, option, callback) {
  Requirement.findOneAndUpdate(query, {
    $pull: pull,
    $set: {
      last_status_update_time: new Date().getTime()
    }
  }, option, callback);
}

exports.setOne = function (query, update, option, callback) {
  update.last_status_update_time = new Date().getTime();
  Requirement.findOneAndUpdate(query, {
    $set: update
  }, option, callback);
};

exports.find = function (query, project, option, callback) {
  Requirement.find(query, project, option, callback);
}

exports.findOne = function (query, project, callback) {
  Requirement.findOne(query, project, callback);
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

exports.removeOne = function (query, option, callback) {
  Requirement.findOneAndRemove(query, option, callback)
};

exports.removeSome = function (query, callback) {
  Requirement.remove(query, callback);
};

exports.count = function (query, callback) {
  Requirement.count(query, callback);
}
