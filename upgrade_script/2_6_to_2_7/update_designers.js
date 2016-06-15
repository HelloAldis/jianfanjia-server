'use strict'

const Designer = require('../../proxy').Designer;
const type = require('../../type');
const async = require('async');

var xinDesignerNames = [];

var luanDesignerNames = ['邹大峰', '易珍丽'];

var jiangDesignerNames = [];
// var jiangDesignerNames = ['李禹锋', '侯玮', '王岚', '叶明', '袁磊'];

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
        designer.tags = designer.tags || [];
        var set = new Set(designer.tags);

        let index = xinDesignerNames.indexOf(designer.username)
        if (index > -1) {
          set.add('新锐先锋');
          console.log(designer.username + ' 支持新锐先锋');
          xinDesignerNames.splice(index, 1);
        }
        index = xinDesignerNames.indexOf(designer.phone);
        if (index > -1) {
          set.add('新锐先锋');
          console.log(designer.username + ' 支持新锐先锋');
          xinDesignerNames.splice(index, 1);
        }

        index = luanDesignerNames.indexOf(designer.username);
        if (index > -1) {
          set.add('暖暖走心');
          console.log(designer.username + ' 支持暖暖走心');
          luanDesignerNames.splice(index, 1);
        }
        index = luanDesignerNames.indexOf(designer.phone);
        if (index > -1) {
          set.add('暖暖走心');
          console.log(designer.username + ' 支持暖暖走心');
          luanDesignerNames.splice(index, 1);
        }

        index = jiangDesignerNames.indexOf(designer.username);
        if (index > -1) {
          set.add('匠心定制');
          console.log(designer.username + ' 支持匠心定制');
          designer.package_types = ['2'];
          jiangDesignerNames.splice(index, 1);
        }
        index = jiangDesignerNames.indexOf(designer.phone);
        if (index > -1) {
          set.add('匠心定制');
          console.log(designer.username + ' 支持匠心定制');
          designer.package_types = ['2'];
          jiangDesignerNames.splice(index, 1);
        }

        designer.tags = Array.from(set);

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
      console.log(xinDesignerNames + 'are wrong designer name');
      console.log(luanDesignerNames + 'are wrong designer name');
      console.log(jiangDesignerNames + 'are wrong designer name');
      process.exit();
    }
  });
});
