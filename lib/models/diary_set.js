var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var DiarySetSchema = new Schema({ // 日记本
  authorid: {
    type: ObjectId // 作者
  },
  usertype: {
    type: String // 作者用户类型
  },
  cover_imageid: {
    type: ObjectId // 封面
  },
  title: {
    type: String // 标题
  },
  house_area: {
    type: Number, //面积
    default: 0
  },
  house_type: {
    type: String // 户型
  },
  dec_style: {
    type: String //装修风格
  },
  work_type: {
    type: String //包工类型
  },
  latest_section_label: {
    type: String // 最新阶段
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
    type: Number, // 关注数
    default: 0
  }
});

DiarySetSchema.index({
  authorid: 1
});

mongoose.model('DiarySet', DiarySetSchema);
