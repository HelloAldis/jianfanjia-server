'use strict'

const request = require('superagent');
const Designer = require('../../proxy').Designer;
const DecStrategy = require('../../proxy').DecStrategy;
const type = require('../../type');
const async = require('async');

const url = 'http://data.zz.baidu.com/urls?site=www.jianfanjia.com&token=AdJDVvWm7HkKpnHw&type=original';
const designer_url = 'http://www.jianfanjia.com/tpl/designer/'
const strategy_url = 'http://www.jianfanjia.com/tpl/article/strategy/'

async.parallel({
  d: function (callback) {
    Designer.find({
      auth_type: type.designer_auth_type_done,
      authed_product_count: {
        $gte: 3
      }
    }, {
      _id: 1,
    }, null, function (err, designers) {
      let urls = [];
      for (let designer of designers) {
        urls.push(designer_url + designer._id);
      }
      callback(null, urls);
    });
  },
  s: function (callback) {
    DecStrategy.find({
      status: type.article_status_public
    }, {
      _id: 1,
    }, null, function (err, articles) {
      let urls = [];
      for (let article of articles) {
        urls.push(strategy_url + article._id);
      }
      callback(null, urls);
    })
  }
}, function (err, result) {
  let urls = result.d.concat(result.s);

  console.log(urls);
  console.log(`push ${urls.length} url to baidu`);

  request.post(url).send(urls.join('\n')).end(function (err, res) {
    if (err) {
      console.log(err);
    }

    console.log(res.body);
  });
})
