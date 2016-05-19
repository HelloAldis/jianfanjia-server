var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ProductSchema = new Schema({
  designerid: {
    type: ObjectId // 设计师id
  },
  province: {
    type: String // 省
  },
  city: {
    type: String // 市
  },
  district: {
    type: String // 区
  },
  cell: {
    type: String // 小区
  },
  house_type: {
    type: String // 户型
  },
  business_house_type: {
    type: String // 商装户型
  },
  dec_type: {
    type: String, // 装修类型
  },
  house_area: {
    type: Number // 面积
  },
  dec_style: {
    type: String // 装修风格
  },
  work_type: {
    type: String // 包工类型
  },
  total_price: {
    type: Number // 总价
  },
  description: {
    type: String // 描述
  },
  images: { // 效果图
    type: [{
      section: {
        type: String // 空间
      },
      imageid: {
        type: ObjectId // 图片
      },
      description: {
        type: String // 描述
      },
    }]
  },
  plan_images: { // 平面图
    type: [{
      section: {
        type: String // 空间
      },
      imageid: {
        type: ObjectId // 图片
      },
      description: {
        type: String // 描述
      },
    }]
  },
  cover_imageid: {
    type: ObjectId // 封面
  },

  view_count: {
    type: Number, // 浏览数
    default: 0
  },
  favorite_count: {
    type: Number, // 收藏数
    default: 0
  },
  auth_type: {
    type: String, // 审核类型
    default: '0',
  },
  auth_date: {
    type: Number, // 审核时间
  },
  auth_message: {
    type: String, // 审核信息
  },
  create_at: {
    type: Number // 创建时间
  },
});

ProductSchema.index({
  designerid: 1
});

mongoose.model('Product', ProductSchema);
