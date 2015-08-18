var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var VerifyCodeSchema = new Schema({
  phone: {type: String},
  code:{type: String},
});

VerifyCodeSchema.index({phone: 1}, {unique: true});

mongoose.model('VerifyCode', VerifyCodeSchema);
