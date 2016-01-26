var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../../proxy').User;
var Reschedule = require('../../../proxy').Reschedule;
var Requirement = require('../../../proxy').Requirement;
var Process = require('../../../proxy').Process;
var Designer = require('../../../proxy').Designer;
var Plan = require('../../../proxy').Plan;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../apiconfig');
var ApiUtil = require('../../../common/api_util');
var DateUtil = require('../../../common/date_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var type = require('../../../type');
var async = require('async');
var gt = require('../../../getui/gt.js');

exports.start = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var requirementid = req.body.requirementid;
  var final_planid = req.body.final_planid;
  var ep = eventproxy();
  ep.fail(next);

  if ([requirementid, final_planid, req.body.requirementid]
    .some(function (item) {
      return !item ? true : false;
    })) {
    res.sendErrMsg('信息不完整。')
    return;
  }

  async.parallel({
    requirement: function (callback) {
      Requirement.setOne({
        _id: requirementid,
        status: type.requirement_status_config_contract,
      }, {
        status: type.requirement_status_config_process
      }, null, callback);
    },
    plan: function (callback) {
      Plan.findOne({
        _id: final_planid
      }, {
        duration: 1
      }, callback);
    }
  }, ep.done(function (result) {
    if (result.requirement && result.plan) {
      var process = {};
      process.final_designerid = result.requirement.final_designerid;
      process.final_planid = result.requirement.final_planid;
      process.requirementid = result.requirement._id;
      process.province = result.requirement.province;
      process.city = result.requirement.city;
      process.district = result.requirement.district;
      process.cell = result.requirement.cell;
      process.house_type = result.requirement.house_type;
      process.business_house_type = result.requirement.business_house_type;
      process.house_area = result.requirement.house_area;
      process.dec_style = result.requirement.dec_style;
      process.work_type = result.requirement.work_type;
      process.total_price = result.requirement.total_price;
      process.start_at = result.requirement.start_at;
      process.duration = result.plan.duration;

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
      process.sections[0].items[1].name = type.process_kai_gong_item_cgdyccl;
      process.sections[0].items[1].status = type.process_item_status_new;
      process.sections[0].items[2] = {};
      process.sections[0].items[2].name = type.process_kai_gong_item_qdzmjcl;
      process.sections[0].items[2].status = type.process_item_status_new;
      process.sections[0].items[3] = {};
      process.sections[0].items[3].name = type.process_kai_gong_item_sgxcl;
      process.sections[0].items[3].status = type.process_item_status_new;
      process.sections[0].items[4] = {};
      process.sections[0].items[4].name = type.process_kai_gong_item_mdbcl;
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
      process.sections[3].items[0].name = type.process_ni_mu_item_sgxaz;
      process.sections[3].items[0].status = type.process_item_status_new;
      process.sections[3].items[1] = {};
      process.sections[3].items[1].name = type.process_ni_mu_item_cwqfssg;
      process.sections[3].items[1].status = type.process_item_status_new;
      process.sections[3].items[2] = {};
      process.sections[3].items[2].name = type.process_ni_mu_item_cwqdzsg;
      process.sections[3].items[2].status = type.process_item_status_new;
      process.sections[3].items[3] = {};
      process.sections[3].items[3].name = type.process_ni_mu_item_ktytzsg;
      process.sections[3].items[3].status = type.process_item_status_new;
      process.sections[3].items[4] = {};
      process.sections[3].items[4].name = type.process_ni_mu_item_dmzp;
      process.sections[3].items[4].status = type.process_item_status_new;
      process.sections[3].items[5] = {};
      process.sections[3].items[5].name = type.process_ni_mu_item_ddsg;
      process.sections[3].items[5].status = type.process_item_status_new;
      process.sections[3].items[6] = {};
      process.sections[3].items[6].name = type.process_ni_mu_item_gtsg;
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
      process.sections[4].items[1].name = type.process_you_qi_item_qmrjq;
      process.sections[4].items[1].status = type.process_item_status_new;
      process.sections[4].ys = {};
      process.sections[4].ys.images = [];

      process.sections[5] = {}
      process.sections[5].name = type.process_section_an_zhuang;
      process.sections[5].status = type.process_item_status_new;
      process.sections[5].items = [];
      process.sections[5].items[0] = {};
      process.sections[5].items[0].name = type.process_an_zhuang_item_scaz;
      process.sections[5].items[0].status = type.process_item_status_new;
      process.sections[5].items[1] = {};
      process.sections[5].items[1].name = type.process_an_zhuang_item_jjaz;
      process.sections[5].items[1].status = type.process_item_status_new;
      process.sections[5].items[2] = {};
      process.sections[5].items[2].name = type.process_an_zhuang_item_cwddaz;
      process.sections[5].items[2].status = type.process_item_status_new;
      process.sections[5].items[3] = {};
      process.sections[5].items[3].name = type.process_an_zhuang_item_wjaz;
      process.sections[5].items[3].status = type.process_item_status_new;
      process.sections[5].items[4] = {};
      process.sections[5].items[4].name = type.process_an_zhuang_item_cgscaz;
      process.sections[5].items[4].status = type.process_item_status_new;
      process.sections[5].items[5] = {};
      process.sections[5].items[5].name = type.process_an_zhuang_item_yjzjaz;
      process.sections[5].items[5].status = type.process_item_status_new;
      process.sections[5].items[6] = {};
      process.sections[5].items[6].name = type.process_an_zhuang_item_mdbmmaz;
      process.sections[5].items[6].status = type.process_item_status_new;
      process.sections[5].items[7] = {};
      process.sections[5].items[7].name = type.process_an_zhuang_item_qzpt;
      process.sections[5].items[7].status = type.process_item_status_new;
      process.sections[5].items[8] = {};
      process.sections[5].items[8].name = type.process_an_zhuang_item_mbdjaz;
      process.sections[5].items[8].status = type.process_item_status_new;
      process.sections[5].items[9] = {};
      process.sections[5].items[9].name = type.process_an_zhuang_item_snzl;
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

      Process.newAndSave(process, ep.done(function (process_indb) {
        res.sendData(process_indb);
      }));
    } else {
      res.sendErrMsg('配置工地失败');
    }
  }));
}

