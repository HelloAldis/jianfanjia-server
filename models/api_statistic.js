var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApiStatisticSchema = new Schema({
  api: {
    type: String,
  },
  count: {
    type: Number,
    default: 0,
  },
  platform_type: {
    type: String //平台
  }
});

ApiStatisticSchema.index({
  api: 1
}, {
  unique: true
});

mongoose.model('ApiStatistic', ApiStatisticSchema);
