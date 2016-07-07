var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var DecStrategySchema = new Schema({ // 装修文章
  title: {
    type: String, // 标题
  },
  keywords: {
    type: String, // 关键字
  },
  cover_imageid: {
    type: ObjectId, // 封面图id
  },
  description: {
    type: String, // 描述
  },
  content: {
    type: String, //类容
  },
  authorid: {
    type: String, // 作者id
  },
  usertype: {
    type: String, // 作者类型
  },
  articletype: {
    type: String, // 文章类型
  },
  status: {
    type: String, // 状态
  },
  create_at: {
    type: Number // 创建时间
  },
  lastupdate: {
    type: Number // 最后更新时间
  },
  view_count: {
    type: Number, // 浏览数
    default: 0,
  }
});

// DecStrategySchema.index({
// });

mongoose.model('DecStrategy', DecStrategySchema);
