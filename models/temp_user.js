var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TempUserSchema = new Schema({ // 临时用户
  name: {
    type: String // 用户名
  },
  phone: {
    type: String // 手机号
  },
  district: {
    type: String
  },
  house_area: {
    type: Number,
    default: 0
  },
  total_price: {
    type: Number,
    default: 0
  },
  create_at: {
    type: Number
  },
  platform_type: {
    type: String
  }
});

mongoose.model('TempUser', TempUserSchema);
