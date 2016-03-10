var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserMessageSchema = new Schema({
  userid: {
    type: ObjectId
  },
  designerid: {
    type: ObjectId
  },
  requirementid: {
    type: ObjectId
  },
  planid: {
    type: ObjectId
  },
  processid: {
    type: ObjectId
  },
  topicid: {
    type: ObjectId
  },
  rescheduleid: {
    type: ObjectId
  },
  commentid: {
    type: ObjectId
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
