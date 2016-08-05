var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var AnswerSchema = new Schema({ // 问卷调查
  wenjuanid: {
    type: Number // 问卷id
  },
  questionid: {
    type: Number // 问题id
  },
  userid: {
    type: ObjectId // 用户id
  },
  usertype: {
    type: String // 用户类型
  },
  choice_answer: {
    type: [Number] // 选择的答案
  },
  text_answer: {
    type: String // 填写的大难
  },
  create_at: {
    type: Number // 回答时间
  }
});

AnswerSchema.index({
  wenjuanid: 1
});

mongoose.model('Answer', AnswerSchema);
