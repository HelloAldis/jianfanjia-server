var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var AnswerSchema = new Schema({
  wenjuanid: {
    type: Number
  },
  questionid: {
    type: Number
  },
  userid: {
    type: ObjectId
  },
  usertype: {
    type: String,
  },
  choice_answer: {
    type: [Number]
  },
  text_answer: {
    type: String,
  },
  create_at: {
    type: Number,
  },
});

AnswerSchema.index({
  wenjuanid: 1
});

mongoose.model('Answer', AnswerSchema);
