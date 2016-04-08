'use strict'

const Designer = require('../../proxy').Designer;
const type = require('../../type');
const async = require('async');

var designerNames = ['吴蒙', '江尚飞', '向鑫', '吴海华', '李耀强', '黄赞', '柯志林', '邓杨超', '朱亚琴', '邹航', '方建军', '胡亮', '赖从伟', '胡世民', '刘智', '彭虎', '陈永生', '戴涛', '张高源'];
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
        let index = designerNames.indexOf(designer.username)
        if (index > -1) {
          designer.package_types = ['0', '1'];
          console.log(designer.username + ' 支持365基础包');
          designerNames.splice(index, 1);
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
      console.log(designerNames + 'are wrong designer name');
      process.exit();
    }
  });
});
