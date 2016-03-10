var type = require('../type');
var UserMessage = require('../proxy').UserMessage;
var DesignerMessage = require('../proxy').DesignerMessage;
var gt = require('../getui/gt.js');
var date_util = require('./date_util');
var _ = require('lodash');

function saveDesignerMessageAndPush(designer_message) {
  DesignerMessage.newAndSave(designer_message, function (err, designer_message_indb) {
    if (designer_message_indb) {
      DesignerMessage.count({
        designerid: designer_message_indb.designerid,
        status: type.message_status_unread,
      }, function (err, count) {
        var payload = gt.buildPayloadFromDesignerMessage(designer_message_indb);
        payload.badge = count;
        gt.pushMessageToDesigner(designer_message_indb.designerid, payload);
      });
    }
  });
}

function saveUserMessageAndPush(user_message) {
  UserMessage.newAndSave(user_message, function (err, user_message_indb) {
    if (user_message_indb) {
      UserMessage.count({
        designerid: user_message_indb.userid,
        status: type.message_status_unread,
      }, function (err, count) {
        var payload = gt.buildPayloadFromUserMessage(user_message_indb);
        payload.badge = count;
        gt.pushMessageToUser(user_message_indb.userid, payload);
      });
    }
  });
}


exports.user_message_type_designer_reschedule = function (user, designer, reschedule) {
  var user_message = {
    userid: user._id,
    designerid: designer._id,
    processid: reschedule.processid,
    rescheduleid: reschedule._id,
    section: reschedule.section,
    title: '改期提醒',
    content: '设计师' + designer.username + '向您提出了改期, 希望可以将验收改期到' + date_util.YYYY_MM_DD(reschedule.new_date),
    message_type: type.user_message_type_designer_reschedule,
    status: type.message_status_unread,
  };

  saveUserMessageAndPush(user_message);
}

exports.user_message_type_designer_ok_reschedule = function (user, designer, reschedule) {
  var user_message = {
    userid: user._id,
    designerid: designer._id,
    processid: reschedule.processid,
    section: reschedule.section,
    title: '改期提醒',
    content: '设计师' + designer.username + '同意了您的改期, 验收将改期到' + date_util.YYYY_MM_DD(reschedule.new_date),
    message_type: type.user_message_type_designer_ok_reschedule,
    status: type.message_status_unread,
  };

  saveUserMessageAndPush(user_message);
}

exports.user_message_type_designer_reject_reschedule = function (user, designer, reschedule) {
  var user_message = {
    userid: user._id,
    designerid: designer._id,
    processid: reschedule.processid,
    section: reschedule.section,
    title: '改期提醒',
    content: '设计师' + designer.username + '拒绝了您的改期, 无法改期到' + date_util.YYYY_MM_DD(reschedule.new_date),
    message_type: type.user_message_type_designer_reject_reschedule,
    status: type.message_status_unread,
  };

  saveUserMessageAndPush(user_message);
}

exports.user_message_type_procurement = function (process, section) {
  var index = _.indexOf(type.process_work_flow, section);
  var message = type.procurement_notification_message[index];
  var next = type.process_work_flow[index + 1];

  var user_message = {
    userid: process.userid,
    designerid: process.final_designerid,
    processid: process._id,
    section: next,
    title: '采购提醒',
    content: '简繁家温馨提示您即将进入下一轮建材购买阶段，您需要购买的是：' + message,
    message_type: type.user_message_type_procurement,
    status: type.message_status_unread,
  };

  saveUserMessageAndPush(user_message);
}

exports.user_message_type_pay = function (process, section) {
  var user_message = {
    userid: process.userid,
    designerid: process.final_designerid,
    processid: process._id,
    section: section,
    title: '付款提醒',
    content: '您即将进入下一轮付款环节，简繁家工作人员将会和您联系',
    message_type: type.user_message_type_pay,
    status: type.message_status_unread,
  };

  saveUserMessageAndPush(user_message);
}

