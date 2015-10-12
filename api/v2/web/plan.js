var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../../proxy').User;
var Plan = require('../../../proxy').Plan;
var Requirement = require('../../../proxy').Requirement;
var Designer = require('../../../proxy').Designer;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../config');
var async = require('async');
var ApiUtil = require('../../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var type = require('../../../type');

exports.add = function (req, res, next) {
  var plan = ApiUtil.buildPlan(req);
  var designerid = ApiUtil.getUserid(req);
  var userid = tools.trim(req.body.userid);
  var requirementid = tools.trim(req.body.requirementid);
  var ep = eventproxy();
  ep.fail(next);

  //如果已经对需求提交过
  Plan.findOne({
    userid: userid,
    designerid: designerid,
    requirementid: requirementid,
    status: type.plan_status_designer_respond,
  }, null, null, ep.done(function (plan_indb) {
    if (plan_indb) {
      //有已响应但是没上传的方案，直接上传方案到这里
      plan.status = type.plan_status_desinger_upload; //修改status为已上传
      plan.last_status_update_time = new Date().getTime();
      var query = {
        userid: userid,
        designerid: designerid,
        requirementid: requirementid,
        status: type.plan_status_designer_respond,
      };

      Plan.setOne(query, plan, null, ep.done(function () {
        Requirement.setOne({
          _id: requirementid,
          status: type.requirement_status_respond_no_plan
        }, {
          status: type.requirement_status_plan_not_final
        }, null, ep.done(function () {
          res.sendSuccessMsg();
        }));
      }));
    } else {
      //创建新的方案
      plan.status = type.plan_status_desinger_upload;
      plan.designerid = designerid;
      plan.userid = new ObjectId(userid);
      plan.requirementid = new ObjectId(requirementid);
      Plan.newAndSave(plan, ep.done(function () {
        res.sendSuccessMsg();
      }));
    }
  }));
};

exports.update = function (req, res, next) {
  var plan = ApiUtil.buildPlan(req);
  var oid = tools.trim(req.body._id);
  var designerid = ApiUtil.getUserid(req);
  var ep = eventproxy();
  ep.fail(next);

  if (oid === '') {
    res.sendErrMsg('信息不完全');
    return;
  }

  Plan.setOne({
    _id: oid,
    designerid: designerid
  }, plan, null, ep.done(function () {
    res.sendSuccessMsg();
  }));
}

exports.delete = function (req, res, next) {
  var user = req.user || req.session.user;
  var oid = tools.trim(req.body._id);
  var designerid = ApiUtil.getUserid(req);
  var ep = eventproxy();
  ep.fail(next);

  if (oid === '') {
    res.sendErrMsg('信息不完全');
    return;
  }

  Plan.removeOne({
    _id: oid,
    designerid: designerid
  }, null, ep.done(function () {
    res.sendSuccessMsg();
  }));
}

exports.user_requirement_plans = function (req, res, next) {
  var requirementid = tools.trim(req.body.requirementid);
  var ep = eventproxy();
  ep.fail(next);

  Plan.find({
    requirementid: requirementid,
    status: {
      // $in: [type.plan_status_user_final, type.plan_status_user_not_final,
      //   type.plan_status_desinger_upload
      // ]
    }
  }, null, null, ep.done(function (plans) {
    async.mapLimit(plans, 3, function (plan, callback) {
      Designer.findOne({
        _id: plan.designerid
      }, {
        username: 1
      }, function (err, designer) {
        plan = plan.toObject();
        plan.designer = designer;
        callback(err, plan);
      });
    }, ep.done(function (results) {
      res.sendData(results);
    }));
  }));
}

exports.finalPlan = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var planid = tools.trim(req.body.planid);
  var designerid = new ObjectId(req.body.designerid);
  var requirementid = new ObjectId(req.body.requirementid);
  var ep = eventproxy();
  ep.fail(next);

  Requirement.setOne({
    _id: requirementid,
    status: type.requirement_status_plan_not_final,
  }, {
    final_designerid: designerid,
    final_planid: planid,
    status: type.requirement_status_final_plan,
  }, null, ep.done(function (requirement) {
    if (requirement) {
      //标记方案为中标
      Plan.setOne({
        _id: planid,
        userid: userid
      }, {
        status: type.plan_status_user_final,
        last_status_update_time: new Date().getTime(),
      }, {}, ep.done(function (plan) {
        if (plan) {
          Designer.incOne({
            _id: designerid
          }, {
            deal_done_count: 1
          }, {});
        }

        res.sendSuccessMsg();
      }));

      Plan.update({
        requirementid: requirement._id,
        _id: {
          $ne: planid
        },
      }, {
        status: type.plan_status_user_not_final,
        last_status_update_time: new Date().getTime(),
      }, {
        multi: true
      }, function (err, plan) {});
    }
  }));
}

exports.designer_requirement_plans = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var requirementid = new ObjectId(req.body.requirementid);
  var ep = eventproxy();
  ep.fail(next);

  Plan.find({
    designerid: designerid,
    requirementid: requirementid,
    status: {
      $in: [type.plan_status_user_final, type.plan_status_user_not_final,
        type.plan_status_desinger_upload
      ]
    }
  }, null, null, ep.done(function (plans) {
    async.mapLimit(plans, 3, function (plan, callback) {
      User.findOne({
        _id: plan.userid
      }, {
        username: 1
      }, function (err, user) {
        plan = plan.toObject();
        plan.user = user;
        callback(err, plan);
      });
    }, ep.done(function (results) {
      res.sendData(results);
    }));
  }));
}

exports.addCommentForPlan = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var planid = tools.trim(req.body.planid);
  var comment = ApiUtil.buildComment(req);
  comment.by = userid;
  comment.usertype = ApiUtil.getUsertype(req);
  comment.date = new Date().getTime();
  var ep = eventproxy();
  ep.fail(next);

  Plan.push({
    _id: planid
  }, comment, null, ep.done(function () {
    res.sendSuccessMsg();
  }));
}

exports.getOne = function (req, res, next) {
  var _id = req.params._id;
  var ep = eventproxy();
  ep.fail(next);

  Plan.findOne({
    _id: _id
  }, null, ep.done(function (plan) {
    res.sendData(plan);
  }));
}
