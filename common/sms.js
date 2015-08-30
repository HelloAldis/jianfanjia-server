var http = require('http');
var querystring = require('querystring');
var config = require('../config');

exports.send = function (phone, con) {
  if (config.debug) {
    return;
  }

  var postData = {
    uid: config.sms_uid,
    pas: config.sms_pas,
    mob: phone,
    con: con,
    type: 'json'
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
  if (config.debug) {
    return;
  }

  var postData = {
    uid: config.sms_uid,
    pas: config.sms_pas,
    mob: phone,
    cid: 'd4OXVcW1Py8A',
    type: 'json',
    p1: code
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

exports.sendYuyue = function (phone) {
  if (config.debug) {
    return;
  }

  var postData = {
    uid: config.sms_uid,
    pas: config.sms_pas,
    mob: phone,
    cid: 'FIgUFcBhel9I',
    type: 'json'
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
