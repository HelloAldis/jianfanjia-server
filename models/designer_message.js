var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var DesignerMessageSchema = new Schema({ // 设计师通知
  designerid: {
    type: ObjectId // 设计师id
  },
  userid: {
    type: ObjectId // 业主id
  },
  supervisorid: {
    type: ObjectId // 监理id
  },
  requirementid: {
    type: ObjectId // 需求id
  },
  planid: {
    type: ObjectId // 方案id
  },
  processid: {
    type: ObjectId // 工地id
  },
  topicid: {
    type: ObjectId // 评论话题id
  },
  commentid: {
    type: ObjectId // 评论id
  },
  rescheduleid: {
    type: ObjectId // 改期id
  },
  productid: {
    type: ObjectId // 案例id
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
    type: String // 内容
  },
  html: {
    type: String // html详细类容
  },
  auth_message: {
    type: String // 审核信息
  },
  message_type: {
    type: String // 通知类型
  },
  create_at: {
    type: Number, // 通知时间
  },
  lastupdate: {
    type: Number, // 最后更新时间
  },
  status: {
    type: String, // 状态
  }
});

DesignerMessageSchema.index({
  designerid: 1
});

mongoose.model('DesignerMessage', DesignerMessageSchema);
