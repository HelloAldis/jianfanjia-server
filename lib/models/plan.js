var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var PlanSchema = new Schema({ // 方案
  userid: {
    type: ObjectId // 业主id
  },
  designerid: {
    type: ObjectId // 设计师id
  },
  requirementid: {
    type: ObjectId // 需求id
  },
  duration: {
    type: Number // 工期
  },
  total_price: {
    type: Number // 总价
  },
  project_price_before_discount: {
    type: Number // 打折前工程价
  },
  project_price_after_discount: {
    type: Number // 打折后工程价
  },
  total_design_fee: {
    type: Number // 设计费
  },
  price_detail: {
    type: [{
      item: {
        type: String // 项目
      },
      price: {
        type: Number // 费用
      },
      description: {
        type: String // 描述
      },
    }]
  },
  name: {
    type: String // 反感名
  },
  description: {
    type: String // 描述
  },
  manager: {
    type: String // 项目经理
  },
  images: {
    type: [ObjectId] // 平面图
  },
  status: {
    type: String, // 状态
    default: '0'
  },
  house_check_time: {
    type: Number, // 量房时间
  },
  user_ok_house_check_time: {
    type: Number, // 确认量房时间
  },
  request_date: {
    type: Number, // 预约时间
  },
  last_status_update_time: {
    type: Number, // 最后状态更新时间
  },
  reject_respond_msg: {
    type: String, // 拒绝理由
  },
  get_phone_time: {
    type: Number, // 获取手机号时间
  },
  create_at: {
    type: Number, // 创建时间
  },
});

PlanSchema.index({
  userid: 1
});
PlanSchema.index({
  designerid: 1
});

mongoose.model('Plan', PlanSchema);