exports.user_message_type_comment_plan = function (comment) {
  var user_message = {
    userid: comment.to,
    designerid: comment.by,
    topicid: comment.topicid,
    commentid: comment._id,
    title: '方案留言',
    content: comment.content,
    message_type: type.user_message_type_comment_plan,
    status: type.message_status_unread,
  };

  saveUserMessageAndPush(user_message);
}

exports.user_message_type_comment_process_item = function (comment) {
  var user_message = {
    userid: comment.to,
    designerid: comment.by,
    topicid: comment.topicid,
    commentid: comment._id,
    section: comment.section,
    item: comment.item,
    title: '工地留言',
    content: comment.content,
    message_type: type.user_message_type_comment_process_item,
    status: type.message_status_unread,
  };

  saveUserMessageAndPush(user_message);
}

exports.user_message_type_designer_respond = function (user, designer, plan) {
  var user_message = {
    userid: user._id,
    designerid: designer._id,
    planid: plan._id,
    requirementid: plan.requirementid,
    title: '需求提醒',
    content: designer.username + '已响应您的预约请求',
    message_type: type.user_message_type_designer_respond,
    status: type.message_status_unread,
  };

  saveUserMessageAndPush(user_message);
}

exports.user_message_type_designer_reject = function (user, designer, plan) {
  var user_message = {
    userid: user._id,
    designerid: designer._id,
    planid: plan._id,
    requirementid: plan.requirementid,
    title: '需求提醒',
    content: designer.username + '已拒绝您的预约请求',
    message_type: type.user_message_type_designer_reject,
    status: type.message_status_unread,
  };

  saveUserMessageAndPush(user_message);
}

exports.user_message_type_designer_upload_plan = function (user, designer, plan) {
  var user_message = {
    userid: user._id,
    designerid: designer._id,
    planid: plan._id,
    requirementid: plan.requirementid,
    title: '需求提醒',
    content: designer.username + '已上传了新方案',
    message_type: type.user_message_type_designer_upload_plan,
    status: type.message_status_unread,
  };

  saveUserMessageAndPush(user_message);
}

exports.user_message_type_designer_config_contract = function (user, designer, requirement) {
  var user_message = {
    userid: user._id,
    designerid: designer._id,
    planid: requirement.final_planid,
    requirementid: requirement._id,
    title: '需求提醒',
    content: designer.username + '已经配置了合同',
    message_type: type.user_message_type_designer_config_contract,
    status: type.message_status_unread,
  };

  saveUserMessageAndPush(user_message);
}

exports.user_message_type_ys = function (process, section) {
  var user_message = {
    userid: process.userid,
    designerid: process.final_designerid,
    processid: process._id,
    section: section,
    title: '验收提醒',
    content: '设计师已经上传所有验收图片，您可以前往对比验收',
    message_type: type.user_message_type_ys,
    status: type.message_status_unread,
  };

  saveUserMessageAndPush(user_message);
}

exports.user_message_type_designer_remind_ok_house_checked = function (user, designer, requirement) {
  var user_message = {
    userid: user._id,
    designerid: designer._id,
    requirementid: requirement._id,
    title: '需求提醒',
    content: '设计师提醒您及时确认量房',
    message_type: type.user_message_type_designer_remind_ok_house_checked,
    status: type.message_status_unread,
  };

  saveUserMessageAndPush(user_message);
}

exports.designer_message_type_user_reschedule = function (user, designer, reschedule) {
  var designer_message = {
    userid: user._id,
    designerid: designer._id,
    processid: reschedule.processid,
    section: reschedule.section,
    title: '改期提醒',
    content: '业主' + user.username + '向您提出了改期, 希望可以将验收改期到' + date_util.YYYY_MM_DD(reschedule.new_date),
    message_type: type.designer_message_type_user_reschedule,
    status: type.message_status_unread,
  };

  saveDesignerMessageAndPush(designer_message);
}

