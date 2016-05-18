var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var DesignerSchema = new Schema({
  phone: {
    type: String // 手机号
  },
  username: {
    type: String // 昵称
  },
  realname: {
    type: String // 真实姓名
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
    type: String // 详细地址
  },
  imageid: {
    type: ObjectId // 头像
  },
  big_imageid: {
    type: ObjectId // 大头像
  },
  match: {
    type: Number, // 匹配度
    default: 0
  },
  score: {
    type: Number, // 系统整体评分
    default: 0
  },
  accessToken: {
    type: String // 暂时不用
  },
  create_at: {
    type: Number // 注册时间
  },
  communication_type: {
    type: String, //沟通类型
    default: '0'
  },
  uid: {
    type: String // 身份证号
  },
  uid_image1: {
    type: ObjectId // 身份证正面
  },
  uid_image2: {
    type: ObjectId // 身份证反面
  },
  company: {
    type: String // 曾就职公司
  },
  dec_types: {
    type: [String] // 接单装修类型
  },
  work_types: {
    type: [String] // 接单的包工类型
  },
  dec_styles: {
    type: [String] // 接单的装修风格
  },
  dec_districts: {
    type: [String] // 接单区域
  },
  dec_house_types: {
    type: [String] // 接单户型
  },
  package_types: {
    type: [String] // 接单的包类型
  },
  design_fee_range: {
    type: String // 设计费区间
  },
  dec_fee_half: {
    type: Number, // 半包最低费用
    default: 0
  },
  dec_fee_all: {
    type: Number, // 全包最低费用
    default: 0
  },
  achievement: {
    type: String // 设计师成就
  },
  award_details: {
    type: [{
      award_imageid: {
        type: ObjectId // 获奖照片
      },
      description: {
        type: String // 获奖描述
      },
    }]
  },
  philosophy: {
    type: String // 设计理念
  },
  view_count: {
    type: Number, // 浏览数
    default: 0
  },
  order_count: {
    type: Number, // 预约数
    default: 0
  },
  product_count: {
    type: Number, // 所有作品数
    default: 0
  },
  authed_product_count: {
    type: Number, // 审核通过的作品数
    default: 0
  },
  team_count: {
    type: Number, // 施工团队数
    default: 0
  },
  auth_type: {
    type: String, // 基本资料审核
    default: '0'
  },
  auth_date: {
    type: Number, // 基本资料审核时间
  },
  auth_message: {
    type: String, // 基本资料审核信息
  },
  uid_auth_type: {
    type: String, // 身份认证审核
    default: '0'
  },
  uid_auth_date: {
    type: Number, // 身份认证审核时间
  },
  uid_auth_message: {
    type: String, // 身份认证审核信息
  },
  email_auth_type: {
    type: String, // 邮件认证
    default: '0'
  },
  email_auth_date: {
    type: Number, // 邮件认证时间
  },
  email_auth_message: {
    type: String, // 邮件认证信息
  },
  work_auth_type: {
    type: String, // 工地审核
    default: '0'
  },
  work_auth_date: {
    type: Number, // 工地审核时间
  },
  work_auth_message: {
    type: String, // 工地审核信息
  },
  agreee_license: {
    type: String, // 入驻协议同意标志
    default: '0'
  },
  email: {
    type: String, // 邮箱
  },
  bank: {
    type: String, // 银行
  },
  bank_card: {
    type: String, // 银行卡号
  },
  bank_card_image1: {
    type: ObjectId // 银行卡照片
  },
  work_year: {
    type: Number // 工作年限
  },
  university: {
    type: String, // 毕业院校
  },
  diploma_imageid: {
    type: ObjectId // 学历照
  },
  deal_done_count: {
    type: Number, // 成交数
    default: 0,
  },
  online_status: {
    type: String, // 在线状态
    default: '0'
  },
  online_update_time: {
    type: Number // 在线状态更新时间
  },
  favorite_count: {
    type: Number, // 收藏数
    default: 0
  },
  service_attitude: {
    type: Number, // 服务态度
    default: 0
  },
  respond_speed: {
    type: Number, // 响应速度
    default: 0
  },
  login_count: {
    type: Number, // 登录次数
    default: 1,
  },
  tags: {
    type: [String] // 标签
  },
});

DesignerSchema.index({
  phone: 1
}, {
  unique: true
});
DesignerSchema.index({
  city: 1
});

mongoose.model('Designer', DesignerSchema);
