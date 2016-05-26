'use strict'

const Product = require('../../proxy').Product;
const Image = require('../../proxy').Image;
const image_util = require('../../common/image_util');
const type = require('../../type');
const async = require('async');

Product.count({
  // auth_type: type.product_auth_type_done,
}, function (err, count) {
  if (err) {
    return console.log('err = ' + err);
  }

  async.timesSeries(count, function (n, next) {
    Product.find({
      // auth_type: type.product_auth_type_done,
    }, null, {
      skip: n,
      limit: 1,
      sort: {
        create_at: 1,
      }
    }, function (err, products) {
      if (err) {
        next(err);
      } else {
        var product = products[0];
        async.mapLimit(product.images, 1, function (image, callback) {
          Image.findOne({
            // _id: '5628e2b2b9b3976a12296106'
            _id: image.imageid
          }, null, function (err, image_indb) {
            if (err) {
              callback(err);
              return;
            }

            image_util.isPlanImage(image_indb.data, function (err, isEqual, equality, raw) {
              image.equality = equality;
              callback(err, image);
            });

          });
        }, function (err, images) {
          let plan_images = images.filter(function (image) {
            if (image.equality <= 0.03) {
              console.log(`productid:${product._id} imageid: ${image.imageid} is plan image, equality: ${image.equality}`);
              return true;
            }
          });

          let effect_images = images.filter(function (image) {
            if (image.equality > 0.03) {
              return true;
            }
          });

          if (effect_images.length > 0) {
            product.cover_imageid = effect_images[0].imageid;
          } else {
            console.log(`productid:${product._id} has some issue please check it`);
          }
          product.images = effect_images;
          product.plan_images = plan_images;

          product.save(function (err) {
            next(err);
          });
        });
      }
    });
  }, function (err) {
    if (err) {
      console.log('complete product wit err =' + err);
    } else {
      console.log('complete product ok');
    }
    process.exit();
  });
});