exports.designer_message_type_user_ok_reschedule = function (user, designer, reschedule) {
  var designer_message = {
    userid: user._id,
    designerid: designer._id,
    processid: reschedule.processid,
    section: reschedule.section,
    title: '改期提醒',
    content: '业主' + user.username + '同意了您的改期, 验收将改期到' + date_util.YYYY_MM_DD(reschedule.new_date),
    message_type: type.designer_message_type_user_ok_reschedule,
    status: type.message_status_unread,
  };

  saveDesignerMessageAndPush(designer_message);
}

exports.designer_message_type_user_reject_reschedule = function (user, designer, reschedule) {
  var designer_message = {
    userid: user._id,
    designerid: designer._id,
    processid: reschedule.processid,
    section: reschedule.section,
    title: '改期提醒',
    content: '业主' + user.username + '拒绝了您的改期, 无法改期到' + date_util.YYYY_MM_DD(reschedule.new_date),
    message_type: type.designer_message_type_user_reject_reschedule,
    status: type.message_status_unread,
  };

  saveDesignerMessageAndPush(designer_message);
}

exports.designer_message_type_procurement = function (process, section) {
  var index = _.indexOf(type.process_work_flow, section);
  var message = type.procurement_notification_message[index];
  var next = type.process_work_flow[index + 1];

  var designer_message = {
    userid: process.userid,
    designerid: process.final_designerid,
    processid: process._id,
    section: next,
    title: '采购提醒',
    content: '简繁家温馨提示您即将进入下一轮建材购买阶段，您需要购买的是：' + message,
    message_type: type.designer_message_type_procurement,
    status: type.message_status_unread,
  };

  saveDesignerMessageAndPush(designer_message);
}

exports.designer_message_type_comment_plan = function (comment) {
  var designer_message = {
    userid: comment.by,
    designerid: comment.to,
    topicid: comment.topicid,
    commentid: comment._id,
    title: '方案留言',
    content: comment.content,
    message_type: type.designer_message_type_comment_plan,
    status: type.message_status_unread,
  }

  saveDesignerMessageAndPush(designer_message);
}

exports.designer_message_type_comment_process_item = function (comment) {
  var designer_message = {
    userid: comment.by,
    designerid: comment.to,
    topicid: comment.topicid,
    commentid: comment._id,
    section: comment.section,
    item: comment.item,
    title: '工地留言',
    content: comment.content,
    message_type: type.designer_message_type_comment_process_item,
    status: type.message_status_unread,
  }

  saveDesignerMessageAndPush(designer_message);
}

exports.designer_message_type_basic_auth_done = function (designer) {
  var designer_message = {
    designerid: designer._id,
    title: '系统通知',
    content: "设计师" + designer.username + "您的设计师基本信息已通过，请进一步完善个人作品",
    message_type: type.designer_message_type_basic_auth_done,
    status: type.message_status_unread,
  }

  saveDesignerMessageAndPush(designer_message);
}

exports.designer_message_type_basic_auth_reject = function (designer, auth_message) {
  var designer_message = {
    designerid: designer._id,
    title: '系统通知',
    content: "设计师" + designer.username + "您的设计师基本信息认证未通过，请及时更正后再次提交认证",
    message_type: type.designer_message_type_basic_auth_reject,
    status: type.message_status_unread,
  }

  saveDesignerMessageAndPush(designer_message);
}

exports.designer_message_type_uid_auth_done = function (designer) {
  var designer_message = {
    designerid: designer._id,
    title: '系统通知',
    content: "设计师" + designer.username + "您的设计师身份和银行卡认证已通过",
    message_type: type.designer_message_type_uid_auth_done,
    status: type.message_status_unread,
  }

  saveDesignerMessageAndPush(designer_message);
}

exports.designer_message_type_uid_auth_reject = function (designer) {
  var designer_message = {
    designerid: designer._id,
    title: '系统通知',
    content: "设计师" + designer.username + "您的设计师身份和银行卡认证未通过",
    message_type: type.designer_message_type_uid_auth_reject,
    status: type.message_status_unread,
  }

  saveDesignerMessageAndPush(designer_message);
}

