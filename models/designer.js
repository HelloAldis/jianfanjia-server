var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var DesignerSchema = new Schema({
  phone: {type: String},
  username: { type: String},
  sex: {type: String},
  pass: { type: String },
  city: { type: String },
  district: {type: String},
  address: { type: String },
  imageid: {type: ObjectId},
  score: {type: Number, default: 0},
  is_block: {type: Boolean, default: false},
  accessToken: {type: String},
  create_at: {type: Date, default: Date.now},

  uid: {type: String},
  company: {type: String},
  dec_types: {type: [String]},
  dec_styles: {type: [String]},
  dec_districts: {type: [String]},
  design_fee_range: {type: String},
  dec_fee_half: {type: Number, default: 0},
  dec_fee_all: {type: Number, default: 0},
  achievement: {type: String},
  philosophy: {type: String},
  view_count: {type: Number, default: 0},
  auth_type: {type: String, default: '1'},
  auth_date: {type: Date},
});

DesignerSchema.index({phone: 1}, {unique: true});

mongoose.model('Designer', DesignerSchema);
