var validator = require('validator');
var eventproxy = require('eventproxy');
var Designer = require('../../../proxy').Designer;
var Share = require('../../../proxy').Share;
var Team = require('../../../proxy').Team;
var User = require('../../../proxy').User;
var Product = require('../../../proxy').Product;
var ApiStatistic = require('../../../proxy').ApiStatistic;
var Requirement = require('../../../proxy').Requirement;
var Evaluation = require('../../../proxy').Evaluation;
var Plan = require('../../../proxy').Plan;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../apiconfig');
var ue_config = require('../../../ueditor/ue_config');
var async = require('async');
var ApiUtil = require('../../../common/api_util');
var type = require('../../../type');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var sms = require('../../../common/sms');
var utility = require('utility');
var imageUtil = require('../../../common/image_util');

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
        sms.sendYzxAuthSuccess(designer.phone, [designer.username]);
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

exports.search_share = function (req, res, next) {
  var query = req.body.query;
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
  ep.fail(next);

  Share.paginate(query, null, {
    sort: {
      create_at: -1,
    },
    skip: skip,
    limit: limit,
  }, ep.done(function (shares, totals) {
    async.mapLimit(shares, 3, function (share, callback) {
      Designer.findOne({
        _id: share.designerid
      }, {
        _id: 1,
        username: 1,
        imageid: 1
      }, function (err, designer_indb) {
        var s = share.toObject();
        s.designer = designer_indb;
        callback(err, s);
      });
    }, ep.done(function (results) {
      res.sendData({
        shares: results,
        total: totals
      });
    }));
  }));
}

exports.add = function (req, res, next) {
  var share = ApiUtil.buildShare(req);
  var designerid = tools.trim(req.body.designerid);
  var userid = tools.trim(req.body.userid);
  var ep = eventproxy();
  ep.fail(next);

  if (userid) {
    share.userid = new ObjectId(userid);
  } else if (designerid) {
    share.designerid = new ObjectId(designerid);
  }

  Share.newAndSave(share, ep.done(function () {
    res.sendSuccessMsg();
  }));
};

exports.update = function (req, res, next) {
  var share = ApiUtil.buildShare(req);
  var shareid = tools.trim(req.body._id);
  var ep = eventproxy();
  ep.fail(next);

  share.lastupdate = new Date().getTime();
  Share.setOne({
    _id: shareid
  }, share, null, ep.done(function () {
    res.sendSuccessMsg();
  }));
};

exports.delete = function (req, res, next) {
  var _id = tools.trim(req.body._id);
  var ep = eventproxy();
  ep.fail(next);

  Share.removeOne({
    _id: _id
  }, null, ep.done(function () {
    res.sendSuccessMsg();
  }));
}

exports.listAuthingDesigner = function (req, res, next) {
  var ep = eventproxy();
  ep.fail(next);

  Designer.find({
    auth_type: type.designer_auth_type_processing
  }, {
    pass: 0,
    accessToken: 0
  }, {}, ep.done(function (designers) {
    res.sendData(designers);
  }));
};

exports.searchDesigner = function (req, res, next) {
  var query = req.body.query;
  var phone = tools.trim(query.phone);
  var phoneReg = new RegExp('^' + tools.trim(phone));
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
  ep.fail(next);

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
  }, ep.done(function (designers, total) {
    res.sendData({
      designers: designers,
      total: total
    });
  }));
}

exports.searchUser = function (req, res, next) {
  var query = req.body.query;
  var phone = tools.trim(query.phone);
  var phoneReg = new RegExp('^' + tools.trim(phone));
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
  ep.fail(next);

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
  }, ep.done(function (users, total) {
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
    }, ep.done(function (results) {
      res.sendData({
        users: results,
        total: total
      });
    }));
  }));
}

exports.searchProduct = function (req, res, next) {
  var query = req.body.query;
  var sort = req.body.sort;
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
  ep.fail(next);

  Product.paginate(query, null, {
    sort: sort,
    skip: skip,
    limit: limit
  }, ep.done(function (products, total) {
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
    }, ep.done(function (results) {
      res.sendData({
        products: results,
        total: total
      });
    }));
  }));
}

