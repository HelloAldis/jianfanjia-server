var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var FeedbackSchema = new Schema({ // 用户反馈
  content: {
    type: String, // 反馈内容
  },
  by: {
    type: ObjectId // 用户id
  },
  version: {
    type: String, // 版本号
  },
  usertype: {
    type: String, // 用户类型
  },
  platform: {
    type: String, // 平台
  },
  create_at: {
    type: Number, // 反馈时间
  },
  status: {
    type: String, // 状态
    default: '0',
  }
});

mongoose.model('Feedback', FeedbackSchema);
