var Plan = require('../../proxy').Product;
var async = require('async');
var type = require('../../type');

Plan.count({
  dec_type: type.dec_type_business
}, function (err, count) {
  if (err) {
    return console.log('err = ' + err);
  }

  async.timesSeries(count, function (n, next) {
    Plan.find({
      dec_type: type.dec_type_business
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
        product.business_house_type = product.business_house_type || '9999';
        console.log(product);
        product.save(function (err) {
          next(err);
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
