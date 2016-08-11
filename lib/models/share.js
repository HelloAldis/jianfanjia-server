var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ShareSchema = new Schema({ // 装修直播
  userid: {
    type: ObjectId // 业主id
  },
  designerid: {
    type: ObjectId // 设计师id
  },
  cover_imageid: {
    type: ObjectId // 封面图id
  },
  manager: {
    type: String // 经理
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
  house_area: {
    type: Number // 面积
  },
  dec_style: {
    type: String // 装修风格
  },
  dec_type: {
    type: String // 装修类型
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
  process: {
    type: [{
      name: {
        type: String // 工序
      },
      description: {
        type: String // 描述
      },
      images: {
        type: [ObjectId] // 图片id
      },
      date: {
        type: Number // 更新时间
      }
    }]
  },
  view_count: {
    type: Number, // 浏览数
    default: 0
  },
  lastupdate: {
    type: Number // 最后更新时间
  },
  start_at: {
    type: Number // 开工时间
  },
  status: {
    type: String, // 状态
    default: '0'
  },
  create_at: {
    type: Number // 创建时间
  },
  progress: {
    type: String, // 直播进程
    default: '0'
  }
});

mongoose.model('Share', ShareSchema);
