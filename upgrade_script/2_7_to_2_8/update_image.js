'use strict'

var Image = require('../../proxy').Image;
var imageUtil = require('../../common/image_util');
var async = require('async');
var gm = require('gm');
var util = require('util');

Image.count({}, function (err, count) {
  if (err) {
    return console.log('err = ' + err);
  }
  var reduce = 0;
  var inc = 0;

  async.timesSeries(count, function (n, next) {
      Image.find({}, null, {
        skip: n,
        limit: 1,
        sort: {
          _id: 1,
        }
      }, function (err, images) {
        if (err) {
          next(err);
        } else {
          var image = images[0];

          imageUtil.meta(image.data, function (err, size) {
            if (err) {
              console.log('error image with imageid = ' + image._id);
              next(null);
              return;
            }

            image.width = size.width;
            image.height = size.height;
            console.log(`imageid ${image._id} size: ${size.width}x${size.height}`);
            image.save(function () {
              next(null);
            });
          });
        }
      });
    },
    function (err) {
      if (err) {
        console.log('complete wit err =' + err);
      } else {
        console.log('complete ok');
      }
      process.exit();
    });
});
