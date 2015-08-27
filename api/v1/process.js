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

exports.start = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var process = ApiUtil.buildProcess(req);
  process.userid = userid;
  process.going_on = type.process_section_kai_gong;

  process.kai_gong = {};
  process.kai_gong.status = type.process_item_status_going;
  process.kai_gong.xcjd = {};
  process.kai_gong.xcjd.status = type.process_item_status_new;
  process.kai_gong.cgdyccl = {};
  process.kai_gong.cgdyccl.status = type.process_item_status_new;
  process.kai_gong.qdzmjcl = {};
  process.kai_gong.qdzmjcl.status = type.process_item_status_new;
  process.kai_gong.sgxcl = {};
  process.kai_gong.sgxcl.status = type.process_item_status_new;
  process.kai_gong.mdbcl = {};
  process.kai_gong.mdbcl.status = type.process_item_status_new;
  process.kai_gong.kgmbslcl = {};
  process.kai_gong.kgmbslcl.status = type.process_item_status_new;

  process.chai_gai = {};
  process.chai_gai.cpbh = {};
  process.chai_gai.cpbh.status = type.process_item_status_new;
  process.chai_gai.ztcg = {};
  process.chai_gai.ztcg.status = type.process_item_status_new;
  process.chai_gai.qpcc = {};
  process.chai_gai.qpcc.status = type.process_item_status_new;

  process.shui_dian = {};
  process.shui_dian.sdsg = {};
  process.shui_dian.sdsg.status = type.process_item_status_new;
  process.shui_dian.ntsg = {};
  process.shui_dian.ntsg.status = type.process_item_status_new;
  process.shui_dian.ys = {};

  process.ni_mu = {};
  process.ni_mu.sgxaz = {};
  process.ni_mu.sgxaz.status = type.process_item_status_new;
  process.ni_mu.cwqfssg = {};
  process.ni_mu.cwqfssg.status = type.process_item_status_new;
  process.ni_mu.cwqdzsg = {};
  process.ni_mu.cwqdzsg.status = type.process_item_status_new;
  process.ni_mu.ktytzsg = {};
  process.ni_mu.ktytzsg.status = type.process_item_status_new;
  process.ni_mu.dmzp = {};
  process.ni_mu.dmzp.status = type.process_item_status_new;
  process.ni_mu.ddsg = {};
  process.ni_mu.ddsg.status = type.process_item_status_new;
  process.ni_mu.gtsg = {};
  process.ni_mu.gtsg.status = type.process_item_status_new;
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

  Process.addYsImage(_id, section, key, imageid, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });


}

exports.deleteImage = function (req, res, next) {

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
