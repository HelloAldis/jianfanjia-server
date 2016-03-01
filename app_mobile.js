//load configuration
var config = require('./apiconfig');

var express = require('express');
var path = require('path');
var compression = require('compression');
var session = require('express-session');
var timeout = require('connect-timeout');
var req_res_log = require('./middlewares/req_res_log');
var api_router_app_v2 = require('./api_router_app_v2');
var api_router_web_v2 = require('./api_router_web_v2');
var auth = require('./middlewares/auth');
var responseUtil = require('./middlewares/response_util');
// var RedisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');
var cors = require('cors');
var logger = require('./common/logger');
var helmet = require('helmet');
var api_statistic = require('./middlewares/api_statistic');
var router_mobile = require('./router_mobile');

//config the web app
var app = express();
// configuration in all env
app.enable('trust proxy');
app.use(require('prerender-node').set('prerenderToken', 'ECav3XjGcRGdN9q0EtF1'));

//config view engine
app.set('views', path.join(__dirname, 'mobile_views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);
app.set('view cache', !config.debug);

app.use(compression());
// 通用的中间件
app.use(require('response-time')());
app.use(timeout('60s'));
app.use(helmet.frameguard('sameorigin')); // 防止 clickjacking attacks
app.use(helmet.hidePoweredBy({
  setTo: 'PHP 4.2.0'
})); //伪造poweredby
app.use(bodyParser.json({
  limit: '1mb'
}));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '1mb'
}));
app.use(bodyParser.raw({
  limit: '3mb',
  type: 'image/jpeg'
}));

// 静态资源
app.use('/', express.static(path.join(__dirname, 'mobile')));

//api response util middleware
app.use(responseUtil);

// routes
if (config.debug) {
  app.use('/api/v2', function (req, res, next) {
    if (!(req.body instanceof Buffer)) {
      logger.debug(req.body);
    }

    next();
  });
}

//API Request logger
app.use('/api', req_res_log);
app.use('/api/v2/app', cors(), api_statistic.api_statistic, api_router_app_v2);
app.use('/api/v2/web', cors(), api_statistic.api_statistic, api_router_web_v2);
app.use('/', router_mobile);

// error handler
app.use(function (err, req, res, next) {
  logger.error('server 500 error: %s, %s', err.stack, err.errors);
  return res.status(500).send('500 status');
});

app.get('*', function (req, res) {
  res.status(404);
  if (req.path === '/404.html') {
    res.end();
  } else {
    res.redirect('/404.html');
  }
});

module.exports = app;
