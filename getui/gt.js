var config = require('./GtConfig');
var GeTui = require('./GT.push');
var TransmissionTemplate = require('./template/TransmissionTemplate');
var SingleMessage = require('./message/SingleMessage');
var Target = require('./Target');

var gt = new GeTui(config.HOST, config.APPKEY, config.MASTERSECRET);

exports.aliasBind = function (userid, cid) {
  gt.bindAlias(config.APPID, userid, cid, function (err, res) {
    console.log('err = ' + err);
    console.log(res);
  });
}

exports.pushMessageToSingle = function (userid, playload) {
  userid = userid.toString();

  var message = new SingleMessage({
    isOffline: true, //是否离线
    offlineExpireTime: 3600 * 12 * 1000, //离线时间
    data: new TransmissionTemplate({
      appId: config.APPID,
      appKey: config.APPKEY,
      transmissionType: 2,
      transmissionContent: JSON.stringify(playload),
    }), //设置推送消息类型
  });

  //接收方
  var target = new Target({
    appId: config.APPID,
    alias: userid,
  });

  console.log('userid = ' + userid);
  console.log(playload);

  gt.pushMessageToSingle(message, target, function (err, res) {
    console.log('push err = ' + err);
    console.log(res);
    if (err != null && err.exception != null && err.exception instanceof RequestError) {
      var requestId = err.exception.requestId;
      console.log(err.exception.requestId);
      gt.pushMessageToSingle(message, target, requestId, function (err,
        res) {
        console.log(err);
        console.log(res);
      });
    }
  });
}
