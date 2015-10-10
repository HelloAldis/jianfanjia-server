var validator = require('validator');
var eventproxy = require('eventproxy');
var Designer = require('../../proxy').Designer;
var Share = require('../../proxy').Share;
var Team = require('../../proxy').Team;
var User = require('../../proxy').User;
var Product = require('../../proxy').Product;
var ApiStatistic = require('../../proxy').ApiStatistic;
var Requirement = require('../../proxy').Requirement;
var Plan = require('../../proxy').Plan;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../config');
var async = require('async');
var ApiUtil = require('../../common/api_util');
var type = require('../../type');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var sms = require('../../common/sms');

exports.login = function (req, res, next) {
  if (req.body.username === 'sunny' && req.body.pass === '!@Jyz20150608#$') {
    req.session.userid = 'Admin';
    req.session.usertype = type.role_admin;
    res.cookie('username', 'Admin'); //cookie 有效期1天
    res.cookie('usertype', type.role_admin);

    res.sendSuccessMsg();
  } else {
    res.sendErrMsg('ooooooOps');
  }
}

exports.update_basic_auth = function (req, res, next) {
  var designerid = tools.trim(req.body._id);
  var new_auth_type = tools.trim(req.body.new_auth_type);
  var auth_message = tools.trim(req.body.auth_message);
  var ep = eventproxy();
  ep.fail(next);

  Designer.setOne({
    _id: designerid
  }, {
    auth_type: new_auth_type,
    auth_date: new Date().getTime(),
    auth_message: auth_message,
  }, {}, ep.done(function (designer) {
    if (designer) {
      if (new_auth_type === type.designer_auth_type_done) {
        sms.sendYzxAuthSuccess(designer.phone, designer.username);
        // sms.sendYzxAuthSuccess('18682109074', designer.username);
      }
    }

    res.sendSuccessMsg();
  }));
}

exports.update_uid_auth = function (req, res, next) {
  var designerid = tools.trim(req.body._id);
  var new_auth_type = tools.trim(req.body.new_auth_type);
  var auth_message = tools.trim(req.body.auth_message);
  var ep = eventproxy();
  ep.fail(next);

  Designer.setOne({
    _id: designerid
  }, {
    uid_auth_type: new_auth_type,
    uid_auth_date: new Date().getTime(),
    uid_auth_message: auth_message,
  }, {}, ep.done(function (designer) {
    res.sendSuccessMsg();
  }));
}

exports.update_work_auth = function (req, res, next) {
  var designerid = tools.trim(req.body._id);
  var new_auth_type = tools.trim(req.body.new_auth_type);
  var auth_message = tools.trim(req.body.auth_message);
  var ep = eventproxy();
  ep.fail(next);

  Designer.setOne({
    _id: designerid
  }, {
    work_auth_type: new_auth_type,
    work_auth_date: new Date().getTime(),
    work_auth_message: auth_message,
  }, {}, ep.done(function (designer) {
    res.sendSuccessMsg();
  }));
}

exports.update_product_auth = function (req, res, next) {
  var productid = tools.trim(req.body._id);
  var designerid = tools.trim(req.body.designerid);
  var new_auth_type = tools.trim(req.body.new_auth_type);
  var auth_message = tools.trim(req.body.auth_message);
  var ep = eventproxy();
  ep.fail(next);

  Product.setOne({
    _id: productid
  }, {
    auth_type: new_auth_type,
    auth_date: new Date().getTime(),
    auth_message: auth_message,
  }, {}, ep.done(function (product) {
    if (product) {
      if (new_auth_type === type.product_auth_type_done) {
        if (product.auth_type !== type.product_auth_type_done) {
          Designer.incOne({
            _id: designerid
          }, {
            authed_product_count: 1
          }, {
            upsert: true
          });
        }
      } else if (new_auth_type !== type.product_auth_type_done) {
        if (product.auth_type === type.product_auth_type_done) {
          Designer.incOne({
            _id: designerid
          }, {
            authed_product_count: -1
          }, {
            upsert: true
          });
        }
      }
    }
    res.sendSuccessMsg();
  }));
}

