var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var ProductSchema = new Schema({
  designerid: {type: ObjectId},
  city: { type: String},
  cell: { type: String},
  house_type: {type: String},
  house_area: {type: Number},
  dec_style: {type: String},
  work_type: {type: String},
  total_price: {type: Number},
  images: {type:[ObjectId]},

  view_count: {type: Number, default: 0},
  favorite_count: {type: Number, default: 0},
});

mongoose.model('Product', ProductSchema);
