var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var RescheduleSchema = new Schema({
  processid: {
    type: ObjectId,
  },
  userid: {
    type: ObjectId,
  },
  designerid: {
    type: ObjectId,
  },
  section: {
    type: String,
  },
  request_role: {
    type: String,
  },
  request_date: {
    type: Number,
  },
  new_date: {
    type: Number
  },
  status: {
    type: String,
  },
});

RescheduleSchema.index({
  userid: 1
});
RescheduleSchema.index({
  designerid: 1
});

mongoose.model('Reschedule', RescheduleSchema);
