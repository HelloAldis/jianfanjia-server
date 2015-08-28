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
    type: Date
  },
  duration: {
    type: Number
  },
  going_on: {
    type: String
  },

  kai_gong: {
    start_at: {
      type: Date
    },
    end_at: {
      type: Date
    },
    status: {
      type: String,
      default: '1'
    },
    xcjd: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
    cgdyccl: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
    qdzmjcl: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
    sgxcl: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
    mdbcl: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
    kgmbslcl: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
  },

  chai_gai: {
    start_at: {
      type: Date
    },
    end_at: {
      type: Date
    },
    status: {
      type: String,
      default: '0'
    },
    cpbh: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
    ztcg: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
    qpcc: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
  },

  shui_dian: {
    start_at: {
      type: Date
    },
    end_at: {
      type: Date
    },
    status: {
      type: String,
      default: '0'
    },
    sdsg: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
    ntsg: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
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
      type: Date
    },
    end_at: {
      type: Date
    },
    status: {
      type: String,
      default: '0'
    },
    sgxaz: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
    cwqfssg: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
    cwqdzsg: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
    ktytzsg: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
    dmzp: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
    ddsg: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
    gtsg: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
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
      type: Date
    },
    end_at: {
      type: Date
    },
    status: {
      type: String,
      default: '0'
    },
    yqsg: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
    qmjccl: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
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
      type: Date
    },
    end_at: {
      type: Date
    },
    status: {
      type: String,
      default: '0'
    },
    scaz: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
    jjaz: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
    cwddaz: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
    wjaz: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
    cgscaz: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
    yjzjaz: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
    mdbmmaz: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
    qzpt: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
    mbdjaz: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
          },
        }]
      },
    },
    snzl: {
      date: {
        type: Date
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
            type: Date,
            default: Date.now
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
      type: Date
    },
    end_at: {
      type: Date
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
