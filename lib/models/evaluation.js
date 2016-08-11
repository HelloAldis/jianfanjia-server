var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var EvaluationSchema = new Schema({ // 评价
  userid: {
    type: ObjectId // 业主id
  },
  designerid: {
    type: ObjectId // 设计师id
  },
  requirementid: {
    type: ObjectId // 需求id
  },
  create_at: {
    type: Number // 评价时间
  },
  service_attitude: {
    type: Number // 服务态度分
  },
  respond_speed: {
    type: Number // 响应速度分
  },
  comment: {
    type: String // 评论留言
  },
  is_anonymous: {
    type: String // 是否匿名
  }
});

EvaluationSchema.index({
  userid: 1
});
EvaluationSchema.index({
  designerid: 1
});

mongoose.model('Evaluation', EvaluationSchema);
