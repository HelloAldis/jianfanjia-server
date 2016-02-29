var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var DesignerMessageSchema = new Schema({
  designerid: {
    type: ObjectId
  },
  title: {
    type: String
  },
  content: {
    type: String
  },
  create_at: {
    type: Number,
  },
  status: {
    type: String,
  }
});

DesignerMessageSchema.index({
  designerid: 1
});

mongoose.model('DesignerMessage', DesignerMessageSchema);
