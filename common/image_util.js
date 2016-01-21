var gm = require('gm');

exports.resize2stream = function (buffer, width, callback) {
  gm(buffer).resize(width).interlace('Line').stream(callback);
}

exports.resize2buffer = function (buffer, width, callback) {
  gm(buffer).resize(width).toBuffer(callback);
}

exports.crop2buffer = function (buffer, width, hight, x, y, callback) {
  gm(buffer).crop(width, hight, x, y).toBuffer(callback);
}

exports.jpgbuffer = function (buffer, callback) {
  gm(buffer).quality(90).toBuffer('jpg', callback);
}

exports.watermark = function (buffer, callback) {
  gm(buffer).size(function (err, value) {
    if (err) {
      return callback(err);
    }

    if (value && value.width) {
      var command = 'image Over ';
      var x = value.width - 366;
      command = command + x + ',10 0,0 mark.png'
      this.draw(command).stream(callback);
    } else {
      return callback('invalid image');
    }
  });
}

exports.resizeThenWatermark2stream = function (buffer, width, callback) {
  var command = 'image Over ';
  var x = width - 366;
  command = command + x + ',10 0,0 mark.png'

  gm(buffer).resize(width).draw(command).stream(callback);
}
