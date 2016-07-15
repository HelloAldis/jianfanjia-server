var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CommentSchema = new Schema({ // 评论
  topicid: {
    type: ObjectId, // 评论属于的话题id，
  },
  section: {
    type: String, // 如果topictype是工地 代表装修阶段
  },
  item: {
    type: String, // 如果topictype是工地 代表装修小节点
  },
  topictype: {
    type: String, // 话题类型 有方案，工地，日记
  },
  by: {
    type: ObjectId // 评论者id
  },
  usertype: {
    type: String, // 评论者用户类型
  },
  to: {
    type: ObjectId // 废弃的
  },
  to_userid: {
    type: ObjectId // 评论给的业主id
  },
  to_designerid: {
    type: ObjectId // 评论给的设计师id
  },
  to_commentid: {
    type: ObjectId // 评论给的评论的id
  },
  content: {
    type: String // 评论类容
  },
  date: {
    type: Number, // 评论时间
  },
});

CommentSchema.index({
  topicid: 1
});

mongoose.model('Comment', CommentSchema);
