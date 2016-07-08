var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ProcessSchema = new Schema({ // 工地
  userid: {
    type: ObjectId // 业主id
  },
  final_designerid: {
    type: ObjectId // 最终设计师id
  },
  final_planid: {
    type: ObjectId // 最终方案id
  },
  requirementid: {
    type: ObjectId // 需求id
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
  basic_address: {
    type: String // 基础地址
  },
  detail_address: {
    type: String // 详细地址
  },
  house_type: {
    type: String // 户型
  },
  house_area: {
    type: Number, // 房屋面积
    default: 0
  },
  dec_style: {
    type: String // 装修风格
  },
  work_type: {
    type: String // 包公类型
  },
  total_price: {
    type: Number, // 总价
    default: 0
  },
  business_house_type: {
    type: String // 商装房屋类型
  },
  dec_type: {
    type: String // 装修类型
  },
  start_at: {
    type: Number, // 开工日期
  },
  duration: {
    type: Number // 工期
  },
  going_on: {
    type: String // 当前工序
  },
  create_at: {
    type: Number // 创建时间
  },
  lastupdate: {
    type: Number // 最后更新时间
  },

  sections: [{
    name: {
      type: String // 工序id
    },
    label: {
      type: String // 工序名
    },
    start_at: {
      type: Number // 开始时间
    },
    end_at: {
      type: Number // 结束时间
    },
    status: {
      type: String, // 状态
      default: '1'
    },
    items: [{
      name: {
        type: String // 小节点id
      },
      label: {
        type: String // 小节点名字
      },
      date: {
        type: Number // 更新时间
      },
      status: {
        type: String, // 状态
        default: '0'
      },
      images: {
        type: [ObjectId] // 图片id
      },
      comment_count: {
        type: Number, // 评论数
        default: 0,
      },
    }],
    ys: {
      date: {
        type: Number, // 验收时间
      },
      images: {
        type: [{
          key: {
            type: String // 验收图id
          },
          imageid: {
            type: ObjectId // 验收图
          },
        }]
      },
    },
  }],

});

ProcessSchema.index({
  userid: 1
});
ProcessSchema.index({
  final_designerid: 1
});

mongoose.model('Process', ProcessSchema);
