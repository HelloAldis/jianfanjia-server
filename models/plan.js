var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var PlanSchema = new Schema({
  userid: { type: ObjectId},
  designerid: { type: ObjectId},
  requirementid: {type: ObjectId},
  duration: {type: String},
  total_price: {type: String},
  price_detail: {type: [{
    item: {type: String},
    price: {type: String},
  }]},
  description: {type: String},
  manager: {type: String},
  images: {type: [ObjectId]},
  status: {type: String, default: '0'},
  house_check_time: {type: Date},
  request_date: {type: Date, default: Date.now},
  comments: {type: [{
    commentid :{type: String},
    comment_userid: {type: ObjectId},
    content: {type: String},
    date: {type: Date, default: Date.now},
  }]},
});

mongoose.model('Plan', PlanSchema);
