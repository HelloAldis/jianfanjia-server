var http = require('http');
var querystring = require('querystring');
var config = require('../config');

exports.send = function (phone, con) {
  var postData = {
      uid: config.sms_uid,
      pas: config.sms_pas,
      mob: phone,
      // con:'【微米】您的验证码是：610912，3分钟内有效。如非您本人操作，可忽略本消息。',
      con: con,
      type:'json'
  };
  var content = querystring.stringify(postData);

  var options = {
      host:'api.weimi.cc',
      path:'/2/sms/send.html',
      method:'POST',
      agent:false,
      rejectUnauthorized : false,
      headers:{
          'Content-Type' : 'application/x-www-form-urlencoded',
          'Content-Length' :content.length
      }
  };

  var req = http.request(options,function(res){
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log(JSON.parse(chunk));
      });
      res.on('end',function(){
          console.log('over');
      });
  });
  req.write(content);
  req.end();
}

exports.sendVerifyCode = function (phone, code) {
  var postData = {
      uid: config.sms_uid,
      pas: config.sms_pas,
      mob: phone,
      cid: 'd4OXVcW1Py8A',
      type:'json',
      p1:code
  };
  var content = querystring.stringify(postData);

  var options = {
      host:'api.weimi.cc',
      path:'/2/sms/send.html',
      method:'POST',
      agent:false,
      rejectUnauthorized : false,
      headers:{
          'Content-Type' : 'application/x-www-form-urlencoded',
          'Content-Length' :content.length
      }
  };

  var req = http.request(options,function(res){
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log(JSON.parse(chunk));
      });
      res.on('end',function(){
          console.log('over');
      });
  });
  req.write(content);
  req.end();
}
