var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TempUserSchema = new Schema({
  name: {
    type: String
  },
  phone: {
    type: String
  },
  district: {
    type: String
  },
  house_area: {
    type: Number,
    default: 0
  },
  total_price: {
    type: Number,
    default: 0
  },
  create_at: {
    type: Number
  },
});

mongoose.model('TempUser', TempUserSchema);
