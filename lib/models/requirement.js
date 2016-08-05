var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var RequirementSchema = new Schema({ // 装修需求
  userid: {
    type: ObjectId // 业主id
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
  basic_address: {
    type: String // 基础地址
  },
  detail_address: {
    type: String // 详细地址
  },

  street: {
    type: String // 废弃的
  },
  cell: {
    type: String // 废弃的
  },
  cell_phase: {
    type: String // 废弃的
  },
  cell_building: {
    type: String // 废弃的
  },
  cell_unit: {
    type: String // 废弃的
  },
  cell_detail_number: {
    type: String // 废弃的
  },


  house_type: {
    type: String // 户型
  },
  business_house_type: {
    type: String // 商业户型
  },
  house_area: {
    type: Number, // 房屋面积
    default: 0
  },
  dec_style: {
    type: String // 装修风格
  },
  dec_type: {
    type: String // 装修类型
  },
  prefer_sex: {
    type: String // 设计师性别倾向
  },
  work_type: {
    type: String // 包公类型
  },
  total_price: {
    type: Number, // 预算
    default: 0
  },
  rec_designerids: {
    type: [ObjectId] // 推荐设计师id
  },
  order_designerids: {
    type: [ObjectId] // 预约设计师id
  },
  obsolete_designerids: {
    type: [ObjectId] // 淘汰的设计师id
  },
  final_designerid: {
    type: ObjectId // 最终设计师id
  },
  final_planid: {
    type: ObjectId // 最终方案id
  },
  family_description: {
    type: String // 家庭描述
  },
  communication_type: {
    type: String, // 倾向设计师沟通类型
    default: '0'
  },
  status: {
    type: String, // 需求状态
    default: '0'
  },
  create_at: {
    type: Number // 创建时间
  },
  start_at: {
    type: Number // 开工时间
  },
  last_status_update_time: {
    type: Number // 状态更新时间
  },
  package_type: {
    type: String, // 包类型
    default: '0'
  },
  platform_type: {
    type: String // 创建平台
  }
});

RequirementSchema.index({
  userid: 1
});

mongoose.model('Requirement', RequirementSchema);
