'use strict'

const request = require('superagent');
const logger = require('lib/common/logger');
const config = require('lib/config/apiconfig');

const baidu_url = 'http://data.zz.baidu.com/urls?site=www.jianfanjia.com&token=AdJDVvWm7HkKpnHw&type=original';
const designer_url = 'http://www.jianfanjia.com/tpl/designer/';
const strategy_url = 'http://www.jianfanjia.com/tpl/article/strategy/';
const product_url = 'http://www.jianfanjia.com/tpl/product/';
const diary_set_url = 'http://www.jianfanjia.com/tpl/diary/book/';

exports.push_product_url = function (productid) {
  push_url_baidu(product_url + productid);
}

exports.push_designer_url = function (designerid) {
  push_url_baidu(designer_url + designerid);
}

exports.push_strategy_url = function (id) {
  push_url_baidu(strategy_url + id);
}

exports.push_diary_set_url = function (id) {
  push_url_baidu(diary_set_url + id);
}

function push_url_baidu(url) {
  logger.debug(`push ${url} to baidu`);
  if (config.is_push_url) {
    request.post(baidu_url).send(url).end(function (err, res) {
      if (err) {
        logger.error(err);
      }

      logger.debug(res.body);
    });
  }
}
