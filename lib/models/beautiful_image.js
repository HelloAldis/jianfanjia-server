var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var BeautifulImageSchema = new Schema({ // 装修美图
  title: {
    type: String // 标题
  },
  description: {
    type: String // 描述
  },
  keywords: {
    type: String // 关键字
  },
  images: {
    type: {
      imageid: {
        type: ObjectId // 美图里面的图片id
      },
      width: {
        type: Number // 图片宽
      },
      height: {
        type: Number // 图片高
      }
    }
  },
  dec_type: {
    type: String // 装修类型
  },
  house_type: {
    type: String // 户型
  },
  dec_style: {
    type: String // 装修风格
  },
  section: {
    type: String // 空间
  },
  authorid: {
    type: String // 作者id
  },
  usertype: {
    type: String // 作者类型
  },
  status: {
    type: String // 状态
  },
  create_at: {
    type: Number // 创建时间
  },
  lastupdate: {
    type: Number // 最后更新时间
  },
  view_count: {
    type: Number, // 浏览数
    default: 0
  },
  favorite_count: {
    type: Number, // 收藏数
    default: 0
  }
});

BeautifulImageSchema.index({
  topicid: 1
});

mongoose.model('BeautifulImage', BeautifulImageSchema);
