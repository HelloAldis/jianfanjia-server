var xml2json = require('xml2json');
var _ = require('lodash');
var utility = require('utility');
var type = require('../../../type');
var util = require('util');
var Kpi = require('../../../proxy').Kpi;
var eventproxy = require('eventproxy');
var cache = require('../../../common/cache');
var request = require('superagent');
var limit = require('../../../middlewares/limit');

function toJson(xml) {
  return xml2json.toJson(xml.toString(), {
    object: true
  }).xml;
}

function handleText(msg, req, res, next) {
  var ep = eventproxy();
  ep.fail(next);

  if (msg.Content.search(/我是推广员/) > -1) {
    var username = msg.Content.slice(5).trim();
    var sceneid = new Date().getTime() % (1000 * 60 * 60 * 24 * 10);
    Kpi.setOne({
      openid: msg.FromUserName
    }, {
      username: username,
      sceneid: sceneid,
    }, {
      upsert: true
    }, ep.done(function (kpi) {
      cache.get(type.wechat_token, ep.done(function (token) {
        var url =
          'https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=' +
          token;
        console.log(url);
        request.post(url).send({
          expire_seconds: 604800,
          action_name: 'QR_SCENE',
          action_info: {
            scene: {
              scene_id: sceneid
            }
          }
        }).end(ep.done(function (wei_res) {
          if (wei_res.ok && !wei_res.body.errcode) {
            var url =
              'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' +
              wei_res.body.ticket;
            res.send(send_image_text(msg.FromUserName, msg.ToUserName,
              '简繁家感谢你为我们推广',
              '请点击链接保管好你的二维码', url, url));
          } else {
            console.log(wei_res.text);
          }
        }));
      }));
    }));
  } else if (msg.Content.toLowerCase() === 'kpi') {
    Kpi.findOne({
      openid: msg.FromUserName
    }, null, ep.done(function (kpi) {
      if (kpi) {
        res.send(send_text(msg.FromUserName, msg.ToUserName,
          '你的kpi为' + kpi.subscribe_count +
          ', 请爆发你的小宇宙吧！'));
      } else {
        res.send('success');
      }
    }));
  } else if (msg.Content.toLowerCase() === 'adminkpi') {
    Kpi.find({}, {
      _id: 0,
      username: 1,
      subscribe_count: 1,
      scan_count: 1,
    }, null, ep.done(function (kpis) {
      if (kpis.length > 0) {
        var arr = kpis.map(function (kpi) {
          return kpi.username + ' ' + kpi.subscribe_count + '+' + kpi
            .scan_count;
        });
        res.send(send_text(msg.FromUserName, msg.ToUserName,
          arr.join('\n')));
      } else {
        res.send('success');
      }
    }));
  } else {
    res.send('success');
  }
}

function handleEvent(msg, req, res, next) {
  var ep = eventproxy();
  ep.fail(next);


  if (msg.Event === type.wechat_Event_subscribe && msg.EventKey && msg.EventKey
    .length > 8) {
    //关注了带参数二维码
    var sceneid = msg.EventKey.slice(8);
    limit.perwhatperdaydo('wechat_Event_subscribe', msg.FromUserName, 1,
      function () {
        Kpi.incOne({
          sceneid: sceneid,
        }, {
          subscribe_count: 1
        });
      });
  } else if (msg.Event === type.wechat_Event_SCAN && msg.EventKey) {
    //已关注了带参数二维码
    var sceneid = msg.EventKey;
    Kpi.incOne({
      sceneid: sceneid,
    }, {
      scan_count: 1
    });
  } else {

  }

  res.send('success');
}

exports.receive = function (req, res, next) {
  req.on('data', function (data) {
    var msg = toJson(data);
    console.log(msg);
    if (msg.MsgType === type.wechat_MsgType_text) {
      handleText(msg, req, res, next);
    } else if (msg.MsgType === type.wechat_MsgType_event) {
      handleEvent(msg, req, res, next);
    } else {
      res.send('success');
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

var text_template =
  '<xml><ToUserName><![CDATA[%s]]></ToUserName>\
<FromUserName><![CDATA[%s]]></FromUserName>\
<CreateTime>12345678</CreateTime>\
<MsgType><![CDATA[text]]></MsgType>\
<Content><![CDATA[%s]]></Content></xml>'

function send_text(to_user, from_user, content) {
  var time = parseInt(new Date().getTime() / 1000);
  return util.format(text_template, to_user, from_user, content);
}
