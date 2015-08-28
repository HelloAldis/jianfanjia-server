var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../proxy').User;
var Plan = require('../../proxy').Plan;
var Requirement = require('../../proxy').Requirement;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../config');
var async = require('async');
var ApiUtil = require('../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var type = require('../../type');

exports.add = function (req, res, next) {
  var plan = ApiUtil.buildPlan(req);
  var designerid = ApiUtil.getUserid(req);
  var userid = tools.trim(req.body.userid);
  var ep = eventproxy();

  ep.fail(next);
  ep.on('requirement', function (requirement) {
    //如果已经对需求提交过
    Plan.getStatus2PlanByUseridDesigneridRequirementid(userid, designerid,
      requirement._id,
      function (err, plan_indb) {
        if (err) {
          return next(err);
        }

        if (plan_indb) {
          //有已响应但是没上传的方案，直接上传方案到这里
          plan.status = type.plan_status_desinger_upload; //修改status为已上传
          var query = {
            userid: userid,
            designerid: designerid,
            requirementid: requirement._id,
            status: type.plan_status_designer_respond,
          };

          Plan.updateByQuery(query, plan, function (err) {
            if (err) {
              return next(err);
            }

            res.sendSuccessMsg();
          });
        } else {
          //创建新的方案
          plan.status = type.plan_status_desinger_upload;
          plan.designerid = new ObjectId(designerid);
          plan.userid = new ObjectId(userid);
          plan.requirementid = requirement._id;
          Plan.newAndSave(plan, function (err) {
            if (err) {
              return next(err);
            }

            res.sendSuccessMsg();
          });
        }
      });
  });

  Requirement.getRequirementByUserid(userid, function (err, requirement) {
    if (err) {
      return next(err);
    }

    if (requirement) {
      ep.emit('requirement', requirement);
    } else {
      return res.sendErrMsg('需求不完整');
    }
  });
};

exports.update = function (req, res, next) {
  var plan = ApiUtil.buildPlan(req);
  var oid = tools.trim(req.body._id);
  var designerid = ApiUtil.getUserid(req);

  if (oid === '') {
    res.sendErrMsg('信息不完全');
    return;
  }

  Plan.updateByQuery({
    _id: oid,
    designerid: designerid
  }, plan, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
}

exports.delete = function (req, res, next) {
  var user = req.user || req.session.user;
  var oid = tools.trim(req.body._id);
  var designerid = ApiUtil.getUserid(req);

  if (oid === '') {
    res.sendErrMsg('信息不完全');
    return;
  }

  Plan.removeOneByQuery({
    _id: oid,
    designerid: designerid
  }, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
}

exports.userMyPlan = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);

  Plan.getPlansByUserid(userid, function (err, plans) {
    if (err) {
      return next(err);
    }

    res.sendData(plans);
  });
}

exports.finalPlan = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var planid = tools.trim(req.body.planid);
  var designerid = new ObjectId(req.body.designerid);

  Requirement.updateByUserid(userid, {
    $set: {
      final_designerid: designerid
    }
  }, function (err) {
    if (err) {
      return next(err);
    }

    Plan.updateByQuery({
        _id: planid,
        userid: userid
      }, {
        status: type.plan_status_user_final
      },
      function (err) {
        if (err) {
          return next(err);
        }

        res.sendSuccessMsg();
      });
  });
}

exports.designerMyPlan = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);

  Plan.getPlansByDesignerid(designerid, function (err, plans) {
    if (err) {
      return next(err);
    }

    res.sendData(plans);
  });
}

exports.addCommentForPlan = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var planid = tools.trim(req.body.planid);
  var comment = ApiUtil.buildComment(req);
  comment.by = userid;
  comment.date = new Date();

  Plan.addComment(planid, comment, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
}

exports.getOne = function (req, res, next) {
  var _id = req.params._id;

  Plan.getOneById(_id, function (err, plan) {
    if (err) {
      return next(err);
    }

    res.sendData(plan);
  });
}
