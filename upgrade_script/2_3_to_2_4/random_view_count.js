var Designer = require('../../proxy').Designer;
var Product = require('../../proxy').Product;
var async = require('async');
var gm = require('gm');
var _ = require('lodash');

Designer.count({}, function (err, count) {
  if (err) {
    return console.log('err = ' + err);
  }

  async.timesSeries(count, function (n, next) {
    Designer.find({}, null, {
      skip: n,
      limit: 1,
    }, function (err, designers) {
      if (err) {
        next(err);
      } else {
        var designer = designers[0];
        designer.view_count = designer.view_count + _.random(10000, 50000);
        // designer.favorite_count = designer.favorite_count + _.random(50, 100);
        designer.save(function () {
          next();
        });
      }
    });
  }, function (err) {
    if (err) {
      console.log('complete designer wit err =' + err);
    } else {
      console.log('complete designer ok');
    }
  });
});

Product.count({}, function (err, count) {
  if (err) {
    return console.log('err = ' + err);
  }

  async.timesSeries(count, function (n, next) {
    Product.find({}, null, {
      skip: n,
      limit: 1,
    }, function (err, products) {
      if (err) {
        next(err);
      } else {
        var product = products[0];
        product.view_count = product.view_count + _.random(10000, 50000);
        // product.favorite_count = product.favorite_count + random(50, 100);
        product.save(function () {
          next();
        });
      }
    });
  }, function (err) {
    if (err) {
      console.log('complete product wit err =' + err);
    } else {
      console.log('complete product ok');
    }
  });
});
