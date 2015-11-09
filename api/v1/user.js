var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../proxy').User;
var Plan = require('../../proxy').Plan;
var Requirement = require('../../proxy').Requirement;
var Designer = require('../../proxy').Designer;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../apiconfig');
var ApiUtil = require('../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var type = require('../../type');
var async = require('async');
var sms = require('../../common/sms');

exports.getInfo = function (req, res, next) {
  var userid = req.params._id || ApiUtil.getUserid(req);

  User.findOne({
    _id: userid
  }, null, function (err, user) {
    if (err) {
      return next(err);
    }

    if (user) {
      user.pass = '';
      user.accessToken = '';
      res.sendData(user);
    } else {
      res.sendData(null);
    }
  });
}

exports.updateInfo = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var user = ApiUtil.buildUser(req);

  User.setOne({
    _id: userid
  }, user, null, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
};

exports.getRequirement = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);

  Requirement.findOne({
    userid: userid
  }, null, function (err, requirement) {
    if (err) {
      return next(err);
    }

    res.sendData(requirement);
  });
}

exports.updateRequirement = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var requirement = ApiUtil.buildRequirement(req);
  requirement.status = type.requirement_status_new;
  var ep = eventproxy();

  var price_perm = requirement.total_price * 10000 / requirement.house_area;
  var province = requirement.province;
  var city = requirement.city;
  var district = requirement.district;
  var dec_style = requirement.dec_style;

  var username = tools.trim(req.body.username);
  if (username) {
    User.setOne({
      _id: userid
    }, {
      username: username
    }, null, function (err) {
      if (err) {
        console.log(err);
      }
    });
  }

  ep.fail(next);
  ep.on('final', function (designers) {
    //设计确定了
    if (designers.length > config.recommend_designer_count) {
      designers = designers.slice(0, config.recommend_designer_count);
    }

    var designerids = _.pluck(designers, '_id');
    requirement.designerids = designerids;
    requirement.rec_designerids = designerids;

    Requirement.saveOrUpdateByUserid(userid, requirement, function (err) {
      if (err) {
        return next(err);
      }

      res.sendSuccessMsg();

      User.findOne({
        _id: userid
      }, null, function (err, user) {
        if (err) {
          return next(err);
        }

        if (user) {
          var count = designerids.length >= 3 ? 3 : designerids.length;
          sms.sendYzxRequirementSuccess(user.phone, [user.username]);
        }
      });
    });
  });

  Designer.find({
    city: city,
    auth_type: type.designer_auth_type_done,
    authed_product_count: {
      $gte: 3
    },
    // uid_auth_type: type.designer_auth_type_done,
    // work_auth_type: type.designer_auth_type_done,
  }, {
    pass: 0,
    accessToken: 0
  }, {
    sort: {
      order_count: 1,
      authed_product_count: -1,
    }
  }, function (err, designers) {
    if (err) {
      return next(err);
    }

    _.forEach(designers, function (designer) {
      //匹配区域
      if (_.indexOf(designer.dec_districts, district) >= 0) {
        designer.match++;
      }

      //匹配钱
      if (requirement.work_type === type.work_type_half) {
        if (designer.dec_fee_half <= price_perm) {
          designer.match++;
        }
      } else if (requirement.work_type === type.work_type_all) {
        if (designer.dec_fee_all <= price_perm) {
          designer.match++;
        }
      }

      //匹配风格
      if (_.indexOf(designer.dec_styles, dec_style) >= 0) {
        designer.match++;
      }

      //匹配沟通
      if (requirement.communication_type === designer.communication_type) {
        designer.match++;
      }

      //匹配房型
      if (_.indexOf(designer.dec_house_types, requirement.house_type) >=
        0) {
        designer.match++;
      }
    });

    var designersSort = _.sortByOrder(designers, ['match'], ['desc']);

    ep.emit('final', designersSort);

  });
};

exports.myDesigner = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var ep = eventproxy();

  ep.fail(next);
  ep.on('final', function (data) {
    res.sendData(data);
  });

  Requirement.findOne({
    userid: userid
  }, null, function (err, requirement) {
    if (err) {
      return next(err);
    }

    ep.on('hasDesigner', function (designers) {
      async.mapLimit(designers, 3, function (designer, callback) {
        Plan.find({
          'designerid': designer._id,
          'userid': userid
        }, {
          house_check_time: 1,
          status: 1
        }, null, function (err, plans) {
          designer.plans = plans;
          callback(err, designer);
        });
      }, function (err, results) {
        if (err) {
          return next(err);
        }

        ep.emit('final', results);
      });
    });

    if (!requirement) {
      ep.emit('final', []);
      return;
    } else {
      async.mapLimit(requirement.designerids, 3, function (designerid,
        callback) {
        Designer.findOne({
          _id: designerid
        }, {
          phone: 1,
          province: 1,
          city: 1,
          district: 1,
          username: 1,
          view_count: 1,
          order_count: 1,
          product_count: 1,
          imageid: 1,
        }, function (err, designer) {
          designer = designer.toObject();
          designer.is_rec = _.find(requirement.rec_designerids,
            function (e) {
              return e.toString() === designer._id.toString();
            }) != undefined;
          callback(err, designer);
        });
      }, function (err, results) {
        if (err) {
          return next(err);
        }

        ep.emit('hasDesigner', results);
      });
    }
  });
};

exports.addDesigner = function (req, res, next) {
  var designerid = new ObjectId(tools.trim(req.body._id));
  var userid = ApiUtil.getUserid(req);

  Requirement.findOne({
    userid: userid
  }, null, function (err, requirement) {
    if (err) {
      return next(err);
    }

    if (!requirement) {
      res.sendErrMsg('请先添加需求');
      return;
    }

    Requirement.findOne({
      userid: userid,
      'designerids': designerid
    }, null, function (err, requirement) {
      if (err) {
        return next(err);
      }

      if (requirement) {
        res.sendErrMsg('已经添加过了');
        return;
      }

      Requirement.addToSet({
        userid: userid
      }, {
        designerids: designerid
      }, null, function (err) {
        if (err) {
          return next(err);
        }

        res.sendSuccessMsg();
      });
    });
  });
};

exports.addDesigner2HouseCheck = function (req, res, next) {
  var designerids = _.map(req.body.designerids, function (e) {
    return new ObjectId(e);
  });

  var userid = ApiUtil.getUserid(req);
  var ep = eventproxy();
  ep.after('final', designerids.length, function () {
    res.sendSuccessMsg();
  });

  ep.fail(next);
  ep.on('requirement', function (requirement) {
    //
    _.forEach(designerids, function (designerid) {
      var json = {};
      json.designerid = designerid;
      json.userid = userid;
      json.requirementid = requirement._id;

      Plan.findOne(json, null, function (err, plan) {
        if (err) {
          return next(err);
        }

        if (plan) {
          //已预约过
          return ep.emit('final');
        } else {
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
          }, function (err, designer) {
            if (err) {
              return next(err);
            }

            if (designer) {
              sms.sendYuyue(designer.phone);
            }
          });
          return ep.emit('final');
        }
      });
    });
  });

  Requirement.findOne({
    userid: userid
  }, null, function (err, requirement) {
    if (err) {
      return next(err);
    }
    ep.emit('requirement', requirement);

    Requirement.setOne({
      userid: userid,
      status: type.requirement_status_new,
    }, {
      status: type.requirement_status_not_respond,
    }, null, function (err, requirement) {});
  });
};
