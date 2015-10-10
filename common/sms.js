var http = require('http');
var querystring = require('querystring');
var config = require('../config');
var DateUtil = require('./date_util');
var utility = require('utility');
var logger = require('./logger')

exports.sendWeiMi = function (phone, cid, p1) {
  if (config.debug) {
    console.log('weimi send to phone = ' + phone);
    return;
  }

  var postData = {
    uid: config.sms_uid,
    pas: config.sms_pas,
    mob: phone,
    cid: cid,
    type: 'json',
    p1: p1,
  };
  var content = querystring.stringify(postData);

  var options = {
    host: 'api.weimi.cc',
    path: '/2/sms/send.html',
    method: 'POST',
    agent: false,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': content.length
    }
  };

  var req = http.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log(JSON.parse(chunk));
    });
    res.on('end', function () {
      console.log('over');
    });
  });
  req.write(content);
  req.end();
}

exports.sendVerifyCode = function (phone, code) {
  exports.sendWeiMi(phone, 'd4OXVcW1Py8A', code);
}

exports.sendYuyue = function (phone) {
  exports.sendWeiMi(phone, 'FIgUFcBhel9I');
}

function yzx(phone, templateId, param) {
  if (config.debug) {
    console.log('yzx send to phone = ' + phone);
    return;
  }

  var time = DateUtil.YYYYMMDDHHmmssSSS();
  var sign = utility.md5(config.yzx_sid + time + config.yzx_token);
  var postData = {
    sid: config.yzx_sid,
    appId: config.yzx_appid,
    sign: sign,
    time: time,
    templateId: templateId,
    to: phone,
    param: param,
  };

  var content = querystring.stringify(postData);
  var options = {
    hostname: 'www.ucpaas.com',
    path: '/maap/sms/code?' + content,
    method: 'GET',
  };

  var req = http.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log(JSON.parse(chunk));
    });
  });
  req.end();
}

exports.sendYzxAuthSuccess = function (phone, param) {
  yzx(phone, '12836', param);
}

exports.sendYzxRequirementSuccess = function (phone, count) {
  yzx(phone, '12837', count);
}
