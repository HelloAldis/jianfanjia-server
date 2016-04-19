'use strict'

const Designer = require('../../proxy').Designer;
const type = require('../../type');
const async = require('async');

var designerNames365 = ['吴蒙', '江尚飞', '向鑫', '吴海华', '李耀强', '黄赞', '柯志林', '邓杨超', '朱亚琴', '邹航', '方建军', '胡亮', '赖从伟', '胡世民', '刘智',
  '彭虎', '陈永生', '戴涛', '张高源', '段佳琪', '周德義', '刘亮亮', '张韶佳', '陈涛', '陈洋', '杨航', '叶志文', '黄磊', '刘杰', '陶小敏', '唐冕', '汪敏', '刘祥', '周志文',
  '陈忠', '徐伟', '吴军锴', '徐胜贤', '彭畅', '田江玲', '张浩', '夏雨婷', '邹龙', '李进生', '杨莹莹', '王皓', '杨斌', '雷浩', '邹春', '吴江', '姚坤', '陈丹', '罗业瑜'
];
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
        let index = designerNames365.indexOf(designer.username)
        if (index > -1) {
          designer.package_types = ['0', '1'];
          console.log(designer.username + ' 支持365基础包');
          designerNames365.splice(index, 1);
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
      console.log(designerNames365 + 'are wrong designer name');
      process.exit();
    }
  });
});
