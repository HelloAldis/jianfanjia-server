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
    }, function (err, images) {
      if (err) {
        next(err);
      } else {
        var image = images[0];
        gm(image.data).identify(function (err, value) {
          if (err) {
            console.log('error image with imageid = ' + image._id);
            next(null);
          } else {
            if (value['depth'] != '8') {
              console.log(util.format('id=%s', image._id));
              console.log(value);;
              console.log('');
              next(null);
            } else {
              next(null);
            }
          }
        });
      }
    });
  }, function (err) {
    if (err) {
      console.log('complete wit err =' + err);
    } else {
      console.log('complete ok');
    }
  });
});
