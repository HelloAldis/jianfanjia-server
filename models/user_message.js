var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserMessageSchema = new Schema({
  userid: {
    type: ObjectId
  },
  title: {
    type: String
  },
  content: {
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
