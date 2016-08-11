var models = require('lib/models');
var Share = models.Share;

exports.findOne = function (query, project, callback) {
  Share.findOne(query, project, callback);
}

exports.find = function (query, project, option, callback) {
  Share.find(query, project, option, callback);
}

exports.setOne = function (query, update, option, callback) {
  Share.findOneAndUpdate(query, {
    $set: update
  }, option, callback)
}

exports.newAndSave = function (json, callback) {
  var share = new Share(json);
  share.create_at = new Date().getTime();
  share.lastupdate = share.create_at;
  share.save(callback);
};

exports.removeOne = function (query, option, callback) {
  Share.findOneAndRemove(query, option, callback)
};

exports.paginate = function (query, project, option, callback) {
  Share.count(query, function (err, count) {
    if (err) {
      return callback(err, null);
    }

    exports.find(query, project, option, function (err, array) {
      callback(err, array, count);
    });
  });
};

exports.count = function (query, callback) {
  Share.count(query, callback);
}
