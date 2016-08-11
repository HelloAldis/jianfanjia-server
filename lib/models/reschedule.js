var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var RescheduleSchema = new Schema({ // 改期
  processid: {
    type: ObjectId // 工地id
  },
  userid: {
    type: ObjectId // 业主id
  },
  designerid: {
    type: ObjectId // 设计师id
  },
  section: {
    type: String // 工序
  },
  request_role: {
    type: String // 申请改期的用户类型
  },
  request_date: {
    type: Number // 申请时间
  },
  new_date: {
    type: Number // 改期到
  },
  status: {
    type: String // 改期状态
  }
});

RescheduleSchema.index({
  userid: 1
});
RescheduleSchema.index({
  designerid: 1
});

mongoose.model('Reschedule', RescheduleSchema);
