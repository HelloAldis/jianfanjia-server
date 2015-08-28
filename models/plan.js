var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var PlanSchema = new Schema({
  userid: {
    type: ObjectId
  },
  designerid: {
    type: ObjectId
  },
  requirementid: {
    type: ObjectId
  },
  duration: {
    type: Number
  },
  total_price: {
    type: Number
  },
  price_detail: {
    type: [{
      item: {
        type: String
      },
      price: {
        type: Number
      },
      description: {
        type: String
      },
    }]
  },
  description: {
    type: String
  },
  manager: {
    type: String
  },
  images: {
    type: [ObjectId]
  },
  status: {
    type: String,
    default: '0'
  },
  house_check_time: {
    type: Number
  },
  request_date: {
    type: Number,
  },
  comments: {
    type: [{
      by: {
        type: ObjectId
      },
      content: {
        type: String
      },
      date: {
        type: Number,
      },
    }]
  },
});

PlanSchema.index({
  userid: 1
});
PlanSchema.index({
  designerid: 1
});

mongoose.model('Plan', PlanSchema);
