var fs     = require('fs');
var config = require('../apiconfig');

if (!fs.existsSync("./log")) {
  fs.mkdirSync("./log");
}

exports.log = function () {
  writeLog('', 'info', arguments);
};

exports.info = function () {
  writeLog('  ', 'info', arguments);
};

exports.debug = function () {
  writeLog("  ", 'debug', arguments);
};

exports.warn = function () {
  writeLog("  ", 'warn', arguments);
};

exports.error = function () {
  writeLog("  ", 'error', arguments);
};

var env = process.env.NODE_ENV || "development";
var consolePrint = config.debug && env !== 'test';
var writeLog = function (prefix, logType, args) {
  var filePrint = logType !== 'debug';

  if (!filePrint && !consolePrint) {
    return;
  }

  var infos = Array.prototype.slice.call(args);

  var logStr = infos.join(" ");


  switch (logType) {
  case "debug":
    logStr = logStr;
    break;
  case 'warn':
    logStr = logStr;
    break;
  case 'error':
    logStr = logStr;
    break;
  }

  var line = prefix + logStr;
  if (filePrint) {
    fs.appendFile('./log/' + env + '.log', line + "\n");
  }
  if (consolePrint) {
    console.log(line);
  }
};
