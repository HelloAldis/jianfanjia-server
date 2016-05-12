'use strict'

const eventproxy = require('eventproxy');
const pc_web_header = require('../../business/pc_web_header');
const favorite_business = require('../../business/favorite_business');
const _ = require('lodash');
const async = require('async');
const type = require('../../type');
const ApiUtil = require('../../common/api_util');
const Designer = require('../../proxy').Designer;
const Product = require('../../proxy').Product;
const limit = require('../../middlewares/limit')

exports.designer_page = function (req, res, next) {
  const _id = ApiUtil.getUserid(req);
  const usertype = ApiUtil.getUsertype(req);
  const designerid = req.params.designerid;
  const ep = eventproxy();
  ep.fail(next);

  async.parallel({
    header_info: function (callback) {
      pc_web_header.statistic_info(_id, usertype, callback);
    },
    designer: function (callback) {
      Designer.findOne({
        _id: designerid
      }, {
        pass: 0,
        accessToken: 0,
        uid: 0,
        phone: 0,
        email: 0,
        bank: 0,
        bank_card: 0,
      }, callback);
    },
    products: function (callback) {
      Product.find({
        designerid: designerid,
        auth_type: type.product_auth_type_done,
      }, null, {
        lean: true
      }, callback);
    },
    is_my_favorite: function (callback) {
      favorite_business.is_favorite_designer(_id, usertype, designerid, callback);
    }
  }, ep.done(function (results) {
    if (results.designer) {
      results.designer.is_my_favorite = results.is_my_favorite;
      if (results.designer.tags.indexOf('匠心定制') > -1) {
        res.ejs('page/jxdz_designer', results, req);
      } else {
        res.ejs('page/other_designer', results, req);
      }

      limit.perwhatperdaydo('designergetone', req.ip + designerid, 1,
        function () {
          Designer.incOne({
            _id: designerid
          }, {
            view_count: 1
          }, {});
        });
    } else {
      next();
    }
  }));
}
