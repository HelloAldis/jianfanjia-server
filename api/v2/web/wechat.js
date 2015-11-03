//var parser = require('xml2json');

exports.receive = function (req, res, next) {
  req.on('data', function (data) {
    console.log(data.toString());
  });
  res.sendSuccessMsg();
}
