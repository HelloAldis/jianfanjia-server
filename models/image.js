var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var ImageSchema = new Schema({
  md5:{type: String},
  data: {type: Buffer},
  userid: {type: String},
});

mongoose.model('Image', ImageSchema);
