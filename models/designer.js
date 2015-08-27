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
  is_block: {
    type: Boolean,
    default: false
  },
  accessToken: {
    type: String
  },
  create_at: {
    type: Date,
    default: Date.now
  },
  communication_type: {
    type: String,
    default: '0'
  },

  uid: {
    type: String
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
  team_count: {
    type: Number,
    default: 0
  },
  auth_type: {
    type: String,
    default: '0'
  },
  auth_date: {
    type: Date
  },
  agreee_license: {
    type: String,
    default: '0'
  },
});

DesignerSchema.index({
  phone: 1
}, {
  unique: true
});
DesignerSchema.index({
  city: 1
};

mongoose.model('Designer', DesignerSchema);
