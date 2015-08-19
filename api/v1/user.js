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
    res.send({data:user});
  });
}

exports.updateInfo = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var user = ApiUtil.buildUser(req);

  User.updateByQuery({_id: userid}, user, function (err) {
    if (err) {
      return next(err);
    }

    ApiUtil.sendSuccessMsg(res);
  });
};

exports.getRequirement = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);

  Requirement.getRequirementByUserid(userid, function (err, requirement) {
    if (err) {
      return next(err);
    }

    res.send({data:requirement});
  });
}

exports.updateRequirement = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var requirement = ApiUtil.buildRequirement(req);
  var ep = eventproxy();

  var price_perm = requirement.total_price * 10000 / requirement.house_area;
  var city = requirement.city;
  var district = requirement.district;
  console.log('hahah-----1');

  ep.fail(next);
  ep.on('alldesigners', function (alldesigners) {
    //设计确定了
    var designerids = _.uniq(_.pluck(alldesigners, '_id'), '_id');
    requirement.designerids = designerids;
    requirement.rec_designerids = designerids;

    console.log(requirement.designerids);

    Requirement.saveOrUpdateByUserid(userid, requirement, function (err) {
      if (err) {
        return next(err);
      }

      console.log('sdfsdfsd');
      res.send({msg: '更新成功'});
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
    res.send({data:designers});
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
      res.send({err_msg: '请先添加需求'});
      return;
    }

    Requirement.getRequirementByQuery({userid: userid, 'designerids': designerid},
    function (err, requirement) {
      if (err) {
        return next(err);
      }

      if (requirement) {
        res.send({err_msg: '已经添加过了'});
        return;
      }

      Requirement.updateByUserid(userid, {$push: {designerids:designerid}}, function (err) {
        if (err) {
          return next(err);
        }

        ApiUtil.sendSuccessMsg(res);
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

    Plan.saveOrUpdate(json, function (err, plan) {
      if (err) {
        return next(err);
      }

      ApiUtil.sendSuccessMsg(res);
    });
  });

  // ep.on('plan', function (plan) {
  //   var query = {userid:userid, 'plans.designerid': designerid};
  //   Requirement.updateByQuery(query, {$set: {'plans.$.planid': plan._id}}, function (err) {
  //     if (err) {
  //       return next(err);
  //     }
  //     res.send({msg: '添加成功'});
  //   });
  // });

  Requirement.getRequirementByUserid(userid, function (err, requirement) {
    if (err) {
      return next(err);
    }

    ep.emit('requirement', requirement);
  });
};
