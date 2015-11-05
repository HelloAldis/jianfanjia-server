var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../../proxy').User;
var Plan = require('../../../proxy').Plan;
var Requirement = require('../../../proxy').Requirement;
var Designer = require('../../../proxy').Designer;
var Evaluation = require('../../../proxy').Evaluation;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../apiconfig');
var ApiUtil = require('../../../common/api_util');
var DateUtil = require('../../../common/date_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var type = require('../../../type');
var async = require('async');
var sms = require('../../../common/sms');
var moment = require('moment');
var authMiddleWare = require('../../../middlewares/auth');

exports.user_my_info = function (req, res, next) {
  var userid = req.params._id || ApiUtil.getUserid(req);
  var ep = eventproxy();
  ep.fail(next);

  User.findOne({
    _id: userid
  }, {
    pass: 0,
    accessToken: 0,
  }, ep.done(function (user) {
    res.sendData(user);
  }));
}

exports.user_update_info = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var user = ApiUtil.buildUser(req);
  var ep = eventproxy();
  ep.fail(next);

  User.setOne({
    _id: userid
  }, user, {
    new: true
  }, ep.done(function (user) {
    authMiddleWare.gen_session(user, type.role_user, req, res);
    res.sendSuccessMsg();
  }));
};

exports.designers_can_order = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var requirementid = req.body.requirementid;
  var ep = eventproxy();
  ep.fail(next);

  async.parallel({
      requirement: function (callback) {
        Requirement.findOne({
          _id: requirementid
        }, null, callback);
      },
      favorite: function (callback) {
        Favorite.findOne({
          userid: userid
        }, null, callback);
      },
    },

    ep.done(function (result) {
      var can_order_rec = [];

      if (result.requirement && result.requirement.rec_designerids) {
        can_order_rec = _.filter(result.requirement.rec_designerids,
          function (oid) {
            return tools.findObjectId(result.requirement.order_designerids,
              oid) < 0;
          });
      }

      var can_order_fav = [];
      if (result.favorite && result.favorite.favorite_designers) {
        can_order_fav = _.filter(result.favorite.favorite_designers,
          function (oid) {
            return tools.findObjectId(result.requirement.order_designerids,
              oid) < 0 && tools.findObjectId(result.requirement.rec_designerids,
              oid) < 0;
          });
      }

      async.parallel({
        rec_designers: function (callback) {
          Designer.find({
            _id: {
              $in: can_order_rec
            }
          }, {
            username: 1,
            imageid: 1,
          }, null, callback);
        },
        favorite_designers: function (callback) {
          Designer.find({
            _id: {
              $in: can_order_fav
            }
          }, {
            username: 1,
            imageid: 1,
          }, null, callback);
        },
      }, ep.done(function (result) {
        res.sendData(result);
      }));
    }));
}


exports.order_designer = function (req, res, next) {
  var designerids = _.map(req.body.designerids, function (e) {
    return new ObjectId(e);
  });
  var requirementid = req.body.requirementid;
  var userid = ApiUtil.getUserid(req);
  var ep = eventproxy();
  ep.fail(next);

  async.waterfall([function (callback) {
    Requirement.findOne({
      _id: requirementid
    }, null, function (err, requirement) {
      callback(err, requirement);
    });
  }], ep.done(function (requirement) {
    if (requirement.status === type.requirement_status_new) {
      Requirement.setOne({
        _id: requirementid,
      }, {
        status: type.requirement_status_not_respond,
      }, null, function (err) {});
    }

    if (requirement.order_designerids.length + designerids.length > 3) {
      res.sendErrMsg('最多预约3个设计师');
    } else {
      _.forEach(designerids, function (designerid) {
        var json = {};
        json.designerid = designerid;
        json.userid = userid;
        json.requirementid = requirement._id;

        Plan.findOne({
          designerid: designerid,
          userid: userid,
          requirementid: requirement._id,
        }, null, ep.done(function (plan) {

          if (!plan) {
            Plan.newAndSave(json, ep.done(function (plan_indb) {}));

            Designer.incOne({
              _id: designerid
            }, {
              order_count: 1
            }, {});

            Designer.findOne({
              _id: designerid
            }, {
              phone: 1
            }, ep.done(function (designer) {
              if (designer) {
                User.findOne({
                  _id: userid
                }, {
                  username: 1,
                  phone: 1
                }, ep.done(function (user) {
                  sms.sendUserOrderDesigner(
                    designer.phone, [user.username]
                  );
                }));
              }
            }));
          }
        }));
      });

      Requirement.addToSet({
        _id: requirementid,
      }, {
        order_designerids: {
          $each: designerids
        }
      }, null, ep.done(function () {
        res.sendSuccessMsg();
      }));
    }
  }));
};

