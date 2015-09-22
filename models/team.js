var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TeamSchema = new Schema({
  designerid: {
    type: ObjectId
  },
  manager: {
    type: String
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
  work_year: {
    type: Number
  },
  good_at: {
    type: String
  },
  working_on: {
    type: String
  },
  sex: {
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
});

TeamSchema.index({
  designerid: 1
});

mongoose.model('Team', TeamSchema);
