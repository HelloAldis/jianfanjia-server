/**
 * this is test config
 */

var config = {
  // debug 为 true 时，用于本地调试
  debug: true,

  // 程序运行的端口
  port: 8888,

  //电脑版web domain RegExp
  www_web_domain_regex: /dev.jianfanjia.com/,
  //移动端web domain RegExp
  m_web_domain_regex: /devm.jianfanjia.com/,
  //管理员web domain RegExp
  admin_web_domain_regex: /devgod.jianfanjia.com/,
  //设计师网站web domain RegExp
  designer_web_domain_regex: /devdesigner.jianfanjia.com/,

  // mongodb 配置
  db: 'mongodb://127.0.0.1/phase2-testing',

  // redis 配置，默认是本地
  redis_host: '127.0.0.1',
  redis_port: 6379,
  redis_db: 0,
  redis_pass: 'Jyz20150608',

  //Session 配置
  session_secret: 'jiayizhuang_jianfanjia_secret_phase2-testing', // 务必保密
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
  wechat_app_Secret: 'f99a7b6ecd932673dc6c8bbaffb0cb79',
  wechat_appid: 'wxfaa883b9fb2fd347',
  wechat_token: '699545ef6943fbb2aa55918a4c497833',
  wechat_aes_key: 'HaVJN3USKPvy0CBJa7rUl9u5E3qCO35WzAiTDS0T2Bh',
  open_weixin_token: false,
  interval_get_wechat_token: 90,

  //微信开放平台设置
  wechat_open_web_appid: 'wx4c202e20a0f0c62d',
  wechat_open_web_appsecret: '15ca780dcc3b0ee060bfa6ce4eca9375',

  //微米短信配置
  sms_uid: 'S9w4LEmiYSgR',
  sms_pas: 's5pf823y',

  //云之讯短信配置
  yzx_sid: '03713bdddee6ff2c763393e316094eb6',
  yzx_token: '26d602336aa881dbf272873e31b8b723',
  yzx_appid: '5484c9c5af984884ab8942616de7e5b7',

  //个推配置
  gt_HOST: 'http://sdk.open.api.igexin.com/apiex.htm',
  gt_user_APPID: 'SLKdGK8YIr9wns6NPEL8v8',
  gt_user_APPKEY: 'O3oCpGEAVp7NjP67JbMPt5',
  gt_user_MASTERSECRET: 'IC092VcdKD66tT4D1lNVa9',
  gt_user_APPSECRET: 'MM8Ybygbsz7EUvMoNpkHd5',
  gt_designer_APPID: 's7Et91ZLPu8KRwBEtY4AZ8',
  gt_designer_APPKEY: '8BTWfBSMYM95oFpDOwGYu5',
  gt_designer_MASTERSECRET: 'Ngh4fDga668ScOax5rRx3',
  gt_designer_APPSECRET: 'QbclEVLgAIA6iWblkTjyD4',

  //诚贷通配置
  cdt_api_url: 'http://wxtest3.cdtfax.com',

  //一些业务配置
  send_email: true, //发不发送邮件
  send_sms: false, //发不发短信
  need_verify_code: false, //需不需要验证码
  visit_per_day: 1000, // 每个 ip 每天能访问的次数
  send_verify_code_per_day: 100, //每个 ip 每天能发的验证码次数
  recommend_designer_count: 3, //我的设计师页面 推荐的设计师个数
  index_top_designer_count: 7, //首页设计师个数
  index_top_share_count: 6, //首页的直播个数
  designer_respond_user_order_expired: 60 * 24, //分钟，设计师多久内必须相应业主
  interval_scan_expired_respond: 1, //分钟，扫描过期响应间隔
  designer_upload_plan_expired: 60 * 24 * 5, //分钟，设计师多久内必须上传方案
  interval_scan_expired_upload_plan: 1, //分钟, 扫描过期上传方案间隔
  designer_remind_user_house_check_time_one_day: 1, //设计师一天最多可以提醒业主几次量房
  is_push_url: false, // 是否推送url给百度

  duration_60: 60, //装修流程60天模版
  duration_60_kai_gong: 1, //开工
  duration_60_chai_gai: 3, //拆改
  duration_60_shui_dian: 11, //水电
  duration_60_ni_mu: 21, //泥木
  duration_60_you_qi: 10, //油漆
  duration_60_an_zhuang: 13, //安装
  duration_60_jun_gong: 1 //竣工
};

module.exports = config;
