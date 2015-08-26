var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var CellSchema = new Schema({
  date: {type: Date},
  status: {type: String, default: '0'},
  images: {type: [ObjectId]},
  comments: {type: [{
    commentid :{type: String},
    comment_userid: {type: ObjectId},
    content: {type: String},
    date: {type: Date, default: Date.now},
  }]},
});

var CheckSchema = new Schema({
  images: {type: [{
    key: {type: String},
    imageid: {type: ObjectId},
  }]},
});

var ProcessSchema = new Schema({
  userid: {type: ObjectId},
  final_designerid: {type: ObjectId},
  province: {type: String},
  city: { type: String},
  district: { type: String},
  cell: {type: String},
  house_type: {type: String},
  house_area: {type: Number, default: 0},
  dec_style: {type: String},
  work_type: {type: String},
  total_price: {type: Number, default: 0},

  start_at: {type: Date},
  duration: {type: Number},
  going_on: {type: String},

  kai_gong: {
    start_at: {type: Date},
    end_at: {type: Date},
    status: {type: String, default: '0'},
    xcjd: {type: CellSchema},
    cgdyccl: {type: CellSchema},
    qdzmjcl: {type: CellSchema},
    sgxcl: {type: CellSchema},
    mdbcl: {type: CellSchema},
    kgmbslcl: {type: CellSchema},
  },

  chai_gai: {
    start_at: {type: Date},
    end_at: {type: Date},
    status: {type: String, default: '0'},
    cpbh: {type: CellSchema},
    ztcg: {type: CellSchema},
    qpcc: {type: CellSchema},
  },

  shui_dian: {
    start_at: {type: Date},
    end_at: {type: Date},
    status: {type: String, default: '0'},
    sdsg: {type: CellSchema},
    ntsg: {type: CellSchema},
    ys: {type: CheckSchema},
  },

  ni_mu: {
    start_at: {type: Date},
    end_at: {type: Date},
    status: {type: String, default: '0'},
    sgxaz: {type: CellSchema},
    cwqfssg: {type: CellSchema},
    ktytzsg: {type: CellSchema},
    dmzp: {type: CellSchema},
    ddsg: {type: CellSchema},
    gtsg: {type: CellSchema},
    ys: {type: CheckSchema},
  }

  you_qi: {
    start_at: {type: Date},
    end_at: {type: Date},
    status: {type: String, default: '0'},
    yqsg: {type: CellSchema},
    qmjccl: {type: CellSchema},
    ys: {type: CheckSchema},
  }

  an_zhuang: {
    start_at: {type: Date},
    end_at: {type: Date},
    status: {type: String, default: '0'},
    scaz: {type: CellSchema},
    jjaz: {type: CellSchema},
    cwddaz: {type: CellSchema},
    wjaz: {type: CellSchema},
    cgscaz: {type: CellSchema},
    yjzjaz: {type: CellSchema},
    mdbmmaz: {type: CellSchema},
    qzpt: {type: CellSchema},
    mbdjaz: {type: CellSchema},
    snzl: {type: CellSchema},
    ys: {type: CheckSchema},
  }

  jun_gong: {
    start_at: {type: Date},
    end_at: {type: Date},
    status: {type: String, default: '0'},
    ys: {type: CheckSchema},
  }

});

mongoose.model('Process', ProcessSchema);
