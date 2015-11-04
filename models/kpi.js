var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var KpiSchema = new Schema({
  username: {
    type: String,
  },
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

KpiSchema.index({
  openid: 1
}, {
  unique: true
});

mongoose.model('Kpi', KpiSchema);
