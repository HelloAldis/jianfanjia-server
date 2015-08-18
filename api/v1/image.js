var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../proxy').User;
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
  // fs.readFile('/Users/jyz/Documents/test.jpg', function (err, data) {
  //   var md5 = utility.md5(data);
  //
  //   Image.getImageByMd5(md5, function (err, image) {
  //     if (err) {
  //       return next(err);
  //     }
  //
  //     if (image) {
  //       res.send({data:image._id});
  //     } else {
  //       Image.newAndSave(md5, data, function (err, savedImage) {
  //         if (err) {
  //           return next(err);
  //         }
  //
  //         res.send({data:savedImage._id});
  //       });
  //     }
  //   });
  // });
  var user = req.user || req.session.user;
  var data = req.body;
  var md5 = utility.md5(data);

  Image.getImageByMd5AndUserid(md5, user._id, function (err, image) {
    if (err) {
      return next(err);
    }

    if (image) {
      res.send({data:image._id});
    } else {
      Image.newAndSave(md5, data, user._id, function (err, savedImage) {
        res.send({data:savedImage._id});
      });
    }
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
