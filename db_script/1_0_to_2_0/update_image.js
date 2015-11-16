var validator = require('validator');
var eventproxy = require('eventproxy');
var Image = require('../../proxy').Image;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../apiconfig');
var async = require('async');
var ApiUtil = require('../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var type = require('../../type');
var gm = require('gm');
var imageUtil = require('../../common/image_util')

var hasRemain = true;
var skip = 0;
async.whilst(
  function () {
    return hasRemain;
  },
  function (callback) {
    Image.paginate({}, null, {
        skip: skip,
        limit: 1,
      },
      function (err, images) {
        if (images.length === 0) {
          hasRemain = false;
          callback();
          return;
        }
        var image = images[0];
        if (image.data.length > 500000) {
          gm(image.data).size(function (err, value) {
            if (!err) {
              imageUtil.jpgbuffer(image.data, function (err, newBuf) {
                var s1 = JSON.stringify(value);
                var dx = newBuf.length - image.data.length;
                console.log('id =' + image._id + ' size=' + s1 +
                  ' buffersize=' + image.data.length +
                  ' newBuffersize=' + newBuf.length + ' dx=' + dx
                );
              });
            }

            skip++;
            callback();
          });
        } else {
          skip++;
          callback();
        }
      });
  },
  function (err) {
    console.log(err);
  });

console.log('over');
