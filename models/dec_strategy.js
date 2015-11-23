var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var DecStrategySchema = new Schema({
  title: {
    type: String,
  },
  keywords: {
    type: String,
  },
  cover_imageid: {
    type: ObjectId,
  },
  description: {
    type: String,
  },
  content: {
    type: String,
  },
  authorid: {
    type: String,
  },
  usertype: {
    type: String,
  },
  status: {
    type: String,
  },
  create_at: {
    type: Number
  },
  lastupdate: {
    type: Number
  },
  view_count: {
    type: Number,
    default: 0,
  }
});

DecStrategySchema.index({
  topicid: 1
});

mongoose.model('DecStrategy', DecStrategySchema);
