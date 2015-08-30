var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../proxy').User;
var Plan = require('../../proxy').Plan;
var Requirement = require('../../proxy').Requirement;
var Process = require('../../proxy').Process;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../config');
var ApiUtil = require('../../common/api_util');
var DateUtil = require('../../common/date_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var type = require('../../type');
var async = require('async');

exports.start = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var process = ApiUtil.buildProcess(req);
  process.userid = userid;
  process.going_on = type.process_section_kai_gong;
  process.sections = [];

  process.sections[0] = {}
  process.sections[0].name = type.process_section_kai_gong;
  process.sections[0].status = type.process_item_status_going;
  process.sections[0].items = [];
  process.sections[0].items[0] = {};
  process.sections[0].items[0].name = type.process_kai_gong_item_xcjd;
  process.sections[0].items[0].status = type.process_item_status_new;
  process.sections[0].items[1] = {};
  process.sections[0].items[1].name = type.process_kai_gong_item_sgxcl;
  process.sections[0].items[1].status = type.process_item_status_new;
  process.sections[0].items[2] = {};
  process.sections[0].items[2].name = type.process_kai_gong_item_mdbcl;
  process.sections[0].items[2].status = type.process_item_status_new;
  process.sections[0].items[3] = {};
  process.sections[0].items[3].name = type.process_kai_gong_item_cgdyccl;
  process.sections[0].items[3].status = type.process_item_status_new;
  process.sections[0].items[4] = {};
  process.sections[0].items[4].name = type.process_kai_gong_item_qdzmjcl;
  process.sections[0].items[4].status = type.process_item_status_new;
  process.sections[0].items[5] = {};
  process.sections[0].items[5].name = type.process_kai_gong_item_kgmbslcl;
  process.sections[0].items[5].status = type.process_item_status_new;

  process.sections[1] = {}
  process.sections[1].name = type.process_section_chai_gai;
  process.sections[1].status = type.process_item_status_new;
  process.sections[1].items[0] = {};
  process.sections[1].items[0].name = type.process_chai_gai_item_cpbh;
  process.sections[1].items[0].status = type.process_item_status_new;
  process.sections[1].items[1] = {};
  process.sections[1].items[1].name = type.process_chai_gai_item_ztcg;
  process.sections[1].items[1].status = type.process_item_status_new;
  process.sections[1].items[2] = {};
  process.sections[1].items[2].name = type.process_chai_gai_item_qpcc;
  process.sections[1].items[2].status = type.process_item_status_new;


  process.sections[2] = {}
  process.sections[2].name = type.process_section_shui_dian;
  process.sections[2].status = type.process_item_status_new;
  process.sections[2].items[0] = {};
  process.sections[2].items[0].name = type.process_shui_dian_item_sdsg;
  process.sections[2].items[0].status = type.process_item_status_new;
  process.sections[2].items[1] = {};
  process.sections[2].items[1].name = type.process_shui_dian_item_ntsg;
  process.sections[2].items[1].status = type.process_item_status_new;
  process.sections[2].ys = {};
  process.sections[2].ys.images = [];

  process.sections[3] = {}
  process.sections[3].name = type.process_section_ni_mu;
  process.sections[3].status = type.process_item_status_new;
  process.sections[3].items[0] = {};
  process.sections[3].items[0].name = type.process_ni_mu_item_dmzp;
  process.sections[3].items[0].status = type.process_item_status_new;
  process.sections[3].items[1] = {};
  process.sections[3].items[1].name = type.process_ni_mu_item_ddsg;
  process.sections[3].items[1].status = type.process_item_status_new;
  process.sections[3].items[2] = {};
  process.sections[3].items[2].name = type.process_ni_mu_item_gtsg;
  process.sections[3].items[2].status = type.process_item_status_new;
  process.sections[3].items[3] = {};
  process.sections[3].items[3].name = type.process_ni_mu_item_sgxaz;
  process.sections[3].items[3].status = type.process_item_status_new;
  process.sections[3].items[4] = {};
  process.sections[3].items[4].name = type.process_ni_mu_item_cwqfssg;
  process.sections[3].items[4].status = type.process_item_status_new;
  process.sections[3].items[5] = {};
  process.sections[3].items[5].name = type.process_ni_mu_item_cwqdzsg;
  process.sections[3].items[5].status = type.process_item_status_new;
  process.sections[3].items[6] = {};
  process.sections[3].items[6].name = type.process_ni_mu_item_ktytzsg;
  process.sections[3].items[6].status = type.process_item_status_new;

  process.sections[4] = {}
  process.sections[4].name = type.process_section_you_qi;
  process.sections[4].status = type.process_item_status_new;
  process.sections[3] = {}
  process.sections[3].name = type.process_section_an_zhuang;
  process.sections[3].status = type.process_item_status_new;
  process.sections[0] = {}
  process.sections[0].name = type.process_section_jun_gong;
  process.sections[0].status = type.process_item_status_new;



  process.chai_gai = {};


  process.shui_dian = {};

  process.shui_dian.ys = {};

  process.ni_mu = {};

  process.ni_mu.ys = {};

  process.you_qi = {};
  process.you_qi.yqsg = {};
  process.you_qi.yqsg.status = type.process_item_status_new;
  process.you_qi.qmjccl = {};
  process.you_qi.qmjccl.status = type.process_item_status_new;
  process.you_qi.ys = {};

  process.an_zhuang = {};
  process.an_zhuang.scaz = {};
  process.an_zhuang.scaz.status = type.process_item_status_new;
  process.an_zhuang.jjaz = {};
  process.an_zhuang.jjaz.status = type.process_item_status_new;
  process.an_zhuang.cwddaz = {};
  process.an_zhuang.cwddaz.status = type.process_item_status_new;
  process.an_zhuang.wjaz = {};
  process.an_zhuang.wjaz.status = type.process_item_status_new;
  process.an_zhuang.cgscaz = {};
  process.an_zhuang.cgscaz.status = type.process_item_status_new;
  process.an_zhuang.yjzjaz = {};
  process.an_zhuang.yjzjaz.status = type.process_item_status_new;
  process.an_zhuang.mdbmmaz = {};
  process.an_zhuang.mdbmmaz.status = type.process_item_status_new;
  process.an_zhuang.qzpt = {};
  process.an_zhuang.qzpt.status = type.process_item_status_new;
  process.an_zhuang.mbdjaz = {};
  process.an_zhuang.mbdjaz.status = type.process_item_status_new;
  process.an_zhuang.snzl = {};
  process.an_zhuang.snzl.status = type.process_item_status_new;
  process.an_zhuang.ys = {};

  process.jun_gong = {};
  process.jun_gong.ys = {};

  if (process.duration === 60) {
    process.kai_gong.start_at = process.start_at;
    process.kai_gong.end_at = DateUtil.add(process.kai_gong.start_at, config.duration_60_kai_gong);

    process.chai_gai.start_at = process.kai_gong.end_at;
    process.chai_gai.end_at = DateUtil.add(process.chai_gai.start_at, config.duration_60_chai_gai);

    process.shui_dian.start_at = process.chai_gai.end_at;
    process.shui_dian.end_at = DateUtil.add(process.shui_dian.start_at,
      config.duration_60_shui_dian);

    process.ni_mu.start_at = process.shui_dian.start_at;
    process.ni_mu.end_at = DateUtil.add(process.ni_mu.start_at, config.duration_60_ni_mu);

    process.you_qi.start_at = process.ni_mu.end_at;
    process.you_qi.end_at = DateUtil.add(process.you_qi.start_at, config.duration_60_you_qi);

    process.an_zhuang.start_at = process.you_qi.start_at;
    process.an_zhuang.end_at = DateUtil.add(process.an_zhuang.start_at,
      config.duration_60_an_zhuang);

    process.jun_gong.start_at = process.an_zhuang.end_at;
    process.jun_gong.end_at = DateUtil.add(process.jun_gong.start_at, config.duration_60_jun_gong);
  }

  Process.newAndSave(process, function (err, process_indb) {
    if (err) {
      return next(err);
    }

    res.sendData(process_indb);
  });
}

