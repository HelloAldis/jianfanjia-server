var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema = new Schema({
  md5: {
    type: String
  },
  data: {
    type: Buffer
  },
  userid: {
    type: String
  },
  ip: {
    type: String
  },
  create_at: {
    type: Number
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  }
});

ImageSchema.index({
  md5: 1
});

mongoose.model('Image', ImageSchema);
