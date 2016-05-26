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
const Image = require('../../proxy').Image;
const limit = require('../../middlewares/limit')
const user_habit_collect = require('../../business/user_habit_collect');
const tools = require('../../common/tools');

exports.product_page = function (req, res, next) {
  const userid = ApiUtil.getUserid(req);
  const usertype = ApiUtil.getUsertype(req);
  const productid = req.params.productid;
  const ep = eventproxy();
  ep.fail(next);

  if (!tools.isValidObjectId(productid)) {
    return next();
  }

  async.parallel({
    header_info: function (callback) {
      pc_web_header.statistic_info(userid, usertype, callback);
    },
    product: function (callback) {
      if (usertype === type.role_user) {
        Product.findOne({
          _id: productid,
          auth_type: type.product_auth_type_done,
        }, null, callback);
      } else {
        Product.findOne({
          _id: productid
        }, null, callback);
      }
    },
    is_my_favorite: function (callback) {
      favorite_business.is_favorite_product(userid, usertype, productid, callback);
    }
  }, ep.done(function (results) {
    if (results.product) {
      results.product = results.product.toObject();
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
          favorite_business.is_favorite_designer(userid, usertype, results.product.designerid, callback);
        },
        fill_images_size: function (callback) {
          async.mapLimit(results.product.images, 3, function (image, callback) {
            Image.findOne({
              _id: image.imageid
            }, {
              width: 1,
              height: 1,
            }, function (err, image_size) {
              image.width = image_size.width;
              image.height = image_size.height;
              callback(err, image);
            });
          }, callback)
        },
        fill_plan_images_size: function (callback) {
          async.mapLimit(results.product.plan_images, 3, function (image, callback) {
            Image.findOne({
              _id: image.imageid
            }, {
              width: 1,
              height: 1,
            }, function (err, image_size) {
              image.width = image_size.width;
              image.height = image_size.height;
              callback(err, image);
            });
          }, callback)
        },
      }, ep.done(function (temp) {
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

      user_habit_collect.add_product_history(userid, usertype, productid);
    } else {
      next();
    }
  }));
}
