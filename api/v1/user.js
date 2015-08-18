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

    res.send({msg:'更新成功'});
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
    var plans = _.uniq(_.pluck(alldesigners, '_id'), '_id');
    requirement.plans =  _.map(plans, function (designerid) {
      var o = {};
      o.designerid = designerid;
      return o;
    });
    console.log(requirement.plans);

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
    }

    ep.emit('designers', requirement.plans);
  });
};

exports.addDesigner = function (req, res, next) {
}

exports.addDesigner2HouseCheck = function (req, res, next) {
}
