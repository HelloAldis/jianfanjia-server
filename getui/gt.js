var config = require('../apiconfig');
var GeTui = require('./GT.push');
var TransmissionTemplate = require('./template/TransmissionTemplate');
var SingleMessage = require('./message/SingleMessage');
var Target = require('./Target');
var APNPayload = require('./payload/APNPayload');
var SimpleAlertMsg = require('./payload/SimpleAlertMsg');
var RequestError = require('./RequestError');

var gt_user = new GeTui(config.gt_user_HOST, config.gt_user_APPKEY, config.gt_user_MASTERSECRET);
var gt_designer = new GeTui(config.gt_user_HOST, config.gt_designer_APPKEY,
  config.gt_designer_MASTERSECRET);

exports.aliasBind = function (userid, cid) {
  userid = userid.toString();
  gt.bindAlias(config.gt_user_APPID, userid, cid, function (err, res) {
    console.log('err = ' + err);
    console.log(res);
  });
}

exports.pushMessageToSingle = function (userid, playload) {
  userid = userid.toString();

  var payload = new APNPayload();
  var alertMsg = new SimpleAlertMsg();
  alertMsg.alertMsg = playload.content;
  payload.alertMsg = alertMsg;
  payload.badge = 1;
  payload.contentAvailable = 1;
  payload.category = "ACTION 1";
  // payload.sound = "test1.wav";
  payload.customMsg.payload1 = JSON.stringify(playload);

  var template = new TransmissionTemplate({
    appId: config.gt_user_APPID,
    appKey: config.gt_user_APPKEY,
    transmissionType: 2,
    transmissionContent: JSON.stringify(playload),
  });
  template.setApnInfo(payload);

  var message = new SingleMessage({
    isOffline: true, //是否离线
    offlineExpireTime: 3600 * 48 * 1000, //离线时间
    data: template, //设置推送消息类型
  });

  //接收方
  var target = new Target({
    appId: config.gt_user_APPID,
    alias: userid,
  });

  console.log('userid = ' + userid);
  console.log(playload);

  gt_user.pushMessageToSingle(message, target, function (err, res) {
    console.log('push err = ' + err);
    console.log(res);
    if (err != null && err.exception != null && err.exception instanceof RequestError) {
      var requestId = err.exception.requestId;
      console.log(err.exception.requestId);
      gt_user.pushMessageToSingle(message, target, requestId, function (
        err, res) {
        console.log(err);
        console.log(res);
      });
    }
  });
}

function buildMessage(appid, appkey, playload) {
  var payload = new APNPayload();
  var alertMsg = new SimpleAlertMsg();
  alertMsg.alertMsg = playload.content;
  payload.alertMsg = alertMsg;
  payload.badge = 1;
  payload.contentAvailable = 1;
  payload.category = "ACTION 1";
  // payload.sound = "test1.wav";
  payload.customMsg.payload1 = JSON.stringify(playload);

  var template = new TransmissionTemplate({
    appId: appid,
    appKey: appkey,
    transmissionType: 2,
    transmissionContent: JSON.stringify(playload),
  });
  template.setApnInfo(payload);

  var message = new SingleMessage({
    isOffline: true, //是否离线
    offlineExpireTime: 3600 * 48 * 1000, //离线时间
    data: template, //设置推送消息类型
  });

  console.log(playload);
  return message;
}

function buildTarget(appid, userid) {
  userid = userid.toString();
  console.log('sending to userid = ' + userid);
  //接收方
  return new Target({
    appId: appid,
    alias: userid,
  });
}

exports.pushMessageToUser = function (userid, playload) {
  console.log('send to user');
  var target = buildTarget(config.gt_user_APPID, userid);
  var message = buildMessage(config.gt_user_APPID, config.gt_user_APPKEY,
    playload);
  console.log(JSON.strinify(message));
  console.log(JSON.strinify(target));
  gt_user.pushMessageToSingle(message, target, function (err, res) {
    console.log('push err = ' + err);
    console.log(res);
    if (err != null && err.exception != null && err.exception instanceof RequestError) {
      var requestId = err.exception.requestId;
      console.log(err.exception.requestId);
      gt_user.pushMessageToSingle(message, target, requestId, function (
        err, res) {
        console.log(err);
        console.log(res);
      });
    }
  });
}

exports.pushMessageToDesigner = function (userid, playload) {
  console.log('send to designer');
  var target = buildTarget(config.gt_designer_APPID, userid);
  var message = buildMessage(config.gt_designer_APPID, config.gt_designer_APPKEY,
    playload);
  console.log(JSON.strinify(message));
  console.log(JSON.strinify(target));
  gt_designer.pushMessageToSingle(message, target, function (err, res) {
    console.log('push err = ' + err);
    console.log(res);
    if (err != null && err.exception != null && err.exception instanceof RequestError) {
      var requestId = err.exception.requestId;
      console.log(err.exception.requestId);
      gt_designer.pushMessageToSingle(message, target, requestId,
        function (err, res) {
          console.log(err);
          console.log(res);
        });
    }
  });
}