exports.addImage = function (req, res, next) {
  var section = tools.trim(req.body.section);
  var item = tools.trim(req.body.item);
  var imageid = new ObjectId(req.body.imageid);
  var _id = req.body._id;
  var ep = eventproxy();
  ep.fail(next);

  Process.addImage(_id, section, item, imageid, ep.done(function (process) {

    if (process) {
      var s = _.find(process.sections, function (o) {
        return o.name === section;
      });
      if (s) {
        var i = _.find(s.items, function (o) {
          return o.name === item;
        });

        if (i && i.status === type.process_item_status_new) {
          Process.updateStatus(_id, section, item, type.process_item_status_going,
            function () {});
        }
      }
    }
    res.sendSuccessMsg();
  }));
};

exports.add_images = function (req, res, next) {
  var section = tools.trim(req.body.section);
  var item = tools.trim(req.body.item);
  var images = req.body.images || [];
  images = images.map(function (o) {
    return new ObjectId(o);
  });
  var _id = req.body._id;
  var ep = eventproxy();
  ep.fail(next);

  Process.add_images(_id, section, item, images, ep.done(function (process) {

    if (process) {
      var s = _.find(process.sections, function (o) {
        return o.name === section;
      });
      if (s) {
        var i = _.find(s.items, function (o) {
          return o.name === item;
        });

        if (i && i.status === type.process_item_status_new) {
          Process.updateStatus(_id, section, item, type.process_item_status_going,
            function () {});
        }
      }
    }
    res.sendSuccessMsg();
  }));
};

exports.delete_image = function (req, res, next) {
  var section = tools.trim(req.body.section);
  var item = tools.trim(req.body.item);
  var index = req.body.index;
  var _id = req.body._id;
  var ep = eventproxy();
  ep.fail(next);

  Process.deleteImage(_id, section, item, index, ep.done(function (process) {
    res.sendSuccessMsg();
  }));
};

