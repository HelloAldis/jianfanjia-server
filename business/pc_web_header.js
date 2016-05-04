'use strict'

const Plan = require('../proxy').Plan;
const Favorite = require('../proxy').Favorite;
const DesignerMessage = require('../proxy').DesignerMessage;
const Designer = require('../proxy').Designer;
const Requirement = require('../proxy').Requirement;
const UserMessage = require('../proxy').UserMessage;
const User = require('../proxy').User;
const type = require('../type');
const async = require('async');

function designer_statistic_info(_id, callback) {
  async.parallel({
    requirement_count: function (callback) {
      Plan.find({
        designerid: _id,
        status: {
          $in: [type.plan_status_not_respond, type.plan_status_designer_respond_no_housecheck,
            type.plan_status_designer_housecheck_no_plan, type.plan_status_designer_upload,
            type.plan_status_user_final
          ],
        },
      }, {
        requirementid: 1
      }, null, function (err, plans) {
        let count = 0;
        if (plans && plans.length > 0) {
          plans = _.uniq(plans, function (p) {
            return p.requirementid.toString();
          });
          count = plans.length;
        }

        callback(err, count);
      });
    },
    favorite: function (callback) {
      Favorite.findOne({
        userid: _id,
      }, callback);
    },
    comment_message_count: function (callback) {
      DesignerMessage.count({
        designerid: _id,
        status: type.message_status_unread,
        message_type: {
          $in: [type.designer_message_type_comment_plan, type.designer_message_type_comment_process_item]
        }
      }, callback);
    },
    requirement_message_count: function (callback) {
      DesignerMessage.count({
        designerid: _id,
        status: type.message_status_unread,
        message_type: {
          $in: [type.designer_message_type_user_order, type.designer_message_type_user_ok_house_checked, type.designer_message_type_user_final_plan,
            type.designer_message_type_user_unfinal_plan, type.designer_message_type_user_ok_contract
          ]
        }
      }, callback);
    },
    platform_message_count: function (callback) {
      DesignerMessage.count({
        designerid: _id,
        status: type.message_status_unread,
        message_type: {
          $in: [type.designer_message_type_platform_notification, type.designer_message_type_basic_auth_done, type.designer_message_type_basic_auth_reject,
            type.designer_message_type_uid_auth_done, type.designer_message_type_uid_auth_reject, type.designer_message_type_work_auth_done,
            type.designer_message_type_work_auth_reject, type.designer_message_type_product_auth_done, type.designer_message_type_product_auth_reject,
            type.designer_message_type_product_auth_illegal
          ]
        }
      }, callback);
    },
    designer: function (callback) {
      Designer.findOne({
        _id: _id,
      }, {
        username: 1,
        imageid: 1,
        product_count: 1,
      }, callback);
    },
  }, function (err, result) {
    if (err) {
      callback(err);
      return;
    }

    let favorite_product_count = 0;
    if (result.favorite && result.favorite.favorite_product) {
      favorite_product_count = result.favorite.favorite_product.length;
    }

    callback(null, {
      username: result.designer.username,
      imageid: result.designer.imageid,
      product_count: result.designer.product_count,
      requirement_count: result.requirement_count,
      favorite_product_count: favorite_product_count,
      platform_message_count: result.platform_message_count,
      requirement_message_count: result.requirement_message_count,
      comment_message_count: result.comment_message_count,
    });
  });
}

function user_statistic_info(_id, callback) {
  async.parallel({
    requirement_count: function (callback) {
      Requirement.count({
        userid: _id,
      }, callback);
    },
    favorite: function (callback) {
      Favorite.findOne({
        userid: _id,
      }, callback);
    },
    comment_message_count: function (callback) {
      UserMessage.count({
        userid: _id,
        status: type.message_status_unread,
        message_type: {
          $in: [type.user_message_type_comment_plan, type.user_message_type_comment_process_item]
        }
      }, callback);
    },
    requirement_message_count: function (callback) {
      UserMessage.count({
        userid: _id,
        status: type.message_status_unread,
        message_type: {
          $in: [type.user_message_type_designer_respond, type.user_message_type_designer_reject, type.user_message_type_designer_upload_plan,
            type.user_message_type_designer_config_contract, type.user_message_type_designer_remind_ok_house_checked
          ]
        }
      }, callback);
    },
    platform_message_count: function (callback) {
      UserMessage.count({
        userid: _id,
        status: type.message_status_unread,
        message_type: {
          $in: [type.user_message_type_platform_notification]
        }
      }, callback);
    },
    user: function (callback) {
      User.findOne({
        _id: _id,
      }, {
        username: 1,
        imageid: 1,
      }, callback);
    },
  }, function (err, result) {
    if (err) {
      callback(err);
      return;
    }

    let favorite_product_count = 0;
    let favorite_designer_count = 0;
    if (result.favorite) {
      if (result.favorite.favorite_product) {
        favorite_product_count = result.favorite.favorite_product.length;
      }

      if (result.favorite.favorite_designer) {
        favorite_designer_count = result.favorite.favorite_designer.length;
      }
    }

    callback(null, {
      username: result.user.username,
      imageid: result.user.imageid,
      requirement_count: result.requirement_count,
      favorite_product_count: favorite_product_count,
      favorite_designer_count: favorite_designer_count,
      platform_message_count: result.platform_message_count,
      requirement_message_count: result.requirement_message_count,
      comment_message_count: result.comment_message_count,
    });
  });
}

exports.statistic_info = function (_id, usertype, callback) {

  if (usertype === type.role_user) {
    user_statistic_info(_id, function (err, user_statistic_info) {
      callback(err, {
        user_statistic_info: user_statistic_info
      });
    });
  } else if (usertype === type.role_designer) {
    designer_statistic_info(_id, function (err, designer_statistic_info) {
      callback(err, {
        designer_statistic_info: designer_statistic_info
      });
    });
  } else {
    callback(null, {});
  }
}
