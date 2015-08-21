var validator = require('validator');
var eventproxy = require('eventproxy');
var Image = require('../../proxy').Image;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../config');
var async = require('async');
var ApiUtil = require('../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var utility = require('utility');
var fs = require('fs');

exports.add = function (req, res, next) {
  var ep = eventproxy();
  ep.fail(next);

  if (Buffer.isBuffer(req.body)) {
    ep.emit('data', req.body);
  } else if (req.file) {
    if (Buffer.isBuffer(req.file.buffer)) {
      ep.emit('data', req.file.buffer);
    }
  } else {
    res.status(403).send('forbidden');
  }

  // fs.readFile('/Users/jyz/Documents/test.jpg', function (err, data) {
  //   console.log(err);
  //   ep.emit('data', data);
  // });
  ep.on('data', function (data) {
    var userid = ApiUtil.getUserid(req);
    var md5 = utility.md5(data);

    Image.getImageByMd5AndUserid(md5, userid, function (err, image) {
      if (err) {
        return next(err);
      }

      if (image) {
        res.sendData(image._id);
      } else {
        Image.newAndSave(md5, data, userid, function (err, savedImage) {
          res.sendData(savedImage._id);
        });
      }
    });
  });
};

exports.get = function (req, res, next) {
  var _id = tools.trim(req.params._id);

  Image.getImageById(_id, function (err, image) {
    if (err) {
      return next(err);
    }

    if (image) {
      res.writeHead(200, {'Content-Type': 'image/jpeg'});
      res.write(image.data);
      res.end();
    } else {
      res.status(404).end();
    }
  });
}
