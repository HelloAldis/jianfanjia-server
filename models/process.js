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
  final_planid: {
    type: ObjectId
  },
  requirementid: {
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

  sections: [{
    name: {
      type: String
    },
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
    items: [{
      name: {
        type: String
      },
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
          usertype: {
            type: String,
          },
          content: {
            type: String
          },
          date: {
            type: Number,
          },
        }]
      },
    }],
    ys: {
      date: {
        type: Number,
      },
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
  }],

});

ProcessSchema.index({
  userid: 1
});
ProcessSchema.index({
  final_designerid: 1
});

mongoose.model('Process', ProcessSchema);
