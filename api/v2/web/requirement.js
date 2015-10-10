var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../../proxy').User;
var Plan = require('../../../proxy').Plan;
var Requirement = require('../../../proxy').Requirement;
var Designer = require('../../../proxy').Designer;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../config');
var ApiUtil = require('../../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var type = require('../../../type');
var async = require('async');
var sms = require('../../../common/sms');

exports.user_my_requiremtne_list = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var ep = eventproxy();
  ep.fail(next);

  Requirement.find({
    userid: userid
  }, null, ep.done(function (requirements) {
    res.sendData(requirements);
  }));
}

exports.user_add_requirement = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var requirement = ApiUtil.buildRequirement(req);
  requirement.userid = userid;
  requirement.status = type.requirement_status_new;
  var ep = eventproxy();
  ep.fail(next);

  // var username = tools.trim(req.body.username);
  // if (username) {
  //   User.setOne({
  //     _id: userid
  //   }, {
  //     username: username
  //   }, null, function (err) {});
  // }

  var price_perm = requirement.total_price * 10000 / requirement.house_area;
  var province = requirement.province;
  var city = requirement.city;
  var district = requirement.district;
  var dec_style = requirement.dec_style;

  Designer.find({
    city: city,
    auth_type: type.designer_auth_type_done,
    agreee_license: type.designer_agree_type_yes,
    online_status: type.online_status_on,
    // uid_auth_type: type.designer_auth_type_done,
    // work_auth_type: type.designer_auth_type_done,
  }, {
    pass: 0,
    accessToken: 0
  }, {}, ep.done(function (designers) {
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

      designer.match = 50 + designer.match * 9;
    });
    var designersSort = _.sortByOrder(designers, ['match'], ['desc']);
    ep.emit('final', designersSort);
  }));

  ep.on('final', function (designers) {
    //设计确定了
    if (designers.length > config.recommend_designer_count) {
      designers = designers.slice(0, config.recommend_designer_count);
    }

    var designerids = _.pluck(designers, '_id');
    requirement.rec_designerids = designerids;

    Requirement.newAndSave(requirement, ep.done(function () {
      res.sendSuccessMsg();

      User.findOne({
        _id: userid
      }, null, function (err, user) {
        if (user) {
          var count = designerids.length >= 3 ? 3 : designerids
            .length;
          sms.sendYzxRequirementSuccess(user.phone, count);
        }
      });
    }));
  });
}

exports.user_update_requirement = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var requirement = ApiUtil.buildRequirement(req);
  var _id = req.body._id;
  requirement.status = type.requirement_status_new;
  var ep = eventproxy();
  ep.fail(next);

  var price_perm = requirement.total_price * 10000 / requirement.house_area;
  var province = requirement.province;
  var city = requirement.city;
  var district = requirement.district;
  var dec_style = requirement.dec_style;

  Designer.find({
    city: city,
    auth_type: type.designer_auth_type_done,
    agreee_license: type.designer_agree_type_yes,
    online_status: type.online_status_on,
    // uid_auth_type: type.designer_auth_type_done,
    // work_auth_type: type.designer_auth_type_done,
  }, {
    pass: 0,
    accessToken: 0
  }, {}, ep.done(function (designers) {
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

      designer.match = 50 + designer.match * 9;
    });
    var designersSort = _.sortByOrder(designers, ['match'], ['desc']);
    ep.emit('final', designersSort);
  }));

  ep.on('final', function (designers) {
    //设计确定了
    if (designers.length > config.recommend_designer_count) {
      designers = designers.slice(0, config.recommend_designer_count);
    }

    var designerids = _.pluck(designers, '_id');
    requirement.rec_designerids = designerids;

    Requirement.setOne({
        _id: _id
      },
      requirement, null, ep.done(function () {
        res.sendSuccessMsg();
      }));
  });
};
