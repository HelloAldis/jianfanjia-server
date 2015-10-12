var validator = require('validator');
var eventproxy = require('eventproxy');
var Image = require('../../../proxy').Image;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../config');
var async = require('async');
var ApiUtil = require('../../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var utility = require('utility');
var imageUtil = require('../../../common/image_util')

exports.add = function (req, res, next) {
  var ep = eventproxy();
  ep.fail(next);

  ep.on('data', function (data) {
    var userid = ApiUtil.getUserid(req);
    var md5 = utility.md5(data);

    Image.findOne({
      'md5': md5,
      'userid': userid
    }, null, ep.done(function (image) {
      if (image) {
        res.sendData(image._id);
      } else {
        imageUtil.jpgbuffer(data, ep.done(function (buf) {
          Image.newAndSave(md5, buf, userid, ep.done(function (
            savedImage) {
            res.sendData(savedImage._id);
          }));
        }));
      }
    }));
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
  var ep = eventproxy();
  ep.fail(next);

  Image.findOne({
    _id: _id
  }, null, ep.done(function (image) {
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
  }));
}

exports.thumbnail = function (req, res, next) {
  var _id = tools.trim(req.params._id);
  var width = tools.trim(req.params.width);
  var ep = eventproxy();
  ep.fail(next);

  Image.findOne({
    _id: _id
  }, null, ep.done(function (image) {
    if (image) {
      imageUtil.resize2stream(image.data, width, ep.done(function (
        stdout, stderr) {
        res.writeHead(200, {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'max-age=315360000'
        });
        stdout.pipe(res);
      }));

    } else {
      res.status(404).end();
    }
  }));
}

exports.watermark = function (req, res, next) {
  var _id = tools.trim(req.params._id);
  var ep = eventproxy();
  ep.fail(next);

  Image.findOne({
    _id: _id
  }, null, ep.done(function (image) {
    if (image) {
      console.log('a=' + image);
      imageUtil.watermark(image.data, ep.done(function (stdout, stderr) {
        res.writeHead(200, {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'max-age=315360000'
        });
        stdout.pipe(res);
      }));
    } else {
      res.status(404).end();
    }
  }));
}


exports.crop = function (req, res, next) {
  var ep = eventproxy();
  ep.fail(next);

  console.log(req.body);
  Image.findOne({
    _id: req.body._id
  }, null, ep.done(function (image) {
    imageUtil.crop2buffer(image.data, req.body.width, req.body.height,
      req.body.x, req.body.y, ep.done(function (buffer) {
        ep.emit('data', buffer);
      }));
  }));

  ep.on('data', function (data) {
    var userid = ApiUtil.getUserid(req);
    var md5 = utility.md5(data);

    Image.findOne({
      'md5': md5,
      'userid': userid
    }, null, ep.done(function (image) {
      if (image) {
        res.sendData(image._id);
      } else {
        Image.newAndSave(md5, data, userid, ep.done(function (
          savedImage) {
          res.sendData(savedImage._id);
        }));
      }
    }));
  });
}
