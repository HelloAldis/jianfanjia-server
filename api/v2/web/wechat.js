//var parser = require('xml2json');

exports.receive = function (req, res, next) {
  req.on('data', function (data) {
    console.log(data.toString());
  });
  res.sendSuccessMsg();
};

//api/v2/web/wechat/receive?signature=02519a122bc2abcf32fad068ebb22a948a5ed6ba&echostr=3677037571436248575&timestamp=1446538271&nonce=198177824 HTTP/1.0/Mozilla/4.0 404 166 - 0.745 ms
exports.signature = function (req, res, next) {
  req.on('data', function (data) {
    console.log(data.toString());
  });
  res.send(
    '<xml> < ToUserName > < ![CDATA[toUser]] > < /ToUserName> <FromUserName > < ![CDATA[fromUser]] > < /FromUserName> < CreateTime >12345678 < /CreateTime> < MsgType > < ![CDATA[text]] > < /MsgType> <Content > < ![CDATA[你好]] > < /Content> < /xml>'
  );
}
