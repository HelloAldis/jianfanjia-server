var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
  phone: {
    type: String
  },
  username: {
    type: String
  },
  sex: {
    type: String
  },
  pass: {
    type: String
  },
  province: {
    type: String
  },
  city: {
    type: String
  },
  district: {
    type: String
  },
  address: {
    type: String
  },
  imageid: {
    type: ObjectId
  },
  score: {
    type: Number,
    default: 0
  },
  is_block: {
    type: Boolean,
    default: false
  },
  accessToken: {
    type: String
  },
  create_at: {
    type: Number,
  },
  email: {
    type: String,
  },
});

UserSchema.index({
  phone: 1
}, {
  unique: true
});

mongoose.model('User', UserSchema);
