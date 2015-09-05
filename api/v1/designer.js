var validator = require('validator');
var eventproxy = require('eventproxy');
var Designer = require('../../proxy').Designer;
var Product = require('../../proxy').Product;
var Plan = require('../../proxy').Plan;
var User = require('../../proxy').User;
var Requirement = require('../../proxy').Requirement;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../config');
var async = require('async');
var ApiUtil = require('../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var type = require('../../type');
var limit = require('../../middlewares/limit')

exports.getInfo = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  Designer.getDesignerById(designerid, function (err, designer) {
    if (err) {
      return next(err);
    }

    designer.pass = '';
    designer.accessToken = '';
    res.sendData(designer);
  });
};

exports.updateInfo = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var designer = ApiUtil.buildDesinger(req);

  Designer.updateByQuery({
    _id: userid
  }, designer, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
};

exports.getOne = function (req, res, next) {
  var designerid = req.params._id;

  Designer.getDesignerById(designerid, function (err, designer) {
    if (err) {
      return next(err);
    }

    if (designer) {
      designer.pass = '';
      designer.accessToken = '';
      res.sendData(designer);

      limit.perwhatperdaydo('designergetone', req.ip + designerid, 1,
        function () {
          Designer.addViewCountForDesigner(designerid, 1);
        });
    } else {
      res.sendData(null);
    }
  });
}

exports.listtop = function (req, res, next) {
  Designer.getTopDesigners(config.index_top_designer_count,
    function (err, designer) {
      if (err) {
        return next(err);
      }

      res.sendData(designer);
    });
}

exports.search = function (req, res, next) {
  var query = req.body.query;
  var sort = req.body.sort;
  query.auth_type = type.designer_auth_type_done;

  Designer.findDesignersByQuery(query, sort, function (err, designers) {
    if (err) {
      return next(err);
    }

    res.sendData(designers);
  });
}

exports.myUser = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var ep = eventproxy();

  ep.fail(next);
  ep.on('plans', function (plans) {
    async.mapLimit(plans, 3, function (plan, callback) {
      User.getOneByQueryAndProject({
        _id: plan.userid
      }, {
        username: 1,
        phone: 1,
        imageid: 1,
      }, function (err, user) {
        plan.user = user;
        callback(err, plan);
      });
    }, function (err, results) {
      if (err) {
        return next(err);
      }

      ep.emit('hasUser', results);
    });
  });

  ep.on('hasUser', function (plans) {
    async.mapLimit(plans, 3, function (plan, callback) {
      Requirement.getRequirementByUserid(plan.userid, function (err,
        requirement) {
        plan.requirement = requirement;
        callback(err, plan);
      });
    }, function (err, results) {
      if (err) {
        return next(err);
      }

      res.sendData(results);
    });
  });

  Plan.getPlansByQueryAndProject({
    designerid: designerid
  }, {
    designerid: 1,
    userid: 1,
    requirementid: 1,
    house_check_time: 1,
    status: 1,
  }, function (err, plans) {
    if (err) {
      return next(err);
    }
    var ps = _.map(plans, function (plan) {
      var p = {};
      p.designerid = plan.designerid;
      p.userid = plan.userid;
      p.requirementid = plan.requirementid;
      p.house_check_time = plan.house_check_time;
      p.status = plan.status;
      p._id = plan._id;
      return p;
    });
    ep.emit('plans', ps);
  });
}

exports.okUser = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var userid = tools.trim(req.body.userid);
  var house_check_time = req.body.house_check_time;

  Plan.updateByQuery({
      userid: userid,
      designerid: designerid
    }, {
      house_check_time: house_check_time,
      status: type.plan_status_designer_respond
    },
    function (err) {
      if (err) {
        return next(err);
      }

      res.sendSuccessMsg();
    });
}

exports.rejectUser = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var userid = tools.trim(req.body.userid);

  Plan.updateByQuery({
      userid: userid,
      designerid: designerid
    }, {
      status: type.plan_status_designer_reject
    },
    function (err) {
      if (err) {
        return next(err);
      }

      res.sendSuccessMsg();
    });
}

exports.auth = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);

  Designer.updateByQuery({
      _id: designerid
    }, {
      auth_type: type.designer_auth_type_processing,
      auth_date: new Date().getTime(),
    },
    function (err) {
      if (err) {
        return next(err);
      }

      res.sendSuccessMsg();
    });
}

exports.agree = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);

  Designer.updateByQuery({
      _id: designerid
    }, {
      'agreee_license': type.designer_agree_type_yes
    },
    function (err) {
      if (err) {
        return next(err);
      }

      res.sendSuccessMsg();
    });
}