exports.addComment = function (req, res, next) {
  var section = tools.trim(req.body.section);
  var item = tools.trim(req.body.item);
  var content = new ObjectId(req.body.imageid);
  var _id = req.body._id;
  var userid = ApiUtil.getUserid(req);

  Process.addComment(_id, section, item, content, userid, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
};

exports.addImage = function (req, res, next) {
  var section = tools.trim(req.body.section);
  var item = tools.trim(req.body.item);
  var imageid = new ObjectId(req.body.imageid);
  var _id = req.body._id;

  Process.addImage(_id, section, item, imageid, function (err) {
    if (err) {
      return next(err);
    }

    Process.updateStatus(_id, section, item, type.process_item_status_going,
      function (err) {
        if (err) {
          return next(err);
        }

        res.sendSuccessMsg();
      });
  });
};

exports.addYsImage = function (req, res, next) {
  var section = tools.trim(req.body.section);
  var key = tools.trim(req.body.key);
  var imageid = new ObjectId(req.body.imageid);
  var _id = req.body._id;

  Process.updateYsImage(_id, section, key, imageid, function (err,
    process) {
    if (err) {
      return next(err);
    }

    if (process) {
      res.sendSuccessMsg();
    } else {
      //没有更新的 创建新的
      Process.addYsImage(_id, section, key, imageid, function (err) {
        if (err) {
          return next(err);
        }

        res.sendSuccessMsg();
      });
    }
  });
}

exports.deleteYsImage = function (req, res, next) {
  var section = tools.trim(req.body.section);
  var key = tools.trim(req.body.key);
  var _id = req.body._id;

  Process.deleteYsImage(_id, section, key, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
};

exports.reschedule = function (req, res, next) {

};

exports.done = function (req, res, next) {
  var section = tools.trim(req.body.section);
  var item = tools.trim(req.body.item);
  var _id = req.body._id;

  //TODO start next section
  Process.updateStatus(_id, section, item, type.process_item_status_done,
    function (err) {
      if (err) {
        return next(err);
      }

      res.sendSuccessMsg();
    });
};

exports.getOne = function (req, res, next) {
  var _id = req.params._id;

  Process.getProcessById(_id, function (err, process) {
    if (err) {
      return next(err);
    }

    res.sendData(process);
  });
}

exports.userGetOne = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);

  Process.getProcessByUserid(userid, function (err, process) {
    if (err) {
      return next(err);
    }

    res.sendData(process);
  });
}

exports.listForDesigner = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var ep = eventproxy();

  ep.fail(next);
  ep.on('processes', function (processes) {
    async.mapLimit(processes, 3, function (process, callback) {
      User.getOneByQueryAndProject({
        _id: process.userid
      }, {
        username: 1,
        imageid: 1,
        phone: 1,
      }, function (err, user) {
        process.user = user;
        callback(err, process);
      });
    }, function (err, results) {
      if (err) {
        return next(err);
      }

      res.sendData(results);
    });
  });

  Process.getSByQueryAndProject({
    final_designerid: designerid
  }, {
    userid: 1,
    city: 1,
    district: 1,
    cell: 1,
    going_on: 1,
  }, function (err, processes) {
    if (err) {
      return next(err);
    }

    var ps = _.map(processes, function (process) {
      var p = {};
      p.userid = process.userid;
      p.city = process.city;
      p.district = process.district;
      p.cell = process.cell;
      p.going_on = process.going_on;
      return p;
    });

    ep.emit('processes', ps);
  });

}
