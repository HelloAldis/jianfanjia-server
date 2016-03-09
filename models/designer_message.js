var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var DesignerMessageSchema = new Schema({
  designerid: {
    type: ObjectId
  },
  userid: {
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
  auth_message: {
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

DesignerMessageSchema.index({
  designerid: 1
});

mongoose.model('DesignerMessage', DesignerMessageSchema);
