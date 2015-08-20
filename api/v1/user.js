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

exports.getInfo = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);

  User.getUserById(userid, function (err, user) {
    if (err) {
      return next(err);
    }

    user.pass = '';
    user.accessToken = '';
    res.sendData(user);
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
  if (requirement.work_type === '1') {
    //半包
    Designer.findDesignersByCityDistrictHalf(city, district, price_perm,
      config.recommend_designer_count, function (err, recdesigners) {
      if (err) {
        return next(err);
      }

      ep.emit('recdesigners', recdesigners);
    });
  } else if (requirement.work_type === '2') {
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
  ep.on('designers', function (designers) {
    res.sendData(designers);
  });

  Requirement.getRequirementByUserid(userid, function (err, requirement) {
    if (err) {
      return next(err);
    }

    if (!requirement) {
      ep.emit('designers', []);
      return;
    } else {
      ep.emit('designers', requirement.designerids);
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
  var designerid = new ObjectId(tools.trim(req.body._id));
  var userid = ApiUtil.getUserid(req);
  var ep = eventproxy();

  ep.fail(next);
  ep.on('requirement', function (requirement) {
    //
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
        return res.sendSuccessMsg();
      } else {
        Plan.newAndSave(json);
        Designer.addOrderCountForDesigner(designerid, 1);
        return res.sendSuccessMsg();
      }
    });
  });

  Requirement.getRequirementByUserid(userid, function (err, requirement) {
    if (err) {
      return next(err);
    }

    ep.emit('requirement', requirement);
  });
};
