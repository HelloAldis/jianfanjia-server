//load configuration
var config = require('./config');

var express = require('express');
var path = require('path');
var compression = require('compression');
var session = require('express-session');
// var passport = require('passport');
require('./middlewares/mongoose_log'); // 打印 mongodb 查询日志
require('./models');
var webRouter = require('./web_router');
var apiRouterV1 = require('./api_router_v1');
var auth = require('./middlewares/auth');
var responseUtil = require('./middlewares/response_util');
var RedisStore = require('connect-redis')(session);
var _ = require('lodash');
var bodyParser = require('body-parser');
// var cookieParser = require('cookie-parser');
var errorhandler = require('errorhandler');
var cors = require('cors');
var morgan = require('morgan');
var logger = require('./common/logger');
var helmet = require('helmet');
//防治跨站请求伪造攻击
var csurf = require('csurf');

// 静态文件目录
var staticDir = path.join(__dirname, 'public');

var app = express();
// configuration in all env
app.enable('trust proxy');

// Request logger。请求时间
app.use(morgan(
  ':remote-addr :remote-user :method :req[Content-Type] :url HTTP/:http-version :status :res[content-length] - :response-time ms'
));

app.use(compression());
// 通用的中间件
app.use(require('response-time')());
app.use(helmet.frameguard('deny')); // 防止 clickjacking attacks
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

app.use(require('method-override')());
// app.use(require('cookie-parser')(config.session_secret));
app.use(session({
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: config.session_time,
  },
  secret: config.session_secret,
  store: new RedisStore({
    port: config.redis_port,
    host: config.redis_host,
  }),
  rolling: false,
  resave: false,
  saveUninitialized: false,
}));

// 静态资源
// app.use('/tpl/user', auth.authWeb);
app.use('/', express.static(staticDir));

// custom middleware
// app.use(auth.authUser);

// if (!config.debug) {
//   app.use(function (req, res, next) {
//     if (req.path === '/api' || req.path.indexOf('/api') === -1) {
//       csurf()(req, res, next);
//       return;
//     }
//     next();
//   });
//   app.set('view cache', true);
// }

app.use(responseUtil);
// app.use(function (req, res, next) {
//   res.locals.csrf = req.csrfToken ? req.csrfToken() : '';
//   next();
// });

// routes
if (config.debug) {
  app.use('/api/v1', function (req, res, next) {
    console.log(req.body);
    next();
  });
}

app.use('/api/v1', cors(), apiRouterV1);
app.use('/', webRouter);

// error handler
if (config.debug) {
  app.use(errorhandler());
} else {
  app.use(function (err, req, res, next) {
    logger.error('server 500 error:', err);
    return res.status(500).send('500 status');
  });
}

app.listen(config.port, function () {
  logger.log('Jianfanjia listening on port', config.port);
});

module.exports = app;
