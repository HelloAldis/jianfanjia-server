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
  to: {
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
  status: {
    type: String,
  }
});

CommentSchema.index({
  topicid: 1
});

mongoose.model('Comment', CommentSchema);
