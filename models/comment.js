var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CommentSchema = new Schema({
  topicid: {
    type: ObjectId,
  },
  section: {
    type: String,
  },
  item: {
    type: String,
  },
  topictype: {
    type: String,
  },
  by: {
    type: ObjectId
  },
  to: { //废弃的
    type: ObjectId
  },
  to_userid: {
    type: ObjectId
  },
  to_designerid: {
    type: ObjectId
  },
  usertype: {
    type: String,
  },
  content: {
    type: String
  },
  date: {
    type: Number,
  },
});

CommentSchema.index({
  topicid: 1
});

mongoose.model('Comment', CommentSchema);
