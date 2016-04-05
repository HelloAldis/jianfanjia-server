'use strict'

const Designer = require('../../proxy').Designer;
const type = require('../../type');
const async = require('async');

var designers = [];
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
        if (designers.indexOf(designer)) {
          designer.package_types = ['0', '1'];
          console.log(designer.username + ' 支持365基础包');
        } else {
          designer.package_types = ['0'];
        }
        designer.save(function (err) {
          next(err);
        });
      }
    });
  }, function (err) {
    if (err) {
      console.log('complete designer wit err =' + err);
      process.exit();
    } else {
      console.log('complete designer ok');
      process.exit();
    }
  });
});
