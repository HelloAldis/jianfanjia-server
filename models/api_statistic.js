var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApiStatisticSchema = new Schema({ // api 统计
  api: {
    type: String, // api名字
  },
  count: {
    type: Number, // 次数
    default: 0,
  },
  platform_type: {
    type: String // 平台
  }
});

ApiStatisticSchema.index({
  api: 1
}, {
  unique: true
});

mongoose.model('ApiStatistic', ApiStatisticSchema);
