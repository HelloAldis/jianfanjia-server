var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var FavoriteSchema = new Schema({
  userid: {
    type: ObjectId // 用户id
  },
  favorite_product: {
    type: [ObjectId] // 收藏作品列表
  },
  favorite_designer: {
    type: [ObjectId] // 收藏设计师列表
  },
  favorite_beautiful_image: {
    type: [ObjectId] // 收藏美图列表
  },
  favorite_diary: {
    type: [ObjectId] // 点赞日记列表
  },
  favorite_diary_set: {
    type: [ObjectId] // 关注日记本列表
  }
});

FavoriteSchema.index({
  userid: 1
}, {
  unique: true
});

mongoose.model('Favorite', FavoriteSchema);