exports.add = function (req, res, next) {
  var share = ApiUtil.buildShare(req);
  var designerid = tools.trim(req.body.designerid);
  var userid = tools.trim(req.body.userid);

  if (userid) {
    share.userid = new ObjectId(userid);
  } else if (designerid) {
    share.designerid = new ObjectId(designerid);
  }

  Share.newAndSave(share, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
};

exports.update = function (req, res, next) {
  var share = ApiUtil.buildShare(req);
  var shareid = tools.trim(req.body._id);

  share.lastupdate = new Date().getTime();
  Share.updateById(shareid, share, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
};

exports.delete = function (req, res, next) {
  var _id = tools.trim(req.body._id);

  Share.removeOneById(_id, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
}

exports.listAuthingDesigner = function (req, res, next) {
  Designer.find({
    auth_type: type.designer_auth_type_processing
  }, {
    pass: 0,
    accessToken: 0
  }, {}, function (err, designers) {
    if (err) {
      return next(err);
    }

    res.sendData(designers);
  });
};

exports.searchDesigner = function (req, res, next) {
  var query = req.body.query;
  var phone = tools.trim(query.phone);
  var phoneReg = new RegExp('^' + tools.trim(phone));
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;

  if (phone) {
    query['$or'] = [{
      phone: phoneReg
    }, {
      username: phoneReg
    }];
  }
  delete query.phone;

  Designer.paginate(query, {
    pass: 0,
    accessToken: 0
  }, {
    sort: {
      phone: 1
    },
    skip: skip,
    limit: limit
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

exports.searchUser = function (req, res, next) {
  var query = req.body.query;
  var phone = tools.trim(query.phone);
  var phoneReg = new RegExp('^' + tools.trim(phone));
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;

  if (phone) {
    query['$or'] = [{
      phone: phoneReg
    }, {
      username: phoneReg
    }];
  }
  delete query.phone;

  User.paginate(query, {
    pass: 0,
    accessToken: 0
  }, {
    sort: {
      phone: 1
    },
    skip: skip,
    limit: limit
  }, function (err, users, total) {
    if (err) {
      return next(err);
    }

    async.mapLimit(users, 3, function (user, callback) {
      Requirement.find({
        userid: user._id,
      }, {
        status: 1,
      }, null, function (err, requirement) {
        user = user.toObject();
        user.requirement = requirement;
        callback(err, user);
      });
    }, function (err, results) {
      if (err) {
        return next(err);
      }

      res.sendData({
        users: results,
        total: total
      });
    });
  });
}

exports.searchProduct = function (req, res, next) {
  var query = req.body.query;
  var sort = req.body.sort;
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;

  Product.paginate(query, null, {
    sort: sort,
    skip: skip,
    limit: limit
  }, function (err, products, total) {
    if (err) {
      return next(err);
    }

    async.mapLimit(products, 3, function (product, callback) {
      Designer.findOne({
        _id: product.designerid,
      }, {
        username: 1,
        phone: 1
      }, function (err, designer) {
        product = product.toObject();
        product.designer = designer;
        callback(err, product);
      });
    }, function (err, results) {
      if (err) {
        return next(err);
      }

      res.sendData({
        products: results,
        total: total
      });
    });
  });
}

exports.search_plan = function (req, res, next) {
  var query = req.body.query;
  var sort = req.body.sort;
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;

  Plan.paginate(query, null, {
    sort: sort,
    skip: skip,
    limit: limit
  }, function (err, plans, total) {
    if (err) {
      return next(err);
    }

    async.mapLimit(plans, 3, function (plan, callback) {
      Designer.findOne({
        _id: plan.designerid,
      }, {
        username: 1,
        phone: 1
      }, function (err, designer) {
        plan = plan.toObject();
        plan.designer = designer;
        callback(err, plan);
      });
    }, function (err, plans) {
      if (err) {
        return next(err);
      }

      async.mapLimit(plans, 3, function (plan, callback) {
        User.findOne({
          _id: plan.userid,
        }, {
          username: 1,
          phone: 1
        }, function (err, user) {
          plan.user = user;
          callback(err, plan);
        });
      }, function (err, plans) {
        if (err) {
          return next(err);
        }

        async.mapLimit(plans, 3, function (plan, callback) {
          Requirement.findOne({
            _id: plan.requirementid,
          }, {
            rec_designerids: 1,
          }, function (err, requirement) {
            plan.requirement = requirement;
            callback(err, plan);
          });
        }, function (err, results) {
          if (err) {
            return next(err);
          }

          res.sendData({
            requirements: results,
            total: total
          });
        });
      });
    });
  });
}


exports.getDesigner = function (req, res, next) {
  var designerid = req.params._id;

  Designer.findOne({
    _id: designerid
  }, {
    pass: 0,
    accessToken: 0
  }, function (err, designer) {
    if (err) {
      return next(err);
    }

    if (designer) {
      res.sendData(designer);
    } else {
      res.sendData(null);
    }
  });
}

exports.search_team = function (req, res, next) {
  var query = req.body.query || {};
  var sort = req.body.sort;
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;

  Team.paginate(query, null, {
    sort: sort,
    skip: skip,
    limit: limit
  }, function (err, teams, total) {
    if (err) {
      return next(err);
    }

    res.sendData({
      teams: teams,
      total: total
    });
  });
}

exports.api_statistic = function (req, res, next) {
  ApiStatistic.find({}, {}, {
    sort: {
      count: -1
    }
  }, function (err, arr) {
    if (err) {
      return next(err);
    }

    res.sendData(arr);
  });
};

exports.search_requirement = function (req, res, next) {
  var query = req.body.query || {};
  var sort = req.body.sort;
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;

  Requirement.paginate(query, null, {
    sort: sort,
    skip: skip,
    limit: limit
  }, function (err, requirements, total) {
    if (err) {
      return next(err);
    }

    async.mapLimit(requirements, 3, function (requirement, callback) {
      User.findOne({
        _id: requirement.userid,
      }, {
        username: 1,
        phone: 1
      }, function (err, user) {
        requirement = requirement.toObject();
        requirement.user = user;
        callback(err, requirement);
      });
    }, function (err, results) {
      if (err) {
        return next(err);
      }

      res.sendData({
        requirements: results,
        total: total
      });
    });
  });
}

exports.update_team = function (req, res, next) {
  var team = ApiUtil.buildTeam(req);
  var oid = tools.trim(req.body._id);

  if (oid === '') {
    res.sendErrMsg('信息不完全');
    return;
  }

  Team.setOne({
    _id: oid,
  }, team, null, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
}

exports.update_designer_online_status = function (req, res, next) {
  var designerid = tools.trim(req.body.designerid);
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