exports.addYsImage = function (req, res, next) {
  if (!req.body.imageid) {
    return res.sendErrMsg('缺少Image');
  }

  var section = tools.trim(req.body.section);
  var key = tools.trim(req.body.key);
  var imageid = new ObjectId(req.body.imageid);
  var _id = req.body._id;
  var ep = eventproxy();
  ep.fail(next);

  Process.updateYsImage(_id, section, key, imageid, ep.done(function (process) {
    if (process) {
      res.sendSuccessMsg();
    } else {
      //没有更新的 创建新的
      Process.addYsImage(_id, section, key, imageid, ep.done(function () {
        res.sendSuccessMsg();
      }));
    }
  }));
}

exports.deleteYsImage = function (req, res, next) {
  var section = tools.trim(req.body.section);
  var key = tools.trim(req.body.key);
  var _id = req.body._id;
  var ep = eventproxy();
  ep.fail(next);

  Process.deleteYsImage(_id, section, key, ep.done(function (process) {
    res.sendSuccessMsg();
  }));
};

function buildMessage(usertype, user, designer, reschedule, msg) {
  var id = '';
  var name = '';
  if (usertype === type.role_user) {
    name = user.username || user.phone;
    name = '业主' + name;
    id = designer._id;
  } else if (usertype === type.role_designer) {
    name = designer.username || designer.phone;
    name = '设计师' + name;
    id = user._id;
  }
  // var content = name + '向您提出了一个延期提醒, 希望可以延期到' + DateUtil.YYYY_MM_DD(
  // reschedule.new_date);
  var content = name + msg + DateUtil.YYYY_MM_DD(reschedule.new_date);

  return {
    id: id,
    content: content
  };
}

function buildProcurement(section) {
  var index = _.indexOf(type.process_work_flow, section);
  var message = type.procurement_notification_message[index];
  var next = type.process_work_flow[index + 1];

  return {
    next: next,
    message: message,
  };
}

function buildPay() {
  return {
    message: '您即将进入下一轮付款环节，简繁家工作人员将会和您联系'
  };
}

exports.reschedule = function (req, res, next) {
  var reschedule = ApiUtil.buildReschedule(req);
  var usertype = ApiUtil.getUsertype(req);
  reschedule.request_role = usertype;
  reschedule.status = type.process_item_status_reschedule_req_new;
  var ep = eventproxy();
  ep.fail(next);

  ep.on('sendMessage', function (process) {
    User.findOne({
      _id: reschedule.userid
    }, null, ep.done(function (user) {
      Designer.findOne({
        _id: reschedule.designerid
      }, {
        _id: 1,
        username: 1
      }, ep.done(function (designer) {
        var json = buildMessage(usertype, user, designer,
          reschedule, '向您提出了改期, 希望可以将验收改期到');
        var playload = {
          content: json.content,
          type: type.message_type_reschedule,
          time: new Date().getTime(),
          section: reschedule.section,
          status: reschedule.status,
          cell: process.cell,
          processid: process._id,
        };
        if (usertype === type.role_user) {
          gt.pushMessageToDesigner(json.id, playload);
        } else if (usertype === type.role_designer) {
          gt.pushMessageToUser(json.id, playload)
        }
      }));
    }));
  });

  Reschedule.findOne({
    processid: reschedule.processid,
    status: type.process_item_status_reschedule_req_new,
  }, null, ep.done(function (reschedule_indb) {
    if (reschedule_indb) {
      return res.sendErrMsg('对方已经申请改期！');
    }

    Reschedule.newAndSave(reschedule, ep.done(function (reschedule) {
      if (reschedule) {
        Process.updateStatus(reschedule.processid, reschedule.section,
          null, reschedule.status, ep.done(function (process) {
            res.sendSuccessMsg();
            ep.emit('sendMessage', process);
          }));
      } else {
        res.sendErrMsg('无法保存成功');
      }
    }));
  }));
};

