var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
  wechat_unionid: {
    type: String
  },
  wechat_openid: {
    type: String,
  },
  phone: {
    type: String
  },
  username: {
    type: String,
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
  email_auth_type: {
    type: String,
    default: '0'
  },
  email_auth_date: {
    type: Number,
  },
  dec_progress: {
    type: String,
  },
  dec_styles: {
    type: [String],
  },
  family_description: {
    type: String,
  },
});

UserSchema.index({
  phone: 1
});

mongoose.model('User', UserSchema);