exports.search_plan = function (req, res, next) {
  var query = req.body.query;
  var sort = req.body.sort;
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
  ep.fail(next);

  Plan.paginate(query, null, {
    sort: sort,
    skip: skip,
    limit: limit
  }, ep.done(function (plans, total) {
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
    }, ep.done(function (plans) {
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
      }, ep.done(function (plans) {
        async.mapLimit(plans, 3, function (plan, callback) {
          Requirement.findOne({
            _id: plan.requirementid,
          }, {
            rec_designerids: 1,
          }, function (err, requirement) {
            plan.requirement = requirement;
            callback(err, plan);
          });
        }, ep.done(function (results) {
          res.sendData({
            requirements: results,
            total: total
          });
        }));
      }));
    }));
  }));
}


exports.getDesigner = function (req, res, next) {
  var designerid = req.params._id;
  var ep = eventproxy();
  ep.fail(next);

  Designer.findOne({
    _id: designerid
  }, {
    pass: 0,
    accessToken: 0
  }, ep.done(function (designer) {
    if (designer) {
      res.sendData(designer);
    } else {
      res.sendData({});
    }
  }));
}

exports.search_team = function (req, res, next) {
  var query = req.body.query || {};
  var sort = req.body.sort;
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
  ep.fail(next);

  Team.paginate(query, null, {
    sort: sort,
    skip: skip,
    limit: limit
  }, ep.done(function (teams, total) {
    res.sendData({
      teams: teams,
      total: total
    });
  }));
}

exports.api_statistic = function (req, res, next) {
  var ep = eventproxy();
  ep.fail(next);

  ApiStatistic.find({}, {}, {
    sort: {
      count: -1
    }
  }, ep.done(function (arr) {
    res.sendData(arr);
  }));
};

exports.search_requirement = function (req, res, next) {
  var query = req.body.query || {};
  var sort = req.body.sort;
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
  ep.fail(next);

  Requirement.paginate(query, null, {
    sort: sort,
    skip: skip,
    limit: limit,
    lean: true,
  }, ep.done(function (requirements, total) {
    async.mapLimit(requirements, 3, function (requirement, callback) {
      async.parallel({
        user: function (callback) {
          User.findOne({
            _id: requirement.userid,
          }, {
            username: 1,
            phone: 1
          }, callback);
        },
        evaluations: function (callback) {
          Evaluation.find({
            requirementid: requirement._id,
          }, null, {
            lean: true,
          }, function (err, evaluations) {
            async.mapLimit(evaluations, 3, function (
              evaluation, callback) {
              Designer.findOne({
                _id: evaluation.designerid
              }, {
                username: 1,
                phone: 1,
              }, function (err, designer) {
                evaluation.designer = designer;
                callback(err, evaluation);
              });
            }, callback);
          });
        },
      }, function (err, result) {
        requirement.user = result.user;
        requirement.evaluations = result.evaluations;
        callback(err, requirement);
      });
    }, ep.done(function (results) {
      res.sendData({
        requirements: results,
        total: total
      });
    }));
  }));
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
  }, team, null, ep.done(function () {
    res.sendSuccessMsg();
  }));
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

exports.ueditor_get = function (req, res, next) {
  var action = req.query.action;

  switch (action) {
    case 'config':
      res.json(ue_config);
      break;
    default:
      res.sendErrMsg('请求地址有误');
      break;
  }
}

exports.ueditor_post = function (req, res, next) {
  var action = req.query.action;

  switch (action) {
    case 'uploadimage':
      var data = req.file.buffer;
      var userid = ApiUtil.getUserid(req);
      var md5 = utility.md5(data);

      Image.findOne({
        'md5': md5,
        'userid': userid
      }, null, ep.done(function (image) {
        if (image) {
          res.json({
            url: image._id,
            title: req.file.originalname,
            original: req.file.originalname,
            state: 'SUCCESS',
          });
        } else {
          imageUtil.jpgbuffer(data, ep.done(function (buf) {
            Image.newAndSave(md5, buf, userid, ep.done(function (
              savedImage) {
              res.json({
                url: savedImage._id,
                title: req.file.originalname,
                original: req.file.originalname,
                state: 'SUCCESS',
              });
            }));
          }));
        }
      }));
      break;
    default:
      res.sendErrMsg('请求地址有误');
      break;
  }
}

/*
/api/v2/web/admin/ueditor?action=uploadimage
23/Nov/2015:03:54:44 +0000 59.173.226.250 - POST multipart/form-data; boundary=----WebKitFormBoundaryPqxOft0UM8AyRZp5
/api/v2/web/admin/ueditor?action=uploadimage HTTP/1.1/Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36 200 85 - 0.588 ms
*/