exports.designer_message_type_work_auth_done = function (designer) {
  var designer_message = {
    designerid: designer._id,
    title: '系统通知',
    content: "设计师" + designer.username + "您的设计师工地信息认证已通过",
    message_type: type.designer_message_type_work_auth_done,
    status: type.message_status_unread,
  }

  saveDesignerMessageAndPush(designer_message);
}

exports.designer_message_type_work_auth_reject = function (designer) {
  var designer_message = {
    designerid: designer._id,
    title: '系统通知',
    content: "设计师" + designer.username + "您的设计师工地信息认证未通过",
    message_type: type.designer_message_type_work_auth_reject,
    status: type.message_status_unread,
  }

  saveDesignerMessageAndPush(designer_message);
}

exports.designer_message_type_product_auth_done = function (designer, product) {
  var designer_message = {
    designerid: designer._id,
    title: '系统通知',
    content: "设计师" + designer.username + "您的案例认证通过",
    message_type: type.designer_message_type_product_auth_done,
    status: type.message_status_unread,
  }

  saveDesignerMessageAndPush(designer_message);
}

exports.designer_message_type_product_auth_reject = function (designer, product) {
  var designer_message = {
    designerid: designer._id,
    title: '系统通知',
    content: "设计师" + designer.username + "您的案例认证未通过",
    message_type: type.designer_message_type_product_auth_reject,
    status: type.message_status_unread,
  }

  saveDesignerMessageAndPush(designer_message);
}

exports.designer_message_type_product_auth_illegal = function (designer, product) {
  var designer_message = {
    designerid: designer._id,
    title: '系统通知',
    content: "设计师" + designer.username + "您的案例因为违规被下线了",
    message_type: type.designer_message_type_product_auth_illegal,
    status: type.message_status_unread,
  }

  saveDesignerMessageAndPush(designer_message);
}

exports.designer_message_type_user_order = function (user, designer, requirement) {
  var designer_message = {
    userid: user._id,
    designerid: designer._id,
    title: '预约提醒',
    content: "业主" + user.username + "预约了装修，请您及时响应",
    message_type: type.designer_message_type_user_order,
    status: type.message_status_unread,
  }

  saveDesignerMessageAndPush(designer_message);
}

exports.designer_message_type_user_ok_house_checked = function (user, designer, requirement) {
  var designer_message = {
    userid: user._id,
    designerid: designer._id,
    title: '量房提醒',
    content: "业主确认您已量完房，请您5天内上传方案",
    message_type: type.designer_message_type_user_ok_house_checked,
    status: type.message_status_unread,
  }

  saveDesignerMessageAndPush(designer_message);
}

exports.designer_message_type_user_unfinal_plan = function (user, designer, plan) {
  var designer_message = {
    userid: user._id,
    designerid: designer._id,
    title: '丢标提醒',
    content: "您的方案没有中标，木有关系下次继续努力",
    message_type: type.designer_message_type_user_unfinal_plan,
    status: type.message_status_unread,
  }

  saveDesignerMessageAndPush(designer_message);
}

exports.designer_message_type_user_final_plan = function (user, designer, plan) {
  var designer_message = {
    userid: user._id,
    designerid: designer._id,
    title: '中标提醒',
    content: "恭喜您的方案被业主选中，请及时的和业主共同设定开工时间",
    message_type: type.designer_message_type_user_final_plan,
    status: type.message_status_unread,
  }

  saveDesignerMessageAndPush(designer_message);
}

exports.designer_message_type_user_ok_contract = function (requirement) {
  var designer_message = {
    userid: requirement.userid,
    designerid: requirement.final_designerid,
    title: '合同提醒',
    content: "业主已经确认了合同，请您做好装修准备",
    message_type: type.designer_message_type_user_ok_contract,
    status: type.message_status_unread,
  }

  saveDesignerMessageAndPush(designer_message);
}
