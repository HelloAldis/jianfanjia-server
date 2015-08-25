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

exports.getInfo = function (req, res, next) {
  var userid = req.params._id;

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

  User.updateByQuery({_id: userid}, user, function (err) {
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
  var city = requirement.city;
  var district = requirement.district;

  ep.fail(next);
  ep.on('alldesigners', function (alldesigners) {
    //设计确定了
    var designerids = _.uniq(_.pluck(alldesigners, '_id'), '_id');
    requirement.designerids = designerids;
    requirement.rec_designerids = designerids;

    Requirement.saveOrUpdateByUserid(userid, requirement, function (err) {
      if (err) {
        return next(err);
      }

      res.sendSuccessMsg();
    });
  });

  ep.on('recdesigners', function (recdesigners) {
    //推荐的设计师确定了
    if (recdesigners.length < 3) {
      //获取其他设计师
      Designer.findDesignersByCityDistrict(city,
        district, config.recommend_designer_count, function (err, others) {
        if (err) {
          return next(err);
        }

        recdesigners = recdesigners.concat(others);
        ep.emit('alldesigners', recdesigners);
      });
    } else {
      ep.emit('alldesigners', recdesigners);
    }
  });

  //推荐3个设计师
  if (requirement.work_type === type.work_type_half) {
    //半包
    Designer.findDesignersByCityDistrictHalf(city, district, price_perm,
      config.recommend_designer_count, function (err, recdesigners) {
      if (err) {
        return next(err);
      }

      ep.emit('recdesigners', recdesigners);
    });
  } else if (requirement.work_type === type.work_type_all) {
    //全包
    Designer.findDesignersByCityDistrictAll(city, district, price_perm, config.recommend_designer_count,
      function (err, recdesigners) {
      if (err) {
        return next(err);
      }

      ep.emit('recdesigners', recdesigners);
    });
  }
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
        Plan.getPlansByDesigneridAndUserid(designer._id, userid, {house_check_time:1, status:1}, function (err, plans) {
          designer.plans = plans;
          console.log('designer ' + designer);
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
      async.mapLimit(requirement.designerids, 3, function (designerid, callback) {
        Designer.getDesignerById(designerid, function (err, designer_indb) {
          var designer = {};
          designer._id = designer_indb._id;
          designer.phone = designer_indb.phone;
          designer.city = designer_indb.district;
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
      return;
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

    Requirement.getRequirementByQuery({userid: userid, 'designerids': designerid},
    function (err, requirement) {
      if (err) {
        return next(err);
      }

      if (requirement) {
        res.sendErrMsg('已经添加过了');
        return;
      }

      Requirement.updateByUserid(userid, {$push: {designerids:designerid}}, function (err) {
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
