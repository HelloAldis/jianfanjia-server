var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TeamSchema = new Schema({ // 施工团队
  designerid: {
    type: ObjectId // 设计师id
  },
  manager: {
    type: String // 经理
  },
  uid: {
    type: String // 身份证号
  },
  uid_image1: {
    type: ObjectId // 身份证正面照
  },
  uid_image2: {
    type: ObjectId // 身份证反面照
  },
  company: {
    type: String // 公司
  },
  work_year: {
    type: Number // 工龄
  },
  good_at: {
    type: String // 擅长工种
  },
  working_on: {
    type: String // 施工工地
  },
  sex: {
    type: String // 性别
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
  create_at: {
    type: Number // 创建时间
  }
});

TeamSchema.index({
  designerid: 1
});

mongoose.model('Team', TeamSchema);
