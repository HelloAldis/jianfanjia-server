// var xml2json = require('xml2json');
var _ = require('lodash');
var utility = require('utility');
var type = require('../../../type');

function toJson(xml) {
  return xml2json.toJson(xml.toString(), {
    object: true
  }).xml;
}

function handleText(msg) {
  if (msg.Content === '我要推广') {

  }
}
//https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQHM8DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL1lEOC1IeGJsOU9LTm4xZTJfQkdqAAIE0mQ5VgMEgDoJAA==
exports.receive = function (req, res, next) {
  req.on('data', function (data) {
    var msg = toJson(data);
    if (msg.MsgType === type) {

    }
  });
  res.sendSuccessMsg();
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


/*
<xml>
<ToUserName><![CDATA[re_to_user]]></ToUserName>
<FromUserName><![CDATA[re_from_user]]></FromUserName>
<CreateTime>re_time</CreateTime>
<MsgType><![CDATA[news]]></MsgType>
<ArticleCount>1</ArticleCount>
<Articles>
<item>
<Title><![CDATA[title1]]></Title>
<Description><![CDATA[description1]]></Description>
<PicUrl><![CDATA[picurl]]></PicUrl>
<Url><![CDATA[url]]></Url>
</item>
</Articles>
</xml>
*/
