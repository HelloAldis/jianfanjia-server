var FileStreamRotator = require('file-stream-rotator');
var fs = require('fs');
var morgan = require('morgan');
var config = require('../config');
var path = require('path')

var logDirectory = path.normalize(__dirname + '/../log');

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
  filename: logDirectory + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: false,
  date_format: "YYYY-MM-DD",
});

var logger = undefined;
var format =
  ':date[clf] :remote-addr :remote-user :method :req[Content-Type] :url HTTP/:http-version/:user-agent :status :res[content-length] - :response-time ms';
if (config.debug) {
  logger = morgan(format);
} else {
  logger = morgan(format, {
    stream: accessLogStream
  });
}

module.exports = logger;
