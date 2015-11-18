/**
 * config
 */

var path = require('path');

var config = {
  // debug 为 true 时，用于本地调试
  debug: false,

  // 程序运行的端口
  port: 80,

  // mongodb 配置
  db: 'mongodb://127.0.0.1/jianfanjia',

  // redis 配置，默认是本地
  redis_host: '127.0.0.1',
  redis_port: 6379,
  redis_db: 0,
  redis_pass: 'Jyz20150608',

  //Session 配置
  session_secret: 'jiayizhuang_jianfanjia_secret', // 务必保密
  auth_cookie_name: 'jianfanjia',
  session_time: 1000 * 60 * 60 * 24 * 2,

  user_home_url: '/tpl/user/owner.html',
  designer_license_url: '/tpl/user/license.html',
  designer_home_url: '/tpl/user/designer.html',

  // 邮箱配置
  mail_opts: {
    service: 'QQex',
    auth: {
      user: 'noreply@myjyz.com',
      pass: 'Jyz20150608welcome'
    }
  },

  //微信公众平台设置
  wechat_app_Secret: '1b9bfbd4f8d9610858bacaf3e313e665',
  wechat_appid: 'wxdf8d720164933e01',
  open_weixin_token: false,
  interval_get_wechat_token: 90,

  //微米短信配置
  sms_uid: 'S9w4LEmiYSgR',
  sms_pas: 's5pf823y',

  //云之讯短信配置
  yzx_sid: '03713bdddee6ff2c763393e316094eb6',
  yzx_token: '26d602336aa881dbf272873e31b8b723',
  yzx_appid: '5484c9c5af984884ab8942616de7e5b7',

  //一些业务配置
  send_email: true, //发不发送邮件
  send_sms: true, //发不发短信
  need_verify_code: true, //需不需要验证码
  visit_per_day: 1000, // 每个 ip 每天能访问的次数
  send_verify_code_per_day: 50, //每个 ip 每天能发的验证码次数
  recommend_designer_count: 3, //我的设计师页面 推荐的设计师个数
  index_top_designer_count: 7, //首页设计师个数
  index_top_share_count: 6, //首页的直播个数
  designer_respond_user_order_expired: 60 * 24, //分钟，设计师多久内必须相应业主
  interval_scan_expired_respond: 60, //分钟，扫描过期响应间隔
  designer_upload_plan_expired: 60 * 24 * 5, //分钟，设计师多久内必须上传方案
  interval_scan_expired_upload_plan: 60, //分钟, 扫描过期上传方案间隔

  duration_60: 60, //装修流程60天模版
  duration_60_kai_gong: 1, //开工
  duration_60_chai_gai: 3, //拆改
  duration_60_shui_dian: 11, //水电
  duration_60_ni_mu: 21, //泥木
  duration_60_you_qi: 10, //油漆
  duration_60_an_zhuang: 13, //安装
  duration_60_jun_gong: 1, //竣工
};

module.exports = config;
