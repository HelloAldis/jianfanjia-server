var type = require('../type');
var UserMessage = require('../proxy').UserMessage;
var DesignerMessage = require('../proxy').DesignerMessage;
var gt = require('../getui/gt.js');
var date_util = require('./date_util');

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
    section: reschedule.section,
    title: 'title',
    content: '设计师' + designer.username + '向您提出了改期, 希望可以将验收改期到' + date_util.YYYY_MM_DD(reschedule.new_date),
    message_type: type.user_message_type_designer_reschedule,
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
    title: 'title',
    content: '业主' + user.username + '向您提出了改期, 希望可以将验收改期到' + date_util.YYYY_MM_DD(reschedule.new_date),
    message_type: type.designer_message_type_user_reschedule,
    status: type.message_status_unread,
  };

  saveDesignerMessageAndPush(designer_message);
}

exports.user_message_type_designer_ok_reschedule = function (user, designer, reschedule) {
  var user_message = {
    userid: user._id,
    designerid: designer._id,
    processid: reschedule.processid,
    section: reschedule.section,
    title: 'title',
    content: '设计师' + designer.username + '同意了您的改期, 验收将改期到' + date_util.YYYY_MM_DD(reschedule.new_date),
    message_type: type.user_message_type_designer_ok_reschedule,
    status: type.message_status_unread,
  };

  saveUserMessageAndPush(user_message);
}

exports.designer_message_type_user_ok_reschedule = function (user, designer, reschedule) {
  var designer_message = {
    userid: user._id,
    designerid: designer._id,
    processid: reschedule.processid,
    section: reschedule.section,
    title: 'title',
    content: '业主' + user.username + '同意了您的改期, 验收将改期到' + date_util.YYYY_MM_DD(reschedule.new_date),
    message_type: type.designer_message_type_user_ok_reschedule,
    status: type.message_status_unread,
  };

  saveDesignerMessageAndPush(designer_message);
}

exports.user_message_type_designer_reject_reschedule = function (user, designer, reschedule) {
  var user_message = {
    userid: user._id,
    designerid: designer._id,
    processid: reschedule.processid,
    section: reschedule.section,
    title: 'title',
    content: '设计师' + designer.username + '拒绝了您的改期, 无法改期到' + date_util.YYYY_MM_DD(reschedule.new_date),
    message_type: type.user_message_type_designer_reject_reschedule,
    status: type.message_status_unread,
  };

  saveUserMessageAndPush(user_message);
}

exports.designer_message_type_user_reject_reschedule = function (user, designer, reschedule) {
  var designer_message = {
    userid: user._id,
    designerid: designer._id,
    processid: reschedule.processid,
    section: reschedule.section,
    title: 'title',
    content: '业主' + user.username + '拒绝了您的改期, 无法改期到' + date_util.YYYY_MM_DD(reschedule.new_date),
    message_type: type.designer_message_type_user_reject_reschedule,
    status: type.message_status_unread,
  };

  saveDesignerMessageAndPush(designer_message);
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
    title: 'title',
    content: '简繁家温馨提示您即将进入下一轮建材购买阶段，您需要购买的是：' + message,
    message_type: type.user_message_type_procurement,
    status: type.message_status_unread,
  };

  saveUserMessageAndPush(user_message);
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
    title: 'title',
    content: '简繁家温馨提示您即将进入下一轮建材购买阶段，您需要购买的是：' + message,
    message_type: type.designer_message_type_procurement,
    status: type.message_status_unread,
  };

  saveDesignerMessageAndPush(designer_message);
}

exports.user_message_type_pay = function (process, section) {
  var user_message = {
    userid: process.userid,
    designerid: process.final_designerid,
    processid: process._id,
    section: section,
    title: 'title',
    content: '您即将进入下一轮付款环节，简繁家工作人员将会和您联系',
    message_type: type.user_message_type_pay,
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
    title: 'title',
    content: '设计师已经上传所有验收图片，您可以前往对比验收',
    message_type: type.user_message_type_ys,
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
    title: 'title',
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
    title: 'title',
    content: comment.content,
    message_type: type.user_message_type_comment_process_item,
    status: type.message_status_unread,
  };

  saveUserMessageAndPush(user_message);
}

exports.designer_message_type_comment_plan = function (comment) {
  var designer_message = {
    userid: comment.by,
    designerid: comment.to,
    topicid: comment.topicid,
    commentid: comment._id,
    title: 'title',
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
    title: 'title',
    content: comment.content,
    message_type: type.designer_message_type_comment_process_item,
    status: type.message_status_unread,
  }

  saveDesignerMessageAndPush(designer_message);
}

exports.user_message_type_designer_respond = function (user, designer, plan) {
  var user_message = {
    userid: user._id,
    designerid: designer._id,
    planid: plan._id,
    requirementid: plan.requirementid,
    title: 'title',
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
    title: 'title',
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
    title: 'title',
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
    title: 'title',
    content: designer.username + '已经配置了合同',
    message_type: type.user_message_type_designer_config_contract,
    status: type.message_status_unread,
  };

  saveUserMessageAndPush(user_message);
}



/*
var DesignerMessageSchema = new Schema({
  designerid: {
    type: ObjectId
  },
  processid: {
    type: ObjectId
  },
  section: {
    type: String,
  },
  item: {
    type: String,
  },
  title: {
    type: String
  },
  content: {
    type: String
  },
  message_type: {
    type: String
  },
  create_at: {
    type: Number,
  },
  lastupdate: {
    type: Number,
  },
  status: {
    type: String,
  }
});

var UserMessageSchema = new Schema({
  userid: {
    type: ObjectId
  },
  processid: {
    type: ObjectId
  },
  section: {
    type: String,
  },
  item: {
    type: String,
  },
  title: {
    type: String
  },
  content: {
    type: String
  },
  message_type: {
    type: String
  },
  create_at: {
    type: Number,
  },
  lastupdate: {
    type: Number,
  },
  status: {
    type: String,
  }
});
*/
