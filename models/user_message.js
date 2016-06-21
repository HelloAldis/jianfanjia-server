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
    type: String,
  },
  item: {
    type: String,
  },
  title: {
    type: String
  },
  content: {
    type: String
  },
  html: {
    type: String
  },
  message_type: {
    type: String
  },
  create_at: {
    type: Number,
  },
  lastupdate: {
    type: Number,
  },
  status: {
    type: String,
  }
});

UserMessageSchema.index({
  userid: 1
});

mongoose.model('UserMessage', UserMessageSchema);
