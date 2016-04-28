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
          gm(image.data).identify(function (err, value) {
            if (err) {
              console.log('error image with imageid = ' + image._id);
              next(null);
            } else {
              if (value['JPEG-Colorspace-Name'] !== 'RGB') {
                console.log(util.format('change colorspace for image id=%s', image._id));
                console.log(value);;
                gm(image.data).density(72, 72).quality(80).colorspace('RGB').compress('JPEG').interlace('Line').toBuffer(
                  'JPEG',
                  function (err, b) {
                    if (err) {
                      console.log('err = ' + err);
                      next(null);
                    } else {
                      image.data = b;
                      image.save(function () {
                        console.log('finsihed save this image \n');
                        next(null);
                      });
                    }
                  });
              } else {
                next(null);
              }
            }
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
    });
});

// Image.findOne({
//   _id: '572181b00e2185847049222f'
// }, null, function (err, image) {
//   gm(image.data).density(72, 72).quality(80).bitdepth(8).colorspace('RGB').compress('JPEG').interlace('Line').toBuffer('JPEG', function (err, b) {
//     console.log('err = ' + err);
//     image.data = b;
//
//     image.save(function () {
//       process.exit();
//     });
//   });
// });


// Image.findOne({
//   _id: '572181b00e2185847049222f'
// }, null, function (err, image) {
//   gm(image.data).identify(function (err, value) {
//     console.log(value);
//   });
// });

//5683aa29cc55fab534b2fd7d
//
