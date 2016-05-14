'use strict'

const Designer = require('../proxy').Designer;
const Plan = require('../proxy').Plan;
const type = require('../type');
const async = require('async');
const logger = require('../common/logger');

const product_count_score = 2;
const team_count_score = 1;
const order_count_score = 3;
const deal_done_count_score = 5;
const service_attitude_score = 3;
const respond_speed_score = 3;

const reject_user_score = -2;
const no_respond_expired_score = -3;
const no_plan_expired_score = -3;

exports.refresh_score = function (designer, callback) {
  const designerid = designer._id;

  async.parallel({
    reject_count: function (callback) {
      Plan.count({
        designerid: designerid,
        status: type.plan_status_designer_reject
      }, callback)
    },
    no_respond_expired_count: function (callback) {
      Plan.count({
        designerid: designerid,
        status: type.plan_status_designer_no_respond_expired,
      }, callback);
    },
    no_plan_expired_count: function (callback) {
      Plan.count({
        designerid: designerid,
        status: type.plan_status_designer_no_plan_expired,
      }, callback);
    }
  }, function (err, result) {
    if (err) {
      logger.error(err);
      callback(err);
      return;
    }

    let score = 0;
    score += designer.authed_product_count * product_count_score;
    score += designer.team_count * team_count_score;
    score += designer.order_count * order_count_score;
    score += designer.deal_done_count * deal_done_count_score;
    score += designer.service_attitude * service_attitude_score;
    score += designer.respond_speed * respond_speed_score;
    score += result.reject_count * reject_user_score;
    score += result.no_respond_expired_count * no_respond_expired_score;
    score += result.no_plan_expired_count * no_plan_expired_score;
    designer.score = score;

    designer.save(function () {
      logger.debug(`save designer ${designer.username} score: ${score}`);
      callback(null);
    });
  });
}

exports.refresh_all_designer_score = function (callback) {
  Designer.count({}, function (err, count) {
    if (err) {
      return logger.error(err);
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
          exports.refresh_score(designer, function () {
            next();
          });
        }
      });
    }, function (err) {
      if (err) {
        logger.error(err);
        if (callback) {
          callback(err);
        }
      } else {
        if (callback) {
          callback(null);
        }
      }
    });
  })
}
