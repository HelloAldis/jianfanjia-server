var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema = new Schema({ // 图片
  md5: {
    type: String // 图片md5
  },
  data: {
    type: Buffer // 图片数据
  },
  userid: {
    type: String // 用户id
  },
  ip: {
    type: String // 用户ip
  },
  create_at: {
    type: Number // 创建时间
  },
  width: {
    type: Number // 宽
  },
  height: {
    type: Number // 高
  }
});

ImageSchema.index({
  md5: 1
});

mongoose.model('Image', ImageSchema);
