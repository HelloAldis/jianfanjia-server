var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({ // 业主
  wechat_unionid: {
    type: String // 微信unionid
  },
  wechat_openid: {
    type: String, // 微信openid
  },
  phone: {
    type: String // 手机号
  },
  username: {
    type: String, // 用户名
  },
  sex: {
    type: String // 性别
  },
  pass: {
    type: String // 密码
  },
  province: {
    type: String // 省
  },
  city: {
    type: String // 市
  },
  district: {
    type: String // 区
  },
  address: {
    type: String // 地址
  },
  imageid: {
    type: ObjectId // 头像id
  },
  score: {
    type: Number, // 分数
    default: 0
  },
  is_block: {
    type: Boolean, // 是否屏蔽 暂时没用上
    default: false
  },
  accessToken: {
    type: String // token 暂时没用上
  },
  create_at: {
    type: Number, // 创建时间
  },
  email: {
    type: String, // 邮箱
  },
  email_auth_type: {
    type: String, // 邮箱认证状态
    default: '0'
  },
  email_auth_date: {
    type: Number, // 邮箱认证时间
  },
  dec_progress: {
    type: String, // 搜集装修阶段
  },
  dec_styles: {
    type: [String], // 收集喜欢风格
  },
  family_description: {
    type: String, // 手机家庭描述
  },
  product_view_history: {
    type: [ObjectId] // 作品浏览历史
  },
  designer_view_history: {
    type: [ObjectId] // 设计师浏览历史
  },
  beautiful_image_view_history: {
    type: [ObjectId] // 美图浏览历史
  },
  share_view_history: {
    type: [ObjectId] // 直播浏览历史
  },
  strategy_view_history: {
    type: [ObjectId] // 攻略浏览历史
  },
  platform_type: {
    type: String // 注册平台
  }
});

UserSchema.index({
  phone: 1
});

mongoose.model('User', UserSchema);
