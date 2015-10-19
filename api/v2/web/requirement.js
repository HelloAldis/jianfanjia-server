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
var designer_match_util = require('../../../common/designer_match');
var wkhtmltopdf = require('wkhtmltopdf');

exports.user_my_requiremtne_list = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var ep = eventproxy();
  ep.fail(next);

  Requirement.find({
    userid: userid
  }, null, ep.done(function (requirements) {
    res.sendData(requirements);
  }));
}

exports.designer_my_requiremtne_list = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var ep = eventproxy();
  ep.fail(next);

  Requirement.find({
    order_designerids: designerid
  }, null, ep.done(function (requirements) {
    async.mapLimit(requirements, 3, function (requirement, callback) {
      requirement = requirement.toObject();
      User.findOne({
        _id: requirement.userid
      }, {
        username: 1,
        phone: 1,
        imageid: 1
      }, function (err, user) {
        requirement.user = user;
        callback(err, requirement);
      });
    }, ep.done(function (requirements) {
      res.sendData(requirements);
    }));
  }));
}

exports.user_add_requirement = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var requirement = ApiUtil.buildRequirement(req);
  requirement.userid = userid;
  requirement.status = type.requirement_status_new;
  var ep = eventproxy();
  ep.fail(next);

  // var username = tools.trim(req.body.username);
  // if (username) {
  //   User.setOne({
  //     _id: userid
  //   }, {
  //     username: username
  //   }, null, function (err) {});
  // }

  Designer.find({
    city: requirement.city,
    auth_type: type.designer_auth_type_done,
    agreee_license: type.designer_agree_type_yes,
    online_status: type.online_status_on,
    // uid_auth_type: type.designer_auth_type_done,
    // work_auth_type: type.designer_auth_type_done,
  }, {
    pass: 0,
    accessToken: 0
  }, {}, ep.done(function (designers) {
    _.forEach(designers, function (designer) {
      designer_match_util.designer_match(designer, requirement);
    });
    var designersSort = _.sortByOrder(designers, ['match'], ['desc']);
    ep.emit('final', designersSort);
  }));

  ep.on('final', function (designers) {
    //设计确定了
    if (designers.length > config.recommend_designer_count) {
      designers = designers.slice(0, config.recommend_designer_count);
    }

    var designerids = _.pluck(designers, '_id');
    requirement.rec_designerids = designerids;

    Requirement.newAndSave(requirement, ep.done(function (
      requirement_indb) {
      res.sendData({
        requirementid: requirement_indb._id,
      });

      User.findOne({
        _id: userid
      }, null, function (err, user) {
        if (user) {
          var count = designerids.length >= 3 ? 3 : designerids
            .length;
          sms.sendYzxRequirementSuccess(user.phone, count);
        }
      });
    }));
  });
}

exports.user_update_requirement = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var requirement = ApiUtil.buildRequirement(req);
  var _id = req.body._id;
  requirement.status = type.requirement_status_new;
  var ep = eventproxy();
  ep.fail(next);

  Designer.find({
    city: requirement.city,
    auth_type: type.designer_auth_type_done,
    agreee_license: type.designer_agree_type_yes,
    online_status: type.online_status_on,
    // uid_auth_type: type.designer_auth_type_done,
    // work_auth_type: type.designer_auth_type_done,
  }, {
    pass: 0,
    accessToken: 0
  }, {}, ep.done(function (designers) {
    _.forEach(designers, function (designer) {
      designer_match_util.designer_match(designer, requirement);
    });
    var designersSort = _.sortByOrder(designers, ['match'], ['desc']);
    ep.emit('final', designersSort);
  }));

  ep.on('final', function (designers) {
    //设计确定了
    if (designers.length > config.recommend_designer_count) {
      designers = designers.slice(0, config.recommend_designer_count);
    }

    var designerids = _.pluck(designers, '_id');
    requirement.rec_designerids = designerids;

    Requirement.setOne({
        _id: _id
      },
      requirement, null, ep.done(function () {
        res.sendSuccessMsg();
      }));
  });
};

exports.user_one_requirement = function (req, res, next) {
  var query = req.body;
  var ep = eventproxy();
  ep.fail(next);

  Requirement.findOne(query, null, ep.done(function (plan) {
    res.sendData(plan);
  }));
}

exports.designer_one_requirement = function (req, res, next) {
  var query = req.body;
  var designerid = ApiUtil.getUserid(req);
  var ep = eventproxy();
  ep.fail(next);

  Requirement.findOne(query, null, ep.done(function (requirement) {
    if (!requirement) {
      return res.sendErrMsg('需求不存在');
    }

    User.findOne({
      _id: requirement.userid
    }, {
      username: 1,
      phone: 1,
      imageid: 1
    }, ep.done(function (user) {
      requirement = requirement.toObject();
      requirement.user = user;

      Plan.find({
        designerid: designerid,
        requirementid: requirement._id,
      }, {
        status: 1,
        house_check_time: 1,
      }, {
        skip: 0,
        limit: 1,
        sort: {
          last_status_update_time: -1
        },
      }, ep.done(function (plans) {
        if (plans && plans.length > 0) {
          requirement.plan = plans[0];
        }

        res.sendData(requirement);
      }));
    }));
  }));
}

exports.one_contract = function (req, res, next) {
  var requirementid = req.body.requirementid;
  var ep = eventproxy();
  ep.fail(next);

  Requirement.findOne({
    _id: requirementid
  }, null, ep.done(function (requirement) {
    async.parallel({
      plan: function (callback) {
        Plan.findOne({
          _id: requirement.final_planid
        }, {
          duration: 1
        }, callback);
      },
      designer: function (callback) {
        Designer.findOne({
          _id: requirement.final_designerid
        }, {
          username: 1
        }, callback);
      },
      user: function (callback) {
        User.findOne({
          _id: requirement.userid
        }, {
          username: 1
        }, callback);
      },
    }, ep.done(function (result) {
      requirement = requirement.toObject();
      requirement.plan = result.plan;
      requirement.designer = result.designer;
      requirement.user = result.user;

      res.sendData(requirement);
    }));
  }));
}

exports.config_contract = function (req, res, next) {
  var requirementid = req.body.requirementid;
  var start_at = req.body.start_at;
  var ep = eventproxy();
  ep.fail(next);

  Requirement.setOne({
    _id: requirementid,
    status: {
      $in: [type.requirement_status_config_contract, type.requirement_status_final_plan]
    }
  }, {
    start_at: start_at,
    status: type.requirement_status_config_contract,
  }, null, ep.done(function () {
    res.sendSuccessMsg();
  }));
}

exports.download_contract = function (req, res, next) {
  var requirementid = req.body.requirementid;
  var ep = eventproxy();
  ep.fail(next);

}
