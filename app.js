//load configuration
var config = require('./apiconfig');
var express = require('express');
var vhost = require('vhost');
var logger = require('./common/logger');

require('./middlewares/mongoose_log'); // 打印 mongodb 查询日志
require('./models');
require('./common/job');

//main App
var main_app = express();
main_app.use(vhost('jianfanjia.com', function (req, res, next) {

}));
main_app.use(vhost(config.m_web_domain_regex, require('./app_mobile')));
main_app.use(vhost(config.www_web_domain_regex, require('./app_web')));

main_app.listen(config.port, function () {
  logger.info('Jianfanjia listening on port %s', config.port);
});

module.exports = main_app;
