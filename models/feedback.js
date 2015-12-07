var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var FeedbackSchema = new Schema({
  content: {
    type: String,
  },
  by: {
    type: ObjectId
  },
  version: {
    type: String,
  },
  usertype: {
    type: String,
  },
  platform: {
    type: String,
  },
  create_at: {
    type: Number,
  },
  status: {
    type: String,
    default: '0',
  }
});

mongoose.model('Feedback', FeedbackSchema);
