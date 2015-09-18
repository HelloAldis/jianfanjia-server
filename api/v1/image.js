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
var imageUtil = require('../../common/image_util')

exports.add = function (req, res, next) {
  var ep = eventproxy();
  ep.fail(next);

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
        imageUtil.jpgbuffer(data, function (err, buf) {
          if (err) {
            return next(err);
          }

          Image.newAndSave(md5, buf, userid, function (err,
            savedImage) {
            if (err) {
              return next(err);
            }
            res.sendData(savedImage._id);
          });
        });
      }
    });
  });

  if (Buffer.isBuffer(req.body)) {
    ep.emit('data', req.body);
  } else if (req.file) {
    if (Buffer.isBuffer(req.file.buffer)) {
      ep.emit('data', req.file.buffer);
    }
  } else {
    res.status(403).send('forbidden');
  }
};

exports.get = function (req, res, next) {
  var _id = tools.trim(req.params._id);

  Image.getImageById(_id, function (err, image) {
    if (err) {
      return next(err);
    }

    if (image) {
      res.writeHead(200, {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'max-age=315360000'
      });
      res.write(image.data);
      res.end();
    } else {
      res.status(404).end();
    }
  });
}

exports.thumbnail = function (req, res, next) {
  var _id = tools.trim(req.params._id);
  var width = tools.trim(req.params.width);

  Image.getImageById(_id, function (err, image) {
    if (err) {
      return next(err);
    }

    if (image) {
      imageUtil.resize2stream(image.data, width, function (err, stdout,
        stderr) {
        if (err) {
          return next(err);
        }

        res.writeHead(200, {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'max-age=315360000'
        });
        stdout.pipe(res);
      });

    } else {
      res.status(404).end();
    }
  });
}

exports.watermark = function (req, res, next) {
  var _id = tools.trim(req.params._id);

  Image.getImageById(_id, function (err, image) {
    if (err) {
      return next(err);
    }

    if (image) {
      imageUtil.watermark(image.data, function (err, stdout, stderr) {
        if (err) {
          return next(err);
        }

        res.writeHead(200, {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'max-age=315360000'
        });
        stdout.pipe(res);
      });
    } else {
      res.status(404).end();
    }
  });
}
