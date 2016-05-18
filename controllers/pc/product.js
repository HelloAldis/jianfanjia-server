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

exports.product_page = function (req, res, next) {
  const _id = ApiUtil.getUserid(req);
  const usertype = ApiUtil.getUsertype(req);
  const productid = req.params.productid;
  const ep = eventproxy();
  ep.fail(next);

  async.parallel({
    header_info: function (callback) {
      pc_web_header.statistic_info(_id, usertype, callback);
    },
    product: function (callback) {
      Product.findOne({
        _id: productid,
        auth_type: type.product_auth_type_done,
      }, null, callback);
    },
    is_my_favorite: function (callback) {
      favorite_business.is_favorite_product(_id, usertype, productid, callback);
    }
  }, ep.done(function (results) {
    if (results.product) {
      async.parallel({
        designer: function (callback) {
          Designer.findOne({
            _id: results.product.designerid
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
        is_my_favorite: function (callback) {
          favorite_business.is_favorite_designer(_id, usertype, results.product.designerid, callback);
        }
      }, ep.done(function (temp) {
        results.product = results.product.toObject();
        results.product.is_my_favorite = results.is_my_favorite;
        delete results.is_my_favorite;
        results.designer = temp.designer.toObject();
        results.designer.is_my_favorite = temp.is_my_favorite;
        res.ejs('page/product', results, req);
      }));

      limit.perwhatperdaydo('productgetone', req.ip + productid, 1, function () {
        Product.incOne({
          _id: productid
        }, {
          view_count: 1
        });
      });
    } else {
      next();
    }
  }));
}
