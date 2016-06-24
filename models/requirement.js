var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var RequirementSchema = new Schema({
  userid: {
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
  basic_address: {
    type: String
  },
  detail_address: {
    type: String
  },

  street: {
    type: String // 废弃的
  },
  cell: {
    type: String // 废弃的
  },
  cell_phase: {
    type: String, // 废弃的
  },
  cell_building: {
    type: String, // 废弃的
  },
  cell_unit: {
    type: String, // 废弃的
  },
  cell_detail_number: {
    type: String, // 废弃的
  },


  house_type: {
    type: String
  },
  business_house_type: {
    type: String
  },
  house_area: {
    type: Number,
    default: 0
  },
  dec_style: {
    type: String
  },
  dec_type: {
    type: String
  },
  prefer_sex: {
    type: String
  },
  work_type: {
    type: String
  },
  total_price: {
    type: Number,
    default: 0
  },
  rec_designerids: {
    type: [ObjectId]
  },
  order_designerids: {
    type: [ObjectId]
  },
  obsolete_designerids: {
    type: [ObjectId]
  },
  final_designerid: {
    type: ObjectId
  },
  final_planid: {
    type: ObjectId,
  },
  family_description: {
    type: String,
  },
  communication_type: {
    type: String,
    default: '0'
  },
  status: {
    type: String,
    default: '0',
  },
  create_at: {
    type: Number
  },
  start_at: {
    type: Number
  },
  last_status_update_time: {
    type: Number,
  },
  package_type: {
    type: String,
    default: '0'
  },
  platform_type: {
    type: String
  }
});

RequirementSchema.index({
  userid: 1
});

mongoose.model('Requirement', RequirementSchema);
