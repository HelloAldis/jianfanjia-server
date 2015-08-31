var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var RescheduleSchema = new Schema({
  userid: {
    type: ObjectId,
  },
  designerid: {
    type: ObjectId,
  },
  request_by: {
    type: ObjectId,
  },
  request_date: {
    type: Number,
  }
  new_date: {
    type: Number
  },
  status: {
    type: String,
  },
});

UserSchema.index({
  userid: 1
});
UserSchema.index({
  designerid: 1
});

mongoose.model('Reschedule', RescheduleSchema);
