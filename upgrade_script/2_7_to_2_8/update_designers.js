'use strict'

const Designer = require('../../proxy').Designer;
const type = require('../../type');
const async = require('async');

Designer.count({}, function (err, count) {
  if (err) {
    return console.log('err = ' + err);
  }

  async.timesSeries(count, function (n, next) {
    Designer.find({}, null, {
      skip: n,
      limit: 1,
      sort: {
        create_at: 1
      }
    }, function (err, designers) {
      if (err) {
        next(err);
      } else {
        let designer = designers[0];
        designer.realname = designer.realname || designer.username;

        designer.save(function (err) {
          next(err);
        });
      }
    });
  }, function (err) {
    if (err) {
      console.log('complete wit err =' + err);
      process.exit();
    } else {
      console.log('complete ok');
      process.exit();
    }
  });
});
