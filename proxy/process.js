var models = require('../models');
var Process = models.Process;

exports.newAndSave = function (json, callback) {
  var process = new Process(json);
  process.save(callback);
};

exports.addImage = function (id, section, item, imageid, callback) {
  var imagepath = section + '.' + item + '.images';
  Process.findOneAndUpdate({
    _id: id
  }, {
    $push: {
      imagepath: imageid
    }
  }, callback);
};

exports.getProcessById = function (id, callback) {
  Process.findOne({
    _id: id
  }, callback);
}
