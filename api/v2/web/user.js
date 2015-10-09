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

exports.getInfo = function (req, res, next) {
  var userid = req.params._id || ApiUtil.getUserid(req);
  var ep = eventproxy();
  ep.fail(next);

  User.findOne({
    _id: userid
  }, {
    pass: 0,
    accessToken: 0,
  }, ep.done(function (user) {
    res.sendData(user);
  }));
}

exports.updateInfo = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var user = ApiUtil.buildUser(req);
  var ep = eventproxy();
  ep.fail(next);

  User.setOne({
    _id: userid
  }, user, null, ep.done(function () {
    res.sendSuccessMsg();
  }));
};

exports.my_requiremtne_list = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var ep = eventproxy();
  ep.fail(next);

  Requirement.find({
    userid: userid
  }, null, ep.done(function (requirements) {
    res.sendData(requirements);
  }));
}

exports.add_requirement = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var requirement = ApiUtil.buildRequirement(req);
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

exports.updateRequirement = function (req, res, next) {
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

exports.designers_can_order = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var requirementid = req.body.requirementid;
  var ep = eventproxy();
  ep.fail(next);

  async.parallel({
      requirement: function (callback) {
        Requirement.findOne({
          _id: requirementid
        }, null, callback);
      },
      favorite: function (callback) {
        Favorite.findOne({
          userid: userid
        }, null, callback);
      },
    },

    ep.done(function (result) {
      var can_order_rec = [];

      if (result.requirement.rec_designerids) {
        can_order_rec = _.filter(result.requirement.rec_designerids,
          function (oid) {
            return tools.findObjectId(result.requirement.order_designerids,
              oid) < 0;
          });
      }

      var can_order_fav = [];
      if (result.favorite.favorite_designers) {
        can_order_fav = _.filter(result.favorite.favorite_designers,
          function (oid) {
            return tools.findObjectId(result.requirement.order_designerids,
              oid) < 0 && tools.findObjectId(result.requirement.rec_designerids,
              oid) < 0;
          });
      }

      async.parallel({
        rec_designers: function (callback) {
          Designer.find({
            _id: {
              $in: can_order_rec
            }
          }, {
            username: 1,
            imageid: 1,
          }, null, callback);
        },
        favorite_designers: function (callback) {
          Designer.find({
            _id: {
              $in: can_order_fav
            }
          }, {
            username: 1,
            imageid: 1,
          }, null, callback);
        },
      }, ep.done(function (result) {
        res.sendData(result);
      }));
    }));
}

exports.my_order_designer = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var requirementid = req.body.requirementid;
  var ep = eventproxy();

  ep.fail(next);
  async.waterfall([function (callback) {
    Requirement.findOne({
      _id: requirementid
    }, null, callback);
  }], ep.done(function (requirement) {
    Designer.find({
      _id: {
        $in: requirement.order_designerids
      }
    }, {
      username: 1,
      imageid: 1,
      phone: 1,
    }, null, ep.done(function (designers) {
      res.sendData(designers);
    }));
  }));
}

exports.order_designer = function (req, res, next) {
  var designerids = _.map(req.body.designerids, function (e) {
    return new ObjectId(e);
  });
  var requirementid = req.body.requirementid;

  var userid = ApiUtil.getUserid(req);
  ep.fail(next);
  var ep = eventproxy();

  async.waterfall([function (callback) {
    Requirement.findOne({
      _id: requirementid
    }, null, function (err, requirement) {
      callback(err, requirement);
    });
  }], ep.done(function (requirement) {
    if (requirement.status === type.requirement_status_new) {
      Requirement.setOne({
        _id: requirementid,
      }, {
        status: type.requirement_status_not_respond,
      }, null, function (err) {});
    }

    if (requirement.order_designerids.length + designerids.length >= 3) {
      res.sendErrMsg('最多预约3个设计师');
    } else {
      _.forEach(designerids, function (designerid) {
        var json = {};
        json.designerid = designerid;
        json.userid = userid;
        json.requirementid = requirement._id;

        Plan.findOne({
          designerid: designerid,
          userid: userid,
          requirementid: requirement._id,
        }, null, ep.done(function (plan) {

          if (!plan) {
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
            }, ep.done(function (designer) {
              if (designer) {
                sms.sendYuyue(designer.phone);
              }
            }));
          }
        }));
      });

      Requirement.addToSet({
        _id: requirementid,
      }, {
        order_designerids: {
          $each: designerids
        }
      }, null, ep.done(function () {
        res.sendSuccessMsg;
      }));
    }
  }));
};
