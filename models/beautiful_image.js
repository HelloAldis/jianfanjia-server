var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var BeautifulImageSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  images: {
    type: {
      imageid: {
        type: ObjectId,
      },
      width: {
        type: Number,
      },
      height: {
        type: Number,
      },
    }
  },
  dec_type: {
    type: String,
  },
  house_type: {
    type: String,
  },
  dec_style: {
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
  },
});

BeautifulImageSchema.index({
  topicid: 1
});

mongoose.model('BeautifulImage', BeautifulImageSchema);
