var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../../proxy').User;
var Plan = require('../../../proxy').Plan;
var Requirement = require('../../../proxy').Requirement;
var Designer = require('../../../proxy').Designer;
var Process = require('../../../proxy').Process;
var Evaluation = require('../../../proxy').Evaluation;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../apiconfig');
var ApiUtil = require('../../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var type = require('../../../type');
var async = require('async');
var sms = require('../../../common/sms');
var designer_match_util = require('../../../common/designer_match');

exports.user_my_requirement_list = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var ep = eventproxy();
  ep.fail(next);

  Requirement.find({
    userid: userid
  }, null, ep.done(function (requirements) {
    if (requirements.length > 0) {
      async.mapLimit(requirements, 3, function (requirement, callback) {
        requirement = requirement.toObject();
        if (requirement.order_designerids && requirement.order_designerids.length > 0) {
          Designer.find({
            _id: {
              $in: requirement.order_designerids,
            },
          }, {
            username: 1,
            imageid: 1,
            auth_type: 1,
          }, null, ep.done(function (designers) {
            async.mapLimit(designers, 3, function (designer,
              callback) {
              Plan.find({
                designerid: designer._id,
                requirementid: requirement._id,
              }, {
                status: 1
              }, {
                skip: 0,
                limit: 1,
                sort: {
                  last_status_update_time: -1
                },
              }, function (err, plans) {
                designer = designer.toObject();
                designer.plan = plans[0];
                callback(err, designer);
              });
            }, ep.done(function (designers) {
              requirement.order_designers = designers;
              callback(null, requirement);
            }));
          }));
        } else if (requirement.rec_designerids && requirement.rec_designerids
          .length > 0) {
          Designer.find({
            _id: {
              $in: requirement.rec_designerids,
            },
          }, {
            username: 1,
            imageid: 1,
            auth_type: 1,
          }, null, ep.done(function (designers) {
            requirement.rec_designers = designers;
            _.forEach(requirement.rec_designers, function (
              designer) {
              designer_match_util.designer_match(designer,
                requirement);
            });
            callback(null, requirement);
          }));
        } else {
          callback(null, requirement);
        }
      }, ep.done(function (requirements) {
        async.mapLimit(requirements, 3, function (requirement,
          callback) {
          if (requirement.status === type.requirement_status_config_process || requirement.status ===
            type.requirement_status_done_process) {
            Process.findOne({
              requirementid: requirement._id,
            }, {
              _id: 1
            }, function (err, process) {
              requirement.process = process;
              callback(err, requirement);
            });
          } else {
            callback(null, requirement);
          }
        }, ep.done(function (requirements) {
          res.sendData(requirements);
        }));
      }));
    } else {
      res.sendData([]);
    }
  }));
}

exports.designer_get_user_requirements = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var ep = eventproxy();
  ep.fail(next);

  Requirement.find({
    order_designerids: designerid,
  }, null, {
    lean: true
  }, ep.done(function (requirements) {
    async.mapLimit(requirements, 3, function (requirement, callback) {
      async.parallel({
        plan: function (callback) {
          Plan.find({
            designerid: designerid,
            requirementid: requirement._id,
          }, {
            status: 1,
            request_date: 1,
            house_check_time: 1,
            last_status_update_time: 1,
            reject_respond_msg: 1,
            total_price: 1,
            duration: 1,
          }, {
            skip: 0,
            limit: 1,
            sort: {
              last_status_update_time: -1
            },
            lean: true,
          }, function (err, plans) {
            callback(err, plans[0]);
          });
        },
        evaluation: function (callback) {
          Evaluation.findOne({
            userid: requirement.userid,
            designerid: requirement.designerid,
            requirementid: requirement._id,
          }, null, function (err, evaluation) {
            if (evaluation) {
              callback(err, evaluation);
            } else {
              callback(err, undefined);
            }
          });
        },
        user: function (callback) {
          User.findOne({
            _id: requirement.userid
          }, {
            username: 1,
            imageid: 1,
            sex: 1,
            phone: 1,
          }, callback);
        },
      }, function (err, result) {
        requirement.user = result.user;
        requirement.evaluation = result.evaluation;
        requirement.plan = result.plan;
        callback(err, requirement);
      });
    }, ep.done(function (requirements) {
      Designer.findOne({
        _id: designerid
      }, {
        username: 1,
        imageid: 1,
        service_attitude: 1,
        respond_speed: 1,
      }, ep.done(function (designer) {
        requirements = requirements.map(function (o) {
          o.designer = designer;
          return o;
        });
        res.sendData(requirements);
      }));
    }));
  }));
}