exports.listReschdule = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var usertype = ApiUtil.getUsertype(req);
  var query = {};
  var ep = eventproxy();
  ep.fail(next);

  if (usertype === type.role_user) {
    query.userid = userid;
  } else if (usertype === type.role_designer) {
    query.designerid = userid;
  }

  Reschedule.find(query, null, {
    sort: {
      request_date: -1
    }
  }, ep.done(function (reschedules) {
    async.mapLimit(reschedules, 3, function (reschedule, callback) {
      Process.findOne({
        _id: reschedule.processid,
      }, {
        cell: 1
      }, function (err, process) {
        reschedule = reschedule.toObject();
        reschedule.process = process;
        callback(err, reschedule);
      });
    }, ep.done(function (reschedules) {
      res.sendData(reschedules);
    }));
  }));
}

exports.okReschedule = function (req, res, next) {
  var usertype = ApiUtil.getUsertype(req);
  var query = {};
  var userid = ApiUtil.getUserid(req);
  query.processid = req.body.processid;
  query.status = type.process_item_status_reschedule_req_new;
  var ep = eventproxy();
  ep.fail(next);

  ep.on('sendMessage', function (reschedule, process) {
    User.findOne({
      _id: reschedule.userid
    }, null, ep.done(function (user) {
      Designer.findOne({
        _id: reschedule.designerid
      }, {
        _id: 1,
        username: 1
      }, ep.done(function (designer) {
        var json = buildMessage(usertype, user, designer,
          reschedule, '同意了您的改期, 验收将改期到');
        var playload = {
          content: json.content,
          type: type.message_type_reschedule,
          time: new Date().getTime(),
          section: reschedule.section,
          status: type.process_item_status_reschedule_ok,
          cell: process.cell,
          processid: process._id,
        };
        if (usertype === type.role_user) {
          gt.pushMessageToDesigner(json.id, playload);
        } else if (usertype === type.role_designer) {
          gt.pushMessageToUser(json.id, playload)
        }
      }));
    }));
  });

  if (usertype === type.role_user) {
    query.userid = userid;
    query.request_role = type.role_designer;
  } else if (usertype === type.role_designer) {
    query.designerid = userid;
    query.request_role = type.role_user;
  }

  Reschedule.find(query, null, {
    sort: {
      request_date: -1,
    },
    skip: 0,
    limit: 1,
  }, ep.done(function (reschedules) {
    if (reschedules.length < 1) {
      return res.sendErrMsg('改期不存在');
    }
    var reschedule = reschedules[0];

    var newDate = reschedule.new_date;
    var index = _.indexOf(type.process_work_flow, reschedule.section);
    Process.findOne({
      _id: reschedule.processid
    }, null, ep.done(function (process) {
      if (process) {
        if (process.sections[index].start_at >= newDate) {
          res.sendErrMsg('无法改期到比开始还早');
        } else {
          var diff = newDate - process.sections[index].end_at;
          process.sections[index].end_at = newDate;
          process.sections[index].status = type.process_item_status_reschedule_ok;
          for (var i = index + 1; i < process.sections.length; i++) {
            process.sections[i].start_at += diff;
            process.sections[i].end_at += diff;
          }

          process.save(ep.done(function () {
            res.sendSuccessMsg();
            ep.emit('sendMessage', reschedule, process);
          }));

          reschedule.status = type.process_item_status_reschedule_ok;
          reschedule.save(function () {});
        }
      } else {
        res.sendErrMsg('工地不存在');
      }
    }));
  }));
}

