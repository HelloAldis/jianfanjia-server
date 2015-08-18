var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var FavoriteSchema = new Schema({
  userid: {type: ObjectId},
  favorite_product: {type: [ObjectId]},
});

FavoriteSchema.index({userid: 1}, {unique: true});

mongoose.model('Favoriate', FavoriteSchema);
