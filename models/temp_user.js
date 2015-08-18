var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var TempUserSchema = new Schema({
  name: { type: String},
  phone: {type: String},
});

mongoose.model('TempUser', TempUserSchema);
