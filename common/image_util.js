var gm = require('gm');

exports.resize2stream = function (buffer, width, callback) {
  gm(buffer).resize(width).stream(callback);
}

exports.resize2buffer = function (buffer, width, callback) {
  gm(buffer).resize(width).toBuffer(callback);
}

exports.crop2buffer = function (buffer, width, hight, x, y, callback) {
  gm(buffer).crop(width, hight, x, y).toBuffer('jpg', callback);
}

exports.jpgbuffer = function (buffer, callback) {
  gm(buffer).toBuffer('jpg', callback);
}
