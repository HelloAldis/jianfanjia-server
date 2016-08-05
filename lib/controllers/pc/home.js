'use strict'

const eventproxy = require('eventproxy');
const pc_web_header = require('lib/business/pc_web_header');
const _ = require('lodash');
const async = require('async');
const type = require('lib/type/type');
const ApiUtil = require('lib/common/api_util');
const Designer = require('lib/proxy').Designer;
const BeautifulImage = require('lib/proxy').BeautifulImage;
const Share = require('lib/proxy').Share;
const DecStrategy = require('lib/proxy').DecStrategy;

exports.index = function (req, res, next) {
  const _id = ApiUtil.getUserid(req);
  const usertype = ApiUtil.getUsertype(req);
  const beautiful_image_limit = 4;
  const share_limit = 6;
  const latest_scenes_limit = 30;
  const dec_strategies_limit = 5;
  const designer_limit = 20;
  const ep = eventproxy();
  ep.fail(next);

  async.parallel({
    header_info: function (callback) {
      pc_web_header.statistic_info(_id, usertype, callback)
    },
    jxdz_designers: function (callback) {
      Designer.find({
        auth_type: type.designer_auth_type_done,
        tags: '匠心定制'
      }, {
        username: 1,
        imageid: 1,
        auth_type: 1,
        uid_auth_type: 1,
        work_auth_type: 1,
        tags: 1
      }, null, function (err, designers) {
        callback(err, _.sample(designers, designer_limit));
      });
    },
    xrxf_designers: function (callback) {
      Designer.find({
        auth_type: type.designer_auth_type_done,
        tags: '新锐先锋'
      }, {
        username: 1,
        imageid: 1,
        auth_type: 1,
        uid_auth_type: 1,
        work_auth_type: 1,
        tags: 1
      }, null, function (err, designers) {
        callback(err, _.sample(designers, designer_limit));
      });
    },
    llzx_designers: function (callback) {
      Designer.find({
        auth_type: type.designer_auth_type_done,
        tags: '暖暖走心'
      }, {
        username: 1,
        imageid: 1,
        auth_type: 1,
        uid_auth_type: 1,
        work_auth_type: 1,
        tags: 1
      }, null, function (err, designers) {
        callback(err, _.sample(designers, designer_limit));
      });
    },
    top_beautiful_images: function (callback) {
      BeautifulImage.find({
        status: type.beautiful_image_status_public
      }, {
        title: 1,
        house_type: 1,
        section: 1,
        dec_style: 1,
        images: 1
      }, {
        sort: {
          view_count: -1
        },
        skip: 0,
        limit: 50
      }, function (err, beautifulImages) {
        let recs = _.sample(beautifulImages, beautiful_image_limit);
        callback(err, recs);
      });
    },
    top_shares: function (callback) {
      Share.paginate({}, null, {
        sort: {
          lastupdate: -1
        },
        skip: 0,
        limit: share_limit,
        lean: 1
      }, function (err, shares) {
        async.mapLimit(shares, 3, function (share, callback) {
          Designer.findOne({
            _id: share.designerid
          }, {
            _id: 1,
            username: 1,
            imageid: 1
          }, function (err, designer_indb) {
            share.designer = designer_indb;
            callback(err, share);
          });
        }, function (err, results) {
          callback(err, results);
        });
      });
    },
    latest_scenes: function (callback) {
      var latest_scenes = [];
      for (var i = 0; i < latest_scenes_limit; i++) {
        var temp = {};
        temp.username = _.sample(names) + _.sample(sexs);
        temp.house_type = _.sample(house_types);
        var rang = house_areas[temp.house_type];
        temp.house_area = _.random(rang.start, rang.end);
        latest_scenes.push(temp);
      }

      callback(null, latest_scenes);
    },
    dec_strategies: function (callback) {
      DecStrategy.find({
        status: type.article_status_public,
        articletype: type.articletype_dec_strategy
      }, {
        title: 1,
        description: 1,
        cover_imageid: 1,
        articletype: 1
      }, null, function (err, dec_strategies) {
        callback(err, _.sample(dec_strategies, dec_strategies_limit));
      });
    },
    dec_tips: function (callback) {
      DecStrategy.find({
        status: type.article_status_public,
        articletype: type.articletype_dec_tip
      }, {
        title: 1,
        description: 1,
        cover_imageid: 1,
        articletype: 1
      }, null, function (err, dec_tips) {
        callback(err, _.sample(dec_tips, dec_strategies_limit));
      });
    }
  }, ep.done(function (results) {
    res.ejs('page/home', results, req);
  }));
}

var names = ["李", "王", "张", "刘", "陈", "杨", "黄", "赵", "周", "吴", "徐", "孙", "朱",
  "马", "胡", "郭", "林", "何", "高", "梁", "郑", "罗", "宋", "谢", "唐", "韩", "曹", "许",
  "邓", "萧", "冯", "曾", "程", "蔡", "彭", "潘", "袁", "於", "董", "余", "苏", "叶", "吕",
  "魏", "蒋", "田", "杜", "丁", "沈", "姜", "范", "江", "傅", "钟", "卢", "汪", "戴", "崔",
  "任", "陆", "廖", "姚", "方", "金", "邱", "夏", "谭", "韦", "贾", "邹", "石", "熊", "孟",
  "秦", "阎", "薛", "侯", "雷", "白", "龙", "段", "郝", "孔", "邵", "史", "毛", "常", "万",
  "顾", "赖", "武", "康", "贺", "严", "尹", "钱", "施"
];
var sexs = ["先生", "女士"];
var house_types = ["0", "1", "2", "3", "4", "6"]
var house_areas = [{
  start: 40,
  end: 60
}, {
  start: 60,
  end: 95
}, {
  start: 85,
  end: 150
}, {
  start: 130,
  end: 200
}, {
  start: 90,
  end: 170
}, {}, {
  start: 60,
  end: 90
}];
