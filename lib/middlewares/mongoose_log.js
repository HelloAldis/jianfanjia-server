var mongoose = require('mongoose');
var logger = require('lib/common/logger');

var traceMQuery = function (method, info, query) {
  return function (err, result, millis) {
    var infos = [];
    infos.push(query._collection.collection.name + "." + method);
    infos.push(JSON.stringify(info));
    infos.push((millis + 'ms'));

    // var duration = (new Date()) - t;
    logger.debug('mongoose log %s', infos.join(' '));
  };
};

mongoose.Mongoose.prototype.mquery.setGlobalTraceFunction(traceMQuery);
