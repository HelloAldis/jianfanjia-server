var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TempUserSchema = new Schema({ // 临时用户
  name: {
    type: String // 用户名
  },
  phone: {
    type: String // 手机号
  },
  district: {
    type: String // 区域或专题
  },
  house_area: {
    type: Number, // 面积
    default: 0
  },
  total_price: {
    type: Number, // 价格
    default: 0
  },
  create_at: {
    type: Number // 提交时间
  },
  platform_type: {
    type: String // 平台
  },
  userid: {
    type: ObjectId // 已登录了的用户id
  }
});

mongoose.model('TempUser', TempUserSchema);
