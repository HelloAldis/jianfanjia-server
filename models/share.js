var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var ShareSchema = new Schema({
  userid: {type: ObjectId},
  designerid: {type: ObjectId},
  manager: {type: String},
  city: { type: String},
  cell: { type: String},
  house_type: {type: String},
  house_area: {type: Number},
  dec_style: {type: String},
  work_type: {type: String},
  total_price: {type: Number},
  description: {type: String},
  process: {type:
    [{
      name: {type: String},
      images: {type:[ObjectId]},
      date: {type: Date},
    }]
  },
  view_count: {type: Number, default: 0},
  lastupdate: {type: Date, default: Date.now},
});

mongoose.model('Share', ShareSchema);
