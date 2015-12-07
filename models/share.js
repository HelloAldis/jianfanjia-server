var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ShareSchema = new Schema({
  userid: {
    type: ObjectId
  },
  designerid: {
    type: ObjectId
  },
  cover_imageid: {
    type: ObjectId,
  },
  manager: {
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
  cell: {
    type: String
  },
  house_type: {
    type: String
  },
  house_area: {
    type: Number
  },
  dec_style: {
    type: String
  },
  dec_type: {
    type: String,
  },
  work_type: {
    type: String
  },
  total_price: {
    type: Number
  },
  description: {
    type: String
  },
  process: {
    type: [{
      name: {
        type: String
      },
      description: {
        type: String
      },
      images: {
        type: [ObjectId]
      },
      date: {
        type: Number
      },
    }]
  },
  view_count: {
    type: Number,
    default: 0
  },
  lastupdate: {
    type: Number,
  },
  start_at: {
    type: Number,
  },
  status: {
    type: String,
    default: '0',
  },
  create_at: {
    type: Number
  },
});

mongoose.model('Share', ShareSchema);
