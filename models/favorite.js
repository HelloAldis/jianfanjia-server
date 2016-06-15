var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var FavoriteSchema = new Schema({
  userid: {
    type: ObjectId
  },
  favorite_product: {
    type: [ObjectId]
  },
  favorite_designer: {
    type: [ObjectId]
  },
  favorite_beautiful_image: {
    type: [ObjectId]
  },
  favorite_diary: {
    type: [ObjectId]
  }
});

FavoriteSchema.index({
  userid: 1
}, {
  unique: true
});

mongoose.model('Favorite', FavoriteSchema);
