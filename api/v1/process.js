var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../proxy').User;
var Reschedule = require('../../proxy').Reschedule;
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
  process.sections[1].items = [];
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
  process.sections[2].items = [];
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
  process.sections[3].items = [];
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
  process.sections[3].ys = {};
  process.sections[3].ys.images = [];

  process.sections[4] = {}
  process.sections[4].name = type.process_section_you_qi;
  process.sections[4].status = type.process_item_status_new;
  process.sections[4].items = [];
  process.sections[4].items[0] = {};
  process.sections[4].items[0].name = type.process_you_qi_item_mqqsg;
  process.sections[4].items[0].status = type.process_item_status_new;
  process.sections[4].items[1] = {};
  process.sections[4].items[1].name = type.process_you_qi_item_qmjccl;
  process.sections[4].items[1].status = type.process_item_status_new;
  process.sections[4].ys = {};
  process.sections[4].ys.images = [];

  process.sections[5] = {}
  process.sections[5].name = type.process_section_an_zhuang;
  process.sections[5].status = type.process_item_status_new;
  process.sections[5].items = [];
  process.sections[5].items[0] = {};
  process.sections[5].items[0].name = type.process_an_zhuang_item_mdbmmaz;
  process.sections[5].items[0].status = type.process_item_status_new;
  process.sections[5].items[1] = {};
  process.sections[5].items[1].name = type.process_an_zhuang_item_cgscaz;
  process.sections[5].items[1].status = type.process_item_status_new;
  process.sections[5].items[2] = {};
  process.sections[5].items[2].name = type.process_an_zhuang_item_mbdjaz;
  process.sections[5].items[2].status = type.process_item_status_new;
  process.sections[5].items[3] = {};
  process.sections[5].items[3].name = type.process_an_zhuang_item_yjzjaz;
  process.sections[5].items[3].status = type.process_item_status_new;
  process.sections[5].items[4] = {};
  process.sections[5].items[4].name = type.process_an_zhuang_item_scaz;
  process.sections[5].items[4].status = type.process_item_status_new;
  process.sections[5].items[5] = {};
  process.sections[5].items[5].name = type.process_an_zhuang_item_cwddaz;
  process.sections[5].items[5].status = type.process_item_status_new;
  process.sections[5].items[6] = {};
  process.sections[5].items[6].name = type.process_an_zhuang_item_qzpt;
  process.sections[5].items[6].status = type.process_item_status_new;
  process.sections[5].items[7] = {};
  process.sections[5].items[7].name = type.process_an_zhuang_item_snzl;
  process.sections[5].items[7].status = type.process_item_status_new;
  process.sections[5].items[8] = {};
  process.sections[5].items[8].name = type.process_an_zhuang_item_jjaz;
  process.sections[5].items[8].status = type.process_item_status_new;
  process.sections[5].items[9] = {};
  process.sections[5].items[9].name = type.process_an_zhuang_item_wjaz;
  process.sections[5].items[9].status = type.process_item_status_new;
  process.sections[5].ys = {};
  process.sections[5].ys.images = [];

  process.sections[6] = {}
  process.sections[6].name = type.process_section_jun_gong;
  process.sections[6].status = type.process_item_status_new;
  process.sections[6].ys = {};
  process.sections[6].ys.images = [];

  var f = process.duration / config.duration_60;

  process.sections[0].start_at = process.start_at;
  process.sections[0].end_at = DateUtil.add(process.sections[0].start_at,
    config.duration_60_kai_gong, f);

  process.sections[1].start_at = process.sections[0].end_at;
  process.sections[1].end_at = DateUtil.add(process.sections[1].start_at,
    config.duration_60_chai_gai, f);

  process.sections[2].start_at = process.sections[1].end_at;
  process.sections[2].end_at = DateUtil.add(process.sections[2].start_at,
    config.duration_60_shui_dian, f);

  process.sections[3].start_at = process.sections[2].end_at;
  process.sections[3].end_at = DateUtil.add(process.sections[3].start_at,
    config.duration_60_ni_mu, f);

  process.sections[4].start_at = process.sections[3].end_at;
  process.sections[4].end_at = DateUtil.add(process.sections[4].start_at,
    config.duration_60_you_qi, f);

  process.sections[5].start_at = process.sections[4].end_at;
  process.sections[5].end_at = DateUtil.add(process.sections[5].start_at,
    config.duration_60_an_zhuang, f);

  process.sections[6].start_at = process.sections[5].end_at;
  process.sections[6].end_at = DateUtil.add(process.sections[6].start_at,
    config.duration_60_jun_gong, f);

  console.log(process);
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
  var content = tools.trim(req.body.content);
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

  Process.updateYsImage(_id, section, key, null, function (err, process) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
};

exports.reschedule = function (req, res, next) {
  var reschedule = ApiUtil.buildReschedule(req);

  if (usertype === type.role_user) {
    reschedule.status = type.process_item_status_reschedule_req_by_user;
  } else if (usertype === type.role_designer) {
    reschedule.status = type.process_item_status_reschedule_req_by_designer;
  }

  Reschedule.newAndSave(reschedule, function (err, reschedule) {
    if (err) {
      return next(err);
    }

    Process.updateStatus(reschedule.processid, reschedule.section, null,
      reschedule.status,
      function (err) {
        if (err) {
          return next(err);
        }

        res.sendSuccessMsg();
      });
  });
};

exports.doneItem = function (req, res, next) {
  var section = tools.trim(req.body.section);
  var item = tools.trim(req.body.item);
  var _id = req.body._id;

  if (!item) {
    return res.sendErrMsg('item 不能空')
  }

  //TODO start next section
  Process.updateStatus(_id, section, item, type.process_item_status_done,
    function (err) {
      if (err) {
        return next(err);
      }

      res.sendSuccessMsg();
    });
};

exports.doneSection = function (req, res, next) {
  var section = tools.trim(req.body.section);
  var _id = req.body._id;

  Process.updateStatus(_id, section, null, type.process_item_status_done,
    function (err) {
      if (err) {
        return next(err);
      }

      //开启下个流程
      var index = _.indexOf(type.process_work_flow, section);
      var next = type.process_work_flow[index + 1];
      if (next) {
        Process.updateStatus(_id, next, null, type.process_item_status_going,
          function (err) {
            if (err) {
              return next(err);
            }

            res.sendSuccessMsg()
          });
      } else {
        res.sendSuccessMsg();
      }
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
      return process.toObject();
    });

    ep.emit('processes', ps);
  });

}
