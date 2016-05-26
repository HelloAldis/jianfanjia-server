"use strict";

//load configuration
const config = require('./apiconfig');
const express = require('express');
const vhost = require('vhost');
const logger = require('./common/logger');

require('./middlewares/mongoose_log'); // 打印 mongodb 查询日志
require('./models');
require('./common/job');

//main App
let main_app = express();
main_app.use(vhost('jianfanjia.com', function (req, res, next) {
  res.redirect(301, 'http://www.jianfanjia.com' + req.url);
}));
main_app.use(vhost(config.admin_web_domain_regex, require('./app_admin')));
main_app.use(vhost(config.m_web_domain_regex, require('./app_mobile')));
main_app.use(vhost(config.www_web_domain_regex, require('./app_pc')));

main_app.listen(config.port, function () {
  logger.info('Jianfanjia listening on port %s', config.port);
});

module.exports = main_app;
