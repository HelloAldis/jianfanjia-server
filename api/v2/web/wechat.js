//var parser = require('xml2json');
var _ = require('lodash');
var utility = require('utility');

exports.receive = function (req, res, next) {
  req.on('data', function (data) {
    console.log(data.toString());
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
