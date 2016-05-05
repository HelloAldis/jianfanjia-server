'use strict'

const Designer = require('../../proxy').Designer;
const type = require('../../type');
const async = require('async');

var xinDesignerNames = ['吴蒙', '雷浩', '黄俊超', '陈忠', '江尚飞', '邹春', '邹龙', '刘祥', '刘智', '刘亮亮', '向鑫', '胡世民', '鲁义涛', '吴玉纯', '姜再香', '杨莹莹', '张高源', '彭畅', '刘杰',
  '夏雨婷', '胡玉龙', '邹航', '李耀强', '陈婷婷', '高原', '方梦婷', '张浩', '陶小敏', '汪敏', '吴江', '唐冕', '徐胜贤', '叶志文', '吴军锴', '黄露', '邓杨超', '张聪', '何升', '段佳琪',
  '张韶佳', '黄赞', '杨航', '谈有缘', '姚坤'
];

var luanDesignerNames = ['杨斌', '柯志林', '陈涛', '周德義', '陈洋', '柯志成', '18627023637', '田江玲', '李进生', '方建军', '刘自章', '赖从伟', '徐伟', '朱亚琴', '梅志强', '彭虎', '吴风华',
  '陈丹', '陈永生', '黄磊', '王皓', '陈孟', '戴涛', '周志文', '罗业瑜'
];

var jiangDesignerNames = ['李禹锋', '侯玮', '王岚', '袁磊', '13036166667'];
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
