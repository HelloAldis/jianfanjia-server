var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var TeamSchema = new Schema({
  designerid: {type: ObjectId},
  manager: {type: String},
  uid: {type: String},
  company: {type: String},
  work_year: {type: Number},
  good_at: {type: String},
  working_on: {type: String},
  sex: {type: String},
  hometown: {type: String},
});

mongoose.model('Team', TeamSchema);