exports.rejectReschedule = function (req, res, next) {
  var usertype = ApiUtil.getUsertype(req);
  var query = {};
  var userid = ApiUtil.getUserid(req);
  if (!req.body.processid) {
    return res.sendErrMsg('缺少processid');
  }

  query.processid = req.body.processid;
  query.status = type.process_item_status_reschedule_req_new;
  var ep = eventproxy();
  ep.fail(next);

  ep.on('sendMessage', function (reschedule, process) {
    User.findOne({
      _id: reschedule.userid
    }, null, ep.done(function (user) {
      Designer.findOne({
        _id: reschedule.designerid
      }, {
        _id: 1,
        username: 1
      }, ep.done(function (designer) {
        var json = buildMessage(usertype, user, designer,
          reschedule, '拒绝了您的改期, 无法改期到');
        var playload = {
          content: json.content,
          type: type.message_type_reschedule,
          time: new Date().getTime(),
          section: reschedule.section,
          status: type.process_item_status_reschedule_reject,
          cell: process.cell,
          processid: process._id,
        };

        if (usertype === type.role_user) {
          gt.pushMessageToDesigner(json.id, playload);
        } else if (usertype === type.role_designer) {
          gt.pushMessageToUser(json.id, playload)
        }
      }));
    }));
  });

  if (usertype === type.role_user) {
    query.userid = userid;
    query.request_role = type.role_designer;
  } else if (usertype === type.role_designer) {
    query.designerid = userid;
    query.request_role = type.role_user;
  }

  Reschedule.setOne(query, {
    status: type.process_item_status_reschedule_reject
  }, {
    sort: {
      request_date: -1,
    },
  }, ep.done(function (reschedule) {
    if (!reschedule) {
      return res.sendErrMsg('改期不存在');
    }

    Process.updateStatus(query.processid, reschedule.section, null,
      type.process_item_status_reschedule_reject,
      ep.done(function (process) {
        res.sendSuccessMsg();
        ep.emit('sendMessage', reschedule, process);
      }));
  }));
}

exports.doneItem = function (req, res, next) {
  var section = tools.trim(req.body.section);
  var item = tools.trim(req.body.item);
  var _id = req.body._id;
  var ep = eventproxy();
  ep.fail(next);

  if (!item) {
    return res.sendErrMsg('item 不能空')
  }

  Process.updateStatus(_id, section, item, type.process_item_status_done,
    ep.done(function (process) {
      if (process) {
        //push notification
        if ((process.work_type === type.work_type_half) &&
          (section !== type.process_section_kai_gong && section !== type.process_section_jun_gong)
        ) {
          var result = _.find(process.sections, function (o) {
            return o.name === section;
          });
          var doneCount = 0;
          _.forEach(result.items, function (e) {
            if (e.status === type.process_item_status_done) {
              doneCount += 1;
            }
          });

          if (result.items.length - doneCount <= 2) {
            var json = buildProcurement(section);
            gt.pushMessageToUser(process.userid, {
              content: json.message,
              section: json.next,
              cell: process.cell,
              type: type.message_type_procurement,
              time: new Date().getTime(),
              processid: process._id,
            });
          }
        } else if ((process.work_type === type.work_type_all) && (section !== type.process_section_kai_gong &&
            section !== type.process_section_jun_gong)) {
          var result = _.find(process.sections, function (o) {
            return o.name === section;
          });
          var doneCount = 0;
          _.forEach(result.items, function (e) {
            if (e.status === type.process_item_status_done) {
              doneCount += 1;
            }
          });

          if (result.items.length - doneCount <= 2) {
            var json = buildProcurement(section);
            gt.pushMessageToDesigner(process.designerid, {
              content: json.message,
              section: json.next,
              cell: process.cell,
              type: type.message_type_procurement,
              time: new Date().getTime(),
              processid: process._id,
            });
          }
        }

        if (section === type.process_section_kai_gong || section === type
          .process_section_chai_gai) {
          var result = _.find(process.sections, function (o) {
            return o.name === section;
          });
          var doneCount = 0;
          _.forEach(result.items, function (e) {
            if (e.status === type.process_item_status_done) {
              doneCount += 1;
            }
          });

          //开工拆改 开启下个流程
          if (result.items.length - doneCount <= 1) {
            var index = _.indexOf(type.process_work_flow, section);
            var next = type.process_work_flow[index + 1];
            //结束当前工序
            Process.updateStatus(_id, section, null, type.process_item_status_done,
              ep.done(function () {
                Process.updateStatus(_id, next, null, type.process_item_status_going,
                  ep.done(function () {
                    res.sendSuccessMsg()
                  }));
              }));
          } else {
            res.sendSuccessMsg();
          }
        } else {
          res.sendSuccessMsg();
        }
      } else {
        res.sendSuccessMsg();
      }
    }));
};

