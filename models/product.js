var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ProductSchema = new Schema({
  designerid: {
    type: ObjectId
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
  dec_type: {
    type: String,
  },
  house_area: {
    type: Number
  },
  dec_style: {
    type: String
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
  images: {
    type: [{
      section: {
        type: String
      },
      imageid: {
        type: ObjectId
      },
      description: {
        type: String
      },
    }]
  },

  view_count: {
    type: Number,
    default: 0
  },
  favorite_count: {
    type: Number,
    default: 0
  },
  auth_type: {
    type: String,
    default: '0',
  },
  auth_date: {
    type: Number,
  },
  auth_message: {
    type: String,
  },
  create_at: {
    type: Number
  },
});

ProductSchema.index({
  designerid: 1
});

mongoose.model('Product', ProductSchema);
