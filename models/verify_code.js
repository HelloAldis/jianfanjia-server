var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VerifyCodeSchema = new Schema({
  phone: {
    type: String
  },
  code: {
    type: String
  },
  create_at: {
    type: Date,
    expires: 60 * 5
  },
});

VerifyCodeSchema.index({
  phone: 1
}, {
  unique: true
});

mongoose.model('VerifyCode', VerifyCodeSchema);
