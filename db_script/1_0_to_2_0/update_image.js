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
        async.parallel({
          size: function (callback) {
            gm(image.data).size(callback);
          },
          filesize: function (callback) {
            gm(image.data).filesize(callback);
          }
        }, function (err, result) {
          var s1 = JSON.stringify(result.size);
          var s2 = image._id.toString();
          var s3 = result.filesize.toString();
          console.log('id =' + s2 + ' size=' + s1 + ' filesize=' +
            s3);
          skip++;
          callback();
        });
      });
  },
  function (err) {
    console.log(err);
  });

console.log('over');
