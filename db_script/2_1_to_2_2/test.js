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
            console.log(util.format(
              'format=%s  Geometry=%s  depth=%s  Resolution=%s  Filesize=%s  Compression=%s  JPEG-Quality=%s  Colorspace=%s',
              value['format'], value['Geometry'], value[
                'depth'], value['Resolution'], value[
                'Filesize'], value['Compression'], value[
                'JPEG-Quality'], value[
                'JPEG-Colorspace-Name']));

            if (value['format'] === 'JPEG') {
              gm(image.data).density(72, 72).quality(80).compress(
                'JPEG').interlace('Line').toBuffer('JPEG', function (err, buff) {
                var loss = (image.data.length - buff.length) /
                  1024.0;
                if (loss > 0) {
                  reduce += loss;
                  console.log('reduce size ' + loss + ' kb');
                } else {
                  inc += loss;
                  console.log('inc size ' + loss + ' kb');
                }
                next(null);
              });
            } else {
              gm(image.data).toBuffer('JPEG', function (err, jpegbuf) {
                gm(jpegbuf).density(72, 72).quality(80).compress(
                  'JPEG').interlace('Line').toBuffer('JPEG', function (err, buff) {
                  var loss = (image.data.length - buff.length) /
                    1024.0;
                  if (loss > 0) {
                    reduce += loss;
                    console.log('reduce size ' + loss + ' kb');
                  } else {
                    inc += loss;
                    console.log('inc size ' + loss + ' kb');
                  }
                  next(null);
                });
              });
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
    console.log('count ' + count);
    console.log('reduce ' + reduce + ' kb');
    console.log('inc ' + inc + ' kb');
  });
});
