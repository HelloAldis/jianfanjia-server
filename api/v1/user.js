var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../proxy').User;
var Plan = require('../../proxy').Plan;
var Requirement = require('../../proxy').Requirement;
var Designer = require('../../proxy').Designer;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../config');
var ApiUtil = require('../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var type = require('../../type');
var async = require('async');
var sms = require('../../common/sms');

exports.getInfo = function (req, res, next) {
  var userid = req.params._id || ApiUtil.getUserid(req);

  User.getUserById(userid, function (err, user) {
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

  User.updateByQuery({
    _id: userid
  }, user, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
};

exports.getRequirement = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);

  Requirement.getRequirementByUserid(userid, function (err, requirement) {
    if (err) {
      return next(err);
    }

    res.sendData(requirement);
  });
}

exports.updateRequirement = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var requirement = ApiUtil.buildRequirement(req);
  var ep = eventproxy();

  var price_perm = requirement.total_price * 10000 / requirement.house_area;
  var province = requirement.province;
  var city = requirement.city;
  var district = requirement.district;
  var dec_style = requirement.dec_style;

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
    });
  });

  ep.on('user', function (user) {
    Designer.getSByQueryAndProject({
      auth_type: type.designer_auth_type_done,
      // province: province,
      city: city,
    }, {
      pass: 0,
      accessToken: 0
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
        if (user.communication_type === designer.communication_type) {
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
  });

  User.getUserById(userid, function (err, user) {
    if (err) {
      return next(err);
    }

    ep.emit('user', user);
  });
};

exports.myDesigner = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var ep = eventproxy();

  ep.fail(next);
  ep.on('final', function (data) {
    res.sendData(data);
  });

  Requirement.getRequirementByUserid(userid, function (err, requirement) {
    if (err) {
      return next(err);
    }

    ep.on('hasDesigner', function (designers) {
      async.mapLimit(designers, 3, function (designer, callback) {
        Plan.getPlansByDesigneridAndUserid(designer._id, userid, {
          house_check_time: 1,
          status: 1
        }, function (err, plans) {
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
        Designer.getDesignerById(designerid, function (err,
          designer_indb) {
          var designer = {};
          designer._id = designer_indb._id;
          designer.phone = designer_indb.phone;
          designer.province = designer_indb.province;
          designer.city = designer_indb.district;
          designer.district = designer_indb.district;
          designer.username = designer_indb.username;
          designer.view_count = designer_indb.view_count;
          designer.order_count = designer_indb.order_count;
          designer.product_count = designer_indb.product_count;
          designer.imageid = designer_indb.imageid;
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

  Requirement.getRequirementByUserid(userid, function (err, requirement) {
    if (err) {
      return next(err);
    }

    if (!requirement) {
      res.sendErrMsg('请先添加需求');
      return;
    }

    Requirement.getRequirementByQuery({
        userid: userid,
        'designerids': designerid
      },
      function (err, requirement) {
        if (err) {
          return next(err);
        }

        if (requirement) {
          res.sendErrMsg('已经添加过了');
          return;
        }

        Requirement.updateByUserid(userid, {
          $push: {
            designerids: designerid
          }
        }, function (err) {
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

      Plan.findOneByQuery(json, function (err, plan) {
        if (err) {
          return next(err);
        }

        if (plan) {
          //已预约过
          return ep.emit('final');
        } else {
          Plan.newAndSave(json);
          Designer.addOrderCountForDesigner(designerid, 1);
          Designer.getDesignerById(designerid, function (err,
            designer) {

            if (err) {
              return next(err);
            }

            if (designer) {
              sms.sendYuyue(phone);
            }
          });
          return ep.emit('final');
        }
      });
    });
  });

  Requirement.getRequirementByUserid(userid, function (err, requirement) {
    if (err) {
      return next(err);
    }

    ep.emit('requirement', requirement);
  });
};