exports.doneSection = function (req, res, next) {
  var section = tools.trim(req.body.section);
  var _id = req.body._id;
  var ep = eventproxy();
  ep.fail(next);

  Process.updateStatus(_id, section, null, type.process_item_status_done,
    ep.done(function (process) {
      if (process) {
        var json = buildPay();
        gt.pushMessageToUser(process.userid, {
          content: json.message,
          section: section,
          type: type.message_type_pay,
          time: new Date().getTime(),
          cell: process.cell,
          processid: process._id,
        });
      }

      //开启下个流程
      var index = _.indexOf(type.process_work_flow, section);
      var next = type.process_work_flow[index + 1];
      if (next && next !== type.process_section_done) {
        Process.updateStatus(_id, next, null, type.process_item_status_going,
          ep.done(function () {
            res.sendSuccessMsg()
          }));
      } else {
        res.sendSuccessMsg();
      }
    }));
};

exports.getOne = function (req, res, next) {
  var _id = req.params._id;
  var ep = eventproxy();
  ep.fail(next);

  Process.findOne({
    _id: _id
  }, null, ep.done(function (process) {
    if (process) {
      Reschedule.findOne({
        processid: _id,
        status: type.process_item_status_reschedule_req_new,
      }, ep.done(function (reschedule) {
        if (reschedule) {
          var index = _.indexOf(type.process_work_flow,
            reschedule.section);
          process = process.toObject();
          process.sections[index].reschedule = reschedule;
          res.sendData(process);
        } else {
          res.sendData(process);
        }
      }));
    } else {
      res.sendErrMsg('工地不存在')
    }
  }));
}

exports.list = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var usertype = ApiUtil.getUsertype(req);
  var ep = eventproxy();
  ep.fail(next);

  ep.on('processes', function (processes) {
    async.mapLimit(processes, 3, function (process, callback) {
      async.parallel({
        user: function (callback) {
          User.findOne({
            _id: process.userid
          }, {
            username: 1,
            imageid: 1,
            phone: 1,
          }, callback);
        },
        plan: function (callback) {
          Plan.findOne({
            _id: process.final_planid
          }, null, callback)
        },
        requirement: function (callback) {
          Requirement.findOne({
            _id: process.requirementid
          }, null, callback);
        }
      }, function (err, result) {
        process.user = result.user;
        process.plan = result.plan;
        process.requirement = result.requirement;
        callback(err, process);
      });

    }, ep.done(function (results) {
      res.sendData(results);
    }));
  });

  var query = {};
  if (usertype === type.role_user) {
    query.userid = userid;
  } else if (usertype === type.role_designer) {
    query.final_designerid = userid;
  }

  Process.find(query, {
    final_designerid: 1,
    userid: 1,
    city: 1,
    district: 1,
    cell: 1,
    going_on: 1,
    final_planid: 1,
    requirementid: 1,
    lastupdate: 1,
    start_at: 1,
  }, {
    lean: true
  }, ep.done(function (processes) {
    ep.emit('processes', processes);
  }));
}

exports.ys = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var section = tools.trim(req.body.section);
  var _id = req.body._id;
  var ep = eventproxy();
  ep.fail(next);

  Process.findOne({
    _id: _id
  }, null, ep.done(function (process) {
    if (process) {
      gt.pushMessageToUser(process.userid, {
        content: '设计师已经上传所有验收图片，您可以前往对比验收',
        type: type.message_type_user_ys,
        time: new Date().getTime(),
        section: section,
        cell: process.cell,
        processid: process._id,
      });
    }

    res.sendSuccessMsg();
  }));
}
