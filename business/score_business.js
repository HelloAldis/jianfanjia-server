'use strict'

const Designer = require('../proxy').Designer;
const Plan = require('../proxy').Plan;
const type = require('../type');
const async = require('async');
const logger = require('../common/logger');

const product_count_score = 3;
const team_count_score = 1;
const order_count_score = 1;

//接单满分
const deal_done_count_score = 40;

const service_attitude_score = 1;
const respond_speed_score = 1;

//认证的分数
const basic_auth_score = 40;
const uid_auth_score = 5;
const work_auth_score = 10;
const email_auth_score = 5;

const new_designer_duration = 50;
const new_designer_score = 90;

const reject_user_score = -10;
const no_respond_expired_score = -5;
const no_plan_expired_score = -5;

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
    score += ((designer.deal_done_count || 0) / (designer.order_count || 1)) * deal_done_count_score;
    score += designer.service_attitude * service_attitude_score;
    score += designer.respond_speed * respond_speed_score;
    score += designer.auth_type === type.designer_auth_type_done ? basic_auth_score : 0;
    score += designer.uid_auth_type === type.designer_auth_type_done ? uid_auth_score : 0;
    score += designer.work_auth_type === type.designer_auth_type_done ? work_auth_score : 0;
    score += designer.email_auth_type === type.designer_auth_type_done ? email_auth_score : 0;
    let duration = 1000 * 60 * 60 * 24 * new_designer_duration;
    let day60Before = new Date().getTime() - duration;
    let diff = designer.create_at - day60Before;
    diff = diff < 0 ? 0 : diff;
    score += (diff / duration) * new_designer_score;

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
