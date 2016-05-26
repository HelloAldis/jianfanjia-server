'use strict'

const request = require('superagent');
const type = require('../type');
const logger = require('../common/logger');
const config = require('../apiconfig');

const baidu_url = 'http://data.zz.baidu.com/urls?site=www.jianfanjia.com&token=AdJDVvWm7HkKpnHw&type=original';
const designer_url = 'http://www.jianfanjia.com/tpl/designer/';
const strategy_url = 'http://www.jianfanjia.com/tpl/article/strategy/';
const product_url = 'http://www.jianfanjia.com/tpl/product/';

exports.push_product_url = function (productid) {
  pus_url_baidu(product_url + productid);
}

exports.push_designer_url = function (designerid) {
  pus_url_baidu(designer_url + designerid);
}

exports.push_strategy_url = function (id) {
  pus_url_baidu(strategy_url + id);
}

function pus_url_baidu(url) {
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
