/**
 * config
 */

var path = require('path');

var config = {
  // debug 为 true 时，用于本地调试
  debug: true,

  // name: '简繁家', // 社区名字
  // description: '简繁家：首个设计师专单平台', // 社区的描述
  // keywords: '简繁家，装修，设计师，业主',

  // 添加到 html head 中的信息
  // site_headers: [
  //   '<meta name="author" content="EDP@TAOBAO" />'
  // ],
  // site_logo: '/public/images/cnodejs_light.svg', // default is `name`
  // site_icon: '/public/images/cnode_icon_32.png', // 默认没有 favicon, 这里填写网址
  // 右上角的导航区
  // site_navs: [
  //   // 格式 [ path, title, [target=''] ]
  //   [ '/about', '关于' ]
  // ],
  // cdn host，如 http://cnodejs.qiniudn.com
  site_static_host: '', // 静态文件存储域名
  // 社区的域名
  host: 'localhost',
  // 默认的Google tracker ID，自有站点请修改，申请地址：http://www.google.com/analytics/
  google_tracker_id: '',
  // 默认的cnzz tracker ID，自有站点请修改
  cnzz_tracker_id: '',

  // mongodb 配置
  db: 'mongodb://127.0.0.1/jianfanjia',

  // redis 配置，默认是本地
  redis_host: '127.0.0.1',
  redis_port: 6379,
  redis_db: 0,
  // redis_pass: 'Jyz20150608',

  session_secret: 'jiayizhuang_jianfanjia_secret', // 务必修改
  auth_cookie_name: 'jianfanjia',
  session_time: 1000 * 60 * 60 * 24 * 5,

  // 程序运行的端口
  port: 80,

  // 邮箱配置
  mail_opts: {
    host: 'smtp.exmail.qq.com',
    port: 25,
    auth: {
      user: 'nichole.wang@myjfy.com',
      pass: '?'
    }
  },

  //weibo app key
  // weibo_key: 10000000,
  // weibo_id: 'your_weibo_id',

  // admin
  admins: {
    user_login_name: true
  },

  // newrelic 是个用来监控网站性能的服务
  newrelic_key: 'yourkey',

  // 极光推送
  jpush: {
    appKey: 'YourAccessKeyyyyyyyyyyyy',
    masterSecret: 'YourSecretKeyyyyyyyyyyyyy',
    isDebug: false,
  },

  visit_per_day: 1000, // 每个 ip 每天能访问的次数
  send_verify_code_per_day: 5000000, //每个 ip 每天能发的验证码次数
  recommend_designer_count: 3, //我的设计师页面 推荐的设计师个数
  index_top_designer_count: 5,
  index_top_share_count: 6,
  sms_uid: 'S9w4LEmiYSgR',
  sms_pas: 's5pf823y',

  duration_60_kai_gong: 1,
  duration_60_chai_gai: 3,
  duration_60_shui_dian: 11,
  duration_60_ni_mu: 21,
  duration_60_you_qi: 10,
  duration_60_an_zhuang: 13,
  duration_60_jun_gong: 1,
};

module.exports = config;
