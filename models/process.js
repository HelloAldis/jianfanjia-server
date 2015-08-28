var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ProcessSchema = new Schema({
  userid: {
    type: ObjectId
  },
  final_designerid: {
    type: ObjectId
  },
  province: {
    type: String
  },
  city: {
    type: String
  },
  district: {
    type: String
  },
  cell: {
    type: String
  },
  house_type: {
    type: String
  },
  house_area: {
    type: Number,
    default: 0
  },
  dec_style: {
    type: String
  },
  work_type: {
    type: String
  },
  total_price: {
    type: Number,
    default: 0
  },

  start_at: {
    type: Number,
  },
  duration: {
    type: Number
  },
  going_on: {
    type: String
  },

  kai_gong: {
    start_at: {
      type: Number
    },
    end_at: {
      type: Number
    },
    status: {
      type: String,
      default: '1'
    },
    xcjd: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    cgdyccl: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    qdzmjcl: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    sgxcl: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    mdbcl: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    kgmbslcl: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
  },

  chai_gai: {
    start_at: {
      type: Number
    },
    end_at: {
      type: Number
    },
    status: {
      type: String,
      default: '0'
    },
    cpbh: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    ztcg: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    qpcc: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
  },

  shui_dian: {
    start_at: {
      type: Number
    },
    end_at: {
      type: Number
    },
    status: {
      type: String,
      default: '0'
    },
    sdsg: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    ntsg: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    ys: {
      images: {
        type: [{
          key: {
            type: String
          },
          imageid: {
            type: ObjectId
          },
        }]
      },
    },
  },

  ni_mu: {
    start_at: {
      type: Number
    },
    end_at: {
      type: Number
    },
    status: {
      type: String,
      default: '0'
    },
    sgxaz: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    cwqfssg: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    cwqdzsg: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    ktytzsg: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    dmzp: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    ddsg: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    gtsg: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    ys: {
      images: {
        type: [{
          key: {
            type: String
          },
          imageid: {
            type: ObjectId
          },
        }]
      },
    },
  },

  you_qi: {
    start_at: {
      type: Number
    },
    end_at: {
      type: Number
    },
    status: {
      type: String,
      default: '0'
    },
    yqsg: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    qmjccl: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    ys: {
      images: {
        type: [{
          key: {
            type: String
          },
          imageid: {
            type: ObjectId
          },
        }]
      },
    },
  },

  an_zhuang: {
    start_at: {
      type: Number
    },
    end_at: {
      type: Number
    },
    status: {
      type: String,
      default: '0'
    },
    scaz: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    jjaz: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    cwddaz: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    wjaz: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    cgscaz: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    yjzjaz: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    mdbmmaz: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    qzpt: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    mbdjaz: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    snzl: {
      date: {
        type: Number
      },
      status: {
        type: String,
        default: '0'
      },
      images: {
        type: [ObjectId]
      },
      comments: {
        type: [{
          by: {
            type: ObjectId
          },
          content: {
            type: String
          },
          date: {
            type: Number,

          },
        }]
      },
    },
    ys: {
      images: {
        type: [{
          key: {
            type: String
          },
          imageid: {
            type: ObjectId
          },
        }]
      },
    },
  },

  jun_gong: {
    start_at: {
      type: Number
    },
    end_at: {
      type: Number
    },
    status: {
      type: String,
      default: '0'
    },
    ys: {
      images: {
        type: [{
          key: {
            type: String
          },
          imageid: {
            type: ObjectId
          },
        }]
      },
    },
  },

});

ProcessSchema.index({
  userid: 1
});
ProcessSchema.index({
  final_designerid: 1
});

mongoose.model('Process', ProcessSchema);
