var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var KpiSchema = new Schema({ // 推广人员kpi
  username: {
    type: String // 用户名
  },
  openid: {
    type: String // 微信openid
  },
  eventtype: {
    type: String // 消息类型
  },
  sceneid: {
    type: String // 场景id
  },
  subscribe_count: {
    type: Number, // 关注数
    default: 0
  },
  scan_count: {
    type: Number, // 扫码数
    default: 0
  }
});

KpiSchema.index({
  openid: 1
}, {
  unique: true
});

mongoose.model('Kpi', KpiSchema);