exports.user_change_ordered_designer = function (req, res, next) {
  var requirementid = req.body.requirementid;
  var userid = ApiUtil.getUserid(req);
  var old_designerid = new ObjectId(req.body.old_designerid);
  var new_designerid = new ObjectId(req.body.new_designerid);
  var ep = eventproxy();
  ep.fail(next);

  async.waterfall([function (callback) {
    Requirement.findOne({
      _id: requirementid
    }, null, function (err, requirement) {
      callback(err, requirement);
    });
  }], ep.done(function (requirement) {
    if (!requirement) {
      return res.sendErrMsg('需求不存在');
    }

    var json = {};
    json.designerid = new_designerid;
    json.userid = userid;
    json.requirementid = requirement._id;

    Plan.findOne(json, null, ep.done(function (plan) {
      if (!plan) {
        Plan.newAndSave(json, ep.done(function (plan_indb) {}));

        Designer.incOne({
          _id: new_designerid
        }, {
          order_count: 1
        }, {});

        Designer.findOne({
          _id: new_designerid
        }, {
          phone: 1
        }, ep.done(function (designer) {
          if (designer) {
            User.findOne({
              _id: userid
            }, {
              username: 1,
              phone: 1
            }, ep.done(function (user) {
              sms.sendUserOrderDesigner(
                designer.phone, [user.username]);
            }));
          }
        }));
      }
    }));

    Requirement.pull({
      _id: requirementid,
    }, {
      order_designerids: old_designerid
    }, null, ep.done(function () {
      Requirement.addToSet({
        _id: requirementid,
      }, {
        order_designerids: new_designerid,
      }, null, ep.done(function () {
        res.sendSuccessMsg();
      }));
    }));
  }));
}

exports.designer_house_checked = function (req, res, next) {
  var designerid = req.body.designerid
  var requirementid = req.body.requirementid;
  var ep = eventproxy();
  ep.fail(next);

  Plan.setOne({
    designerid: designerid,
    requirementid: requirementid,
    status: type.plan_status_designer_respond_no_housecheck,
  }, {
    status: type.plan_status_designer_housecheck_no_plan,
    last_status_update_time: new Date().getTime(),
  }, null, ep.done(function (plan) {
    if (plan) {
      Requirement.setOne({
        _id: plan.requirementid,
        status: type.requirement_status_respond_no_housecheck,
      }, {
        status: type.requirement_status_housecheck_no_plan
      }, null, function (err) {});

      Designer.findOne({
        _id: designerid
      }, {
        username: 1,
        phone: 1,
      }, function (err, designer) {
        sms.sendRemimdDesignerPlan(designer.phone, [designer.username]);
      });
    }

    res.sendSuccessMsg();
  }));
}

exports.user_evaluate_designer = function (req, res, next) {
  var evaluation = ApiUtil.buildEvaluation(req);
  evaluation.userid = ApiUtil.getUserid(req);
  var ep = eventproxy();
  ep.fail(next);

  Evaluation.setOne({
    userid: evaluation.userid,
    designerid: evaluation.designerid,
    requirementid: evaluation.requirementid,
  }, evaluation, {
    upsert: true,
  }, ep.done(function () {

    Evaluation.count({
      designerid: evaluation.designerid,
    }, ep.done(function (count) {
      Designer.findOne({
        _id: evaluation.designerid
      }, {
        service_attitude: 1,
        respond_speed: 1,
      }, ep.done(function (designer) {
        if (designer) {
          if (!designer.service_attitude) {
            designer.service_attitude = 0;
          }

          if (!designer.respond_speed) {
            designer.respond_speed = 0;
          }
          designer.service_attitude = ((designer.service_attitude *
              (count - 1)) + evaluation.service_attitude) /
            count;
          designer.respond_speed = ((designer.respond_speed *
              (count - 1)) + evaluation.respond_speed) /
            count;
          designer.save(ep.done(function () {
            res.sendSuccessMsg();
          }));
        } else {
          res.sendErrMsg('评价失败');
        }
      }));
    }));
  }));
}
