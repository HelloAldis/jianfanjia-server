var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../proxy').User;
var Plan = require('../../proxy').Plan;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../config');
var async = require('async');
var ApiUtil = require('../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports.add = function (req, res, next) {
  var plan = ApiUtil.buildPlan(req);
  var user = req.user || req.session.user;
  plan.userid = user._id;

  Plan.newAndSave(plan, function (err) {
    if (err) {
      return next(err);
    }

    res.send({msg: '添加成功'});
  });
};

exports.update = function (req, res, next) {
  var plan = ApiUtil.buildPlan(req);
  var oid = tools.trim(req.body._id);

  if (oid === '') {
    res.send({msg: '信息不完全'});
    return;
  }

  Plan.updateByQuery({_id: oid}, plan, function (err) {
    if (err) {
      return next(err);
    }

    res.send({msg: '更新成功'});
  });
}

exports.delete = function (req, res, next) {
  var user = req.user || req.session.user;
  var oid = tools.trim(req.body._id);

  if (oid === '') {
    res.send({msg: '信息不完全'});
    return;
  }

  Plan.removeOneByQuery({_id: new ObjectId(oid)}, function (err) {
    if (err) {
      return next(err);
    }

    res.send({msg: '删除成功'});
  });
}

exports.list = function (req, res, next) {
  var user = req.user || req.session.user;

  if (user.type === '1') {
    Plan.getPlansByUserid(user._id, function (err, plans) {
      if (err) {
        return next(err);
      }

      async.mapLimit(plans, 3, function (p) {
        User.getUserById({_id: p.designerid}, function (err, designer_indb) {
          if (err) {
            return next(err);
          }

          var designer = {};
          designer.username = designer_indb.username;
          p.designer = designer;
        });
      }, function (err, results) {
        if (err) {
          return next(err);
        }

        res.send({
          data: plans
        });
      });
    });
  } else if(user.type === '2') {
    Plan.getPlansByDesignerid(user._id, function (err, plans) {
      if (err) {
        return next(err);
      }

      async.mapLimit(plans, 3, function (p) {
        User.getUserById({_id: p.userid}, function (err, user_indb) {
          if (err) {
            return next(err);
          }

          var user = {};
          user.username = user_indb.username;
          p.user = user;
        });
      }, function (err, results) {
        if (err) {
          return next(err);
        }

        res.send({
          data: plans
        });
      });
    });
  }
}

exports.userMyPlan = function (req, res, next) {

}

exports.finalPlan = function (req, res, next) {

}

exports.designerMyPlan = function (req, res, next) {

}
