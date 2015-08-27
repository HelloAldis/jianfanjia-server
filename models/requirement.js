var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var RequirementSchema = new Schema({
  userid: {type: ObjectId},
  province: {type: String},
  city: { type: String },
  district: {type: String},
  cell: {type: String},
  house_type: {type: String},
  house_area: {type: Number, default: 0},
  dec_style: {type: String},
  work_type: {type: String},
  total_price: {type: Number, default: 0},
  designerids: {type: [ObjectId]},
  rec_designerids: {type: [ObjectId]},
  final_designerid: {type: ObjectId},
});

RequirementSchema.index({
  userid: 1
};

mongoose.model('Requirement', RequirementSchema);
