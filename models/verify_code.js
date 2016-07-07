var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VerifyCodeSchema = new Schema({ // 验证码
  phone: {
    type: String // 手机号
  },
  code: {
    type: String // 验证码
  },
  create_at: {
    type: Date, // 发送时间
    expires: 60 * 5
  },
});

VerifyCodeSchema.index({
  phone: 1
}, {
  unique: true
});

mongoose.model('VerifyCode', VerifyCodeSchema);
