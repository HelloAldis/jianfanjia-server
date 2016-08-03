'use strict'

const eventproxy = require('eventproxy');
const pc_web_header = require('lib/business/pc_web_header');
const favorite_business = require('lib/business/favorite_business');
const async = require('async');
const type = require('lib/type/type');
const ApiUtil = require('lib/common/api_util');
const Designer = require('lib/proxy').Designer;
const Product = require('lib/proxy').Product;
const limit = require('lib/middlewares/limit')
const user_habit_collect = require('lib/business/user_habit_collect');
const tools = require('lib/common/tools');

exports.designer_page = function (req, res, next) {
  const userid = ApiUtil.getUserid(req);
  const usertype = ApiUtil.getUsertype(req);
  const designerid = req.params.designerid;
  const ep = eventproxy();
  ep.fail(next);

  if (!tools.isValidObjectId(designerid)) {
    return next();
  }

  async.parallel({
    header_info: function (callback) {
      pc_web_header.statistic_info(userid, usertype, callback);
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
        sort: {
          create_at: -1
        },
        lean: true
      }, callback);
    },
    is_my_favorite: function (callback) {
      favorite_business.is_favorite_designer(userid, usertype, designerid, callback);
    }
  }, ep.done(function (results) {
    if (results.designer) {
      results.designer.is_my_favorite = results.is_my_favorite;
      res.ejs('page/jxdz_designer', results, req);

      limit.perwhatperdaydo('designergetone', req.ip + designerid, 1, function () {
        Designer.incOne({
          _id: designerid
        }, {
          view_count: 1
        }, {});
      });

      user_habit_collect.add_designer_history(userid, usertype, designerid);
    } else {
      next();
    }
  }));
}

exports.designer_my_homepage = function (req, res, next) {
  const designerid = ApiUtil.getUserid(req);
  const usertype = ApiUtil.getUsertype(req);
  const ep = eventproxy();
  ep.fail(next);

  async.parallel({
    header_info: function (callback) {
      pc_web_header.statistic_info(designerid, usertype, callback);
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
        designerid: designerid
      }, null, {
        sort: {
          create_at: -1
        },
        lean: true
      }, callback);
    }
  }, ep.done(function (results) {
    if (results.designer) {
      res.ejs('page/other_designer', results, req);
    } else {
      next();
    }
  }));
}
