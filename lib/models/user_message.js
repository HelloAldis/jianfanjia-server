var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserMessageSchema = new Schema({
  userid: {
    type: ObjectId // 评论发给哪个业主
  },
  designerid: {
    type: ObjectId // 发评论的设计师id
  },
  supervisorid: {
    type: ObjectId // 发评论的监理id
  },
  byUserid: {
    type: ObjectId // 发评论的业主id
  },
  requirementid: {
    type: ObjectId // 相关的需求id
  },
  planid: {
    type: ObjectId // 相关的方案id
  },
  processid: {
    type: ObjectId // 相关的工地id
  },
  topicid: {
    type: ObjectId // 相关的话题的id
  },
  rescheduleid: {
    type: ObjectId // 相关的改期id
  },
  commentid: {
    type: ObjectId // 相关的评论id
  },
  section: {
    type: String, // 工地工序
  },
  item: {
    type: String, // 工序小节点
  },
  title: {
    type: String // 标题
  },
  content: {
    type: String // 类容
  },
  html: {
    type: String // 详细html
  },
  message_type: {
    type: String // 通知类型
  },
  create_at: {
    type: Number, // 创建时间
  },
  lastupdate: {
    type: Number, // 更新时间
  },
  status: {
    type: String, // 状态
  }
});

UserMessageSchema.index({
  userid: 1
});

mongoose.model('UserMessage', UserMessageSchema);
