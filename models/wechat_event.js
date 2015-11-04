var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WechatEventSchema = new Schema({
  openid: {
    type: String,
  },
  eventtype: {
    type: String,
  },
  sceneid: {
    type: String,
  },
  subscribe_count: {
    type: Number,
    default: 0,
  },
  scan_count: {
    type: Number,
    default: 0,
  }
});

WechatEventSchema.index({
  openid: 1
}, {
  unique: true
});

mongoose.model('WechatEvent', WechatEventSchema);
