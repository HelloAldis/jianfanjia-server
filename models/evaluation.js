var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var EvaluationSchema = new Schema({
  userid: {
    type: ObjectId,
  },
  designerid: {
    type: ObjectId,
  },
  requirementid: {
    type: ObjectId,
  },
  create_at: {
    type: Number,
  },
  service_attitude: {
    type: Number,
  },
  respond_speed: {
    type: Number,
  },
  comment: {
    type: String,
  },
  is_anonymous: {
    type: String,
  },
});

EvaluationSchema.index({
  userid: 1
});
EvaluationSchema.index({
  designerid: 1
});

mongoose.model('Comment', EvaluationSchema);
