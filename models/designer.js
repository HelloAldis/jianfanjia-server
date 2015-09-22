var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var DesignerSchema = new Schema({
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
  big_imageid: {
    type: ObjectId
  },
  score: {
    type: Number,
    default: 0
  },
  match: {
    type: Number,
    default: 0
  },
  accessToken: {
    type: String
  },
  create_at: {
    type: Number
  },
  communication_type: {
    type: String,
    default: '0'
  },
  uid: {
    type: String
  },
  uid_image1: {
    type: ObjectId
  },
  uid_image2: {
    type: ObjectId
  },
  company: {
    type: String
  },
  dec_types: {
    type: [String]
  },
  dec_styles: {
    type: [String]
  },
  dec_districts: {
    type: [String]
  },
  dec_house_types: {
    type: [String]
  },
  design_fee_range: {
    type: String
  },
  dec_fee_half: {
    type: Number,
    default: 0
  },
  dec_fee_all: {
    type: Number,
    default: 0
  },
  achievement: {
    type: String
  },
  philosophy: {
    type: String
  },
  view_count: {
    type: Number,
    default: 0
  },
  order_count: {
    type: Number,
    default: 0
  },
  product_count: {
    type: Number,
    default: 0
  },
  authed_product_count: {
    type: Number,
    default: 0
  },
  team_count: {
    type: Number,
    default: 0
  },
  auth_type: {
    type: String,
    default: '0'
  },
  auth_date: {
    type: Number,
  },
  auth_message: {
    type: String,
  },
  uid_auth_type: {
    type: String,
    default: '0'
  },
  uid_auth_date: {
    type: Number,
  },
  uid_auth_message: {
    type: String,
  },
  email_auth_type: {
    type: String,
    default: '0'
  },
  email_auth_date: {
    type: Number,
  },
  email_auth_message: {
    type: String,
  },
  work_auth_type: {
    type: String,
    default: '0'
  },
  work_auth_date: {
    type: Number,
  },
  work_auth_message: {
    type: String,
  },
  agreee_license: {
    type: String,
    default: '0'
  },
  email: {
    type: String,
  },
  bank: {
    type: String,
  },
  bank_card: {
    type: String,
  },
  bank_card_image1: {
    type: ObjectId
  },
  work_year: {
    type: Number
  },
  university: {
    type: String,
  },
  deal_done_count: {
    type: Number,
    default: 0,
  }
});

DesignerSchema.index({
  phone: 1
}, {
  unique: true
});
DesignerSchema.index({
  city: 1
});

mongoose.model('Designer', DesignerSchema);
