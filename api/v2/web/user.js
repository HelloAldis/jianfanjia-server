var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../../proxy').User;
var Plan = require('../../../proxy').Plan;
var Requirement = require('../../../proxy').Requirement;
var Designer = require('../../../proxy').Designer;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../config');
var ApiUtil = require('../../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var type = require('../../../type');
var async = require('async');
var sms = require('../../../common/sms');

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
  }, user, null, ep.done(function () {
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

    if (requirement.order_designerids.length + designerids.length >= 3) {
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
            Plan.newAndSave(json);

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
                sms.sendYuyue(designer.phone);
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
    console.log(plan);
    if (plan) {
      Requirement.setOne({
        _id: plan.requirementid,
        status: type.requirement_status_respond_no_housecheck,
      }, {
        status: type.requirement_status_housecheck_no_plan
      }, null, function (err) {});
    }

    res.sendSuccessMsg();
  }));
}
