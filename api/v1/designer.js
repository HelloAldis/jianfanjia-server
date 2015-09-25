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

var noPassAndToken = {
  pass: 0,
  accessToken: 0,
};

var noPrivateInfo = {
  pass: 0,
  accessToken: 0,
  uid: 0,
  phone: 0,
  email: 0,
  bank: 0,
  bank_card: 0,
}

exports.getInfo = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);

  Designer.findOne({
    _id: designerid
  }, noPassAndToken, function (err, designer) {
    if (err) {
      return next(err);
    }

    res.sendData(designer);
  });
};

exports.user_designer_info = function (req, res, next) {
  var designerid = tools.trim(req.body.designerid);

  Designer.findOne({
    _id: designerid
  }, {
    pass: 0,
    accessToken: 0,
    uid: 0,
    email: 0,
    bank: 0,
    bank_card: 0,
  }, function (err, designer) {
    if (err) {
      return next(err);
    }

    res.sendData(designer);
  });
};

exports.updateInfo = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var designer = ApiUtil.buildDesinger(req);
  designer.auth_type = type.designer_auth_type_new;
  designer.auth_date = new Date().getTime();
  designer.auth_message = '';

  Designer.setOne({
    _id: userid
  }, designer, {}, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
};

exports.uid_bank_info = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var uidbank = ApiUtil.buildUidBank(req);
  uidbank.uid_auth_type = type.designer_auth_type_new;
  uidbank.uid_auth_date = new Date().getTime();
  uidbank.uid_auth_message = '';

  Designer.setOne({
    _id: userid
  }, uidbank, {}, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
};

exports.email_info = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var email = tools.trim(req.body.email);

  Designer.setOne({
    _id: userid
  }, {
    email: email,
    email_auth_type: type.designer_auth_type_new,
    email_auth_date: new Date().getTime(),
    email_auth_message: '',
  }, {}, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
};

exports.getOne = function (req, res, next) {
  var designerid = req.params._id;

  Designer.findOne({
    _id: designerid
  }, noPrivateInfo, function (err, designer) {
    if (err) {
      return next(err);
    }

    // console.log('time = ' + designer._id.getTimestamp().getTime()); //1439782910000
    // var a = designer._id.toString().substring(0, 8);
    // console.log('a = ' + a);
    // console.log('int = ' + (parseInt(a, 16) * 1000));

    if (designer) {
      res.sendData(designer);

      limit.perwhatperdaydo('designergetone', req.ip + designerid, 1,
        function () {
          Designer.incOne({
            _id: designerid
          }, {
            view_count: 1
          }, {});
        });
    } else {
      res.sendData(null);
    }
  });
}

exports.listtop = function (req, res, next) {
  Designer.find({
    auth_type: type.designer_auth_type_done
  }, noPrivateInfo, {
    sort: {
      auth_date: -1
    },
    limit: config.index_top_designer_count
  }, function (err, designers) {
    if (err) {
      return next(err);
    }

    res.sendData(designers);
  });
}

exports.search = function (req, res, next) {
  var query = req.body.query;
  var sort = req.body.sort;
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  query.auth_type = type.designer_auth_type_done;

  Designer.paginate(query, noPrivateInfo, {
    sort: sort,
    skip: skip,
    limit: limit,
  }, function (err, designers, total) {
    if (err) {
      return next(err);
    }

    res.sendData({
      designers: designers,
      total: total
    });
  });
}

exports.myUser = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var ep = eventproxy();

  ep.fail(next);
  ep.on('plans', function (plans) {
    async.mapLimit(plans, 3, function (plan, callback) {
      User.findOne({
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

  Plan.setOne({
    userid: userid,
    designerid: designerid
  }, {
    house_check_time: house_check_time,
    status: type.plan_status_designer_respond,
    last_status_update_time: new Date().getTime(),
  }, function (err, plan) {
    if (err) {
      return next(err);
    }

    if (plan) {
      Requirement.setOne({
        _id: plan.requirementid,
        status: type.requirement_status_not_respond,
      }, {
        status: type.requirement_status_respond_no_plan
      }, null, function (err) {

      });
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
      status: type.plan_status_designer_reject,
      last_status_update_time: new Date().getTime(),
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

  Designer.setOne({
    _id: designerid
  }, {
    auth_type: type.designer_auth_type_processing,
    auth_date: new Date().getTime(),
  }, {}, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
}

exports.agree = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);

  Designer.setOne({
    _id: designerid
  }, {
    'agreee_license': type.designer_agree_type_yes
  }, {}, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
}

exports.update_online_status = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var new_oneline_status = tools.trim(req.body.new_oneline_status);

  var ep = eventproxy();
  ep.fail(next);

  Designer.setOne({
    _id: designerid
  }, {
    online_status: new_oneline_status,
    online_update_time: new Date().getTime(),
  }, {}, ep.done(function (designer) {
    res.sendSuccessMsg();
  }));
}
