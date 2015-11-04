var xml2json = require('xml2json');
var _ = require('lodash');
var utility = require('utility');
var type = require('../../../type');
var util = require('util');
var WechatEvent = require('../../../proxy').WechatEvent;
var eventproxy = require('eventproxy');

function toJson(xml) {
  return xml2json.toJson(xml.toString(), {
    object: true
  }).xml;
}

function handleText(msg, req, res, next) {
  var ep = eventproxy();
  ep.fail(next);

  if (msg.Content.search(/我是推广员/) > -1) {
    var sceneid = msg.Content.slice(5);
    WechatEvent.newAndSave({
      openid: msg.FromUserName,
      sceneid: sceneid,
    }, ep.done(function () {
      var url =
        'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQHM8DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL1lEOC1IeGJsOU9LTm4xZTJfQkdqAAIE0mQ5VgMEgDoJAA==';
      res.send(send_image_text(msg.FromUserName, msg.ToUserName, '简繁家',
        '欢迎你', url, url));
    }));
  }
}

//https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQHM8DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL1lEOC1IeGJsOU9LTm4xZTJfQkdqAAIE0mQ5VgMEgDoJAA==
exports.receive = function (req, res, next) {
  req.on('data', function (data) {
    var msg = toJson(data);
    if (msg.MsgType === type.wechat_MsgType_text) {
      handleText(msg, req, res, next);
    } else {
      res.sendSuccessMsg();
    }
  });
};

exports.signature = function (req, res, next) {
  var signature = req.query.signature;
  var timestamp = req.query.timestamp;
  var nonce = req.query.nonce;
  var echostr = req.query.echostr;
  var token = 'jianfanjiatopscrecttoken';
  var arr = [token, timestamp, nonce];
  var str = arr.sort().join('');
  console.log(utility.sha1(str));
  if (signature === utility.sha1(str)) {
    res.send(echostr);
  } else {
    res.end();
  }
}

var image_text_template =
  '<xml>\
<ToUserName><![CDATA[%s]]></ToUserName>\
<FromUserName><![CDATA[%s]]></FromUserName>\
<CreateTime>%s</CreateTime>\
<MsgType><![CDATA[news]]></MsgType>\
<ArticleCount>1</ArticleCount>\
<Articles>\
<item>\
<Title><![CDATA[%s]]></Title>\
<Description><![CDATA[%s]]></Description>\
<PicUrl><![CDATA[%s]]></PicUrl>\
<Url><![CDATA[%s]]></Url>\
</item>\
</Articles>\
</xml>';

function send_image_text(to_user, from_user, title, description, pic_url, url) {
  var time = parseInt(new Date().getTime() / 1000);
  return util.format(image_text_template, to_user, from_user, time, title,
    description, pic_url, url);
}
