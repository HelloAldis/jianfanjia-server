var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var QuotationSchema = new Schema({ // 报价
  userid: {
    type: ObjectId // 业主id
  },
  house_area: {
    type: Number, // 房屋面积
    default: 0
  },

  sections: [{
    name: {
      type: String // 项目
    },
    count: {
      type: Number, // 数量
      default: 0
    },
    area: {
      type: Number, // 面积
      default: 0
    },
    base_price: {
      type: Number, // 基础价格
      default: 0
    },
    main_price: {
      type: Number, // 主材价格
      default: 0
    }
  }],
  create_at: {
    type: Number // 创建时间
  },
  lastupdate: {
    type: Number // 更新时间
  },
});

QuotationSchema.index({
  userid: 1
});

mongoose.model('Quotation', QuotationSchema);
