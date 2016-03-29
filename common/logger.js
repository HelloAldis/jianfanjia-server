var winston = require('winston');
var Rotate = require('winston-daily-rotate-file');
var path = require('path');

var logDirectory = path.normalize(__dirname + '/../log');

var logger = new winston.Logger({
  transports: [
    new Rotate({
      level: 'debug',
      filename: logDirectory + '/all.log',
      handleExceptions: true,
      humanReadableUnhandledException: true,
      datePattern: '.yyyy-MM-dd',
      // maxsize: 5242880, //5MB
      // maxFiles: 5,
      json: false,
      colorize: false
    }),
    new winston.transports.File({
      level: 'error',
      filename: logDirectory + '/error.log',
      handleExceptions: true,
      humanReadableUnhandledException: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      json: false,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      humanReadableUnhandledException: true,
      timestamp: true,
      json: false,
      colorize: true
    }),
  ],
  exitOnError: false,
});

logger.stream = {
  write: function (message, encoding) {
    logger.info(message);
  }
};

module.exports = logger;
