var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var DiarySchema = new Schema({ // 日记
  authorid: {
    type: ObjectId, // 作者
  },
  usertype: {
    type: String, // 作者用户类型
  },
  diarySetid: {
    type: ObjectId, // 日志集id
  },
  content: {
    type: String, // 内容
  },
  section_label: {
    type: String, // 阶段
  },
  images: { // 图
    type: [{
      imageid: {
        type: ObjectId // 图片id
      },
      width: {
        type: Number
      },
      height: {
        type: Number,
      },
    }]
  },
  create_at: {
    type: Number // 创建时间
  },
  lastupdate: {
    type: Number // 更新时间
  },
  view_count: {
    type: Number, // 浏览数
    default: 0
  },
  favorite_count: {
    type: Number, // 点赞数
    default: 0
  },
  comment_count: {
    type: Number, // 评论数
    default: 0
  }
});

DiarySchema.index({
  authorid: 1
});

mongoose.model('Diary', DiarySchema);
