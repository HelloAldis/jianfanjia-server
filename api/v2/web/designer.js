var validator = require('validator');
var eventproxy = require('eventproxy');
var Designer = require('../../../proxy').Designer;
var Product = require('../../../proxy').Product;
var Plan = require('../../../proxy').Plan;
var User = require('../../../proxy').User;
var Requirement = require('../../../proxy').Requirement;
var Favorite = require('../../../proxy').Favorite;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../config');
var async = require('async');
var ApiUtil = require('../../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var type = require('../../../type');
var limit = require('../../../middlewares/limit')
var designer_match_util = require('../../../common/designer_match');

var noPassAndToken = {
  pass: 0,
  accessToken: 0,
};

var noPrivateInfo = {
  pass: 0,
  accessToken: 0,
  uid: 0,
  phone: 0,
  email: 0,
  bank: 0,
  bank_card: 0,
}

exports.getInfo = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var ep = new eventproxy();
  ep.fail(next);

  Designer.findOne({
    _id: designerid
  }, noPassAndToken, ep.done(function (designer) {
    res.sendData(designer);
  }));
};

exports.updateInfo = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var designer = ApiUtil.buildDesinger(req);
  designer.auth_type = type.designer_auth_type_new;
  designer.auth_date = new Date().getTime();
  designer.auth_message = '';
  var ep = new eventproxy();
  ep.fail(next);

  Designer.setOne({
    _id: userid
  }, designer, {}, ep.done(function () {
    res.sendSuccessMsg();
  }));
};

exports.uid_bank_info = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var uidbank = ApiUtil.buildUidBank(req);
  uidbank.uid_auth_type = type.designer_auth_type_processing;
  uidbank.uid_auth_date = new Date().getTime();
  uidbank.uid_auth_message = '';
  var ep = new eventproxy();
  ep.fail(next);

  Designer.setOne({
    _id: userid
  }, uidbank, {}, ep.done(function () {
    res.sendSuccessMsg();
  }));
};

exports.email_info = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var email = tools.trim(req.body.email);
  var ep = new eventproxy();
  ep.fail(next);

  Designer.setOne({
    _id: userid
  }, {
    email: email,
    email_auth_type: type.designer_auth_type_processing,
    email_auth_date: new Date().getTime(),
    email_auth_message: '',
  }, {}, ep.done(function () {
    res.sendSuccessMsg();
  }));
};

exports.designer_home_page = function (req, res, next) {
  var designerid = req.body._id;
  var ep = new eventproxy();
  ep.fail(next);

  Designer.findOne({
    _id: designerid
  }, noPrivateInfo, ep.done(function (designer) {
    if (designer) {
      res.sendData(designer);

      limit.perwhatperdaydo('designergetone', req.ip + designerid, 1,
        function () {
          Designer.incOne({
            _id: designerid
          }, {
            view_count: 1
          }, {});
        });
    } else {
      res.sendData(null);
    }
  }));
}

exports.search = function (req, res, next) {
  var query = req.body.query;
  var sort = req.body.sort;
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  query.auth_type = type.designer_auth_type_done;
  var ep = new eventproxy();
  ep.fail(next);

  Designer.paginate(query, noPrivateInfo, {
    sort: sort,
    skip: skip,
    limit: limit,
  }, ep.done(function (designers, total) {
    res.sendData({
      designers: designers,
      total: total
    });
  }));
}

exports.okUser = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var requirementid = tools.trim(req.body.requirementid);
  var house_check_time = req.body.house_check_time;
  var ep = eventproxy();
  ep.fail(next);

  Plan.setOne({
    designerid: designerid,
    requirementid: requirementid,
    status: type.plan_status_not_respond,
  }, {
    house_check_time: house_check_time,
    status: type.plan_status_designer_respond_no_housecheck,
    last_status_update_time: new Date().getTime(),
  }, null, ep.done(function (plan) {
    if (plan) {
      Requirement.setOne({
        _id: plan.requirementid,
        status: type.requirement_status_not_respond,
      }, {
        status: type.requirement_status_respond_no_housecheck
      }, null, function (err) {});
    }

    res.sendSuccessMsg();
  }));
}

exports.rejectUser = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var requirementid = tools.trim(req.body.requirementid);
  var reject_respond_msg = req.body.reject_respond_msg;

  var ep = eventproxy();
  ep.fail(next);

  Plan.setOne({
    requirementid: requirementid,
    designerid: designerid,
    status: type.plan_status_not_respond,
  }, {
    status: type.plan_status_designer_reject,
    last_status_update_time: new Date().getTime(),
    reject_respond_msg: reject_respond_msg,
  }, null, ep.done(function () {
    res.sendSuccessMsg();
  }));
}

exports.auth = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var ep = eventproxy();
  ep.fail(next);

  Designer.setOne({
    _id: designerid
  }, {
    auth_type: type.designer_auth_type_processing,
    uid_auth_type: type.designer_auth_type_processing,
    auth_date: new Date().getTime(),
  }, {}, ep.done(function () {
    res.sendSuccessMsg();
  }));
}

exports.agree = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var ep = eventproxy();
  ep.fail(next);

  Designer.setOne({
    _id: designerid
  }, {
    'agreee_license': type.designer_agree_type_yes
  }, {}, ep.done(function () {
    res.sendSuccessMsg();
  }));
}

exports.update_online_status = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
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

exports.designers_user_can_order = function (req, res, next) {
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
            console.log(tools.findIndexObjectId(result.requirement.order_designerids,
              oid) < 0);
            return tools.findIndexObjectId(result.requirement.order_designerids,
              oid) < 0;
          });
      }

      var can_order_fav = [];
      if (result.favorite.favorite_designer) {
        can_order_fav = _.filter(result.favorite.favorite_designer,
          function (oid) {
            return tools.findIndexObjectId(result.requirement.order_designerids,
              oid) < 0 && tools.findIndexObjectId(result.requirement.rec_designerids,
              oid) < 0;
          });
      }

      async.parallel({
        rec_designer: function (callback) {
          Designer.find({
            _id: {
              $in: can_order_rec
            }
          }, {
            username: 1,
            imageid: 1,
            dec_districts: 1,
            dec_fee_all: 1,
            dec_fee_half: 1,
            dec_styles: 1,
            communication_type: 1,
            dec_house_types: 1,
            province: 1,
            city: 1,
            authed_product_count: 1,
            order_count: 1,
            deal_done_count: 1,
            auth_type: 1,
            uid_auth_type: 1,
            work_auth_type: 1,
            email_auth_type: 1,
          }, {
            lean: true
          }, function (err, designers) {
            _.forEach(designers, function (designer) {
              designer_match_util.designer_match(designer,
                result.requirement);
            });
            callback(err, designers)
          });
        },
        favorite_designer: function (callback) {
          Designer.find({
            _id: {
              $in: can_order_fav
            }
          }, {
            username: 1,
            imageid: 1,
            dec_districts: 1,
            dec_fee_all: 1,
            dec_fee_half: 1,
            dec_styles: 1,
            communication_type: 1,
            dec_house_types: 1,
            province: 1,
            city: 1,
            authed_product_count: 1,
            order_count: 1,
            deal_done_count: 1,
            auth_type: 1,
            uid_auth_type: 1,
            work_auth_type: 1,
            email_auth_type: 1,
          }, {
            lean: true
          }, function (err, designers) {
            _.forEach(designers, function (designer) {
              designer_match_util.designer_match(designer,
                result.requirement);
            });
            callback(err, designers)
          });
        },
      }, ep.done(function (result) {
        res.sendData(result);
      }));
    }));
}

exports.user_ordered_designers = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var requirementid = req.body.requirementid;
  var ep = eventproxy();
  ep.fail(next);

  async.waterfall([function (callback) {
    Requirement.findOne({
      _id: requirementid
    }, null, callback);
  }], ep.done(function (requirement) {
    if (requirement) {
      Designer.find({
        _id: {
          $in: requirement.order_designerids
        }
      }, {
        username: 1,
        imageid: 1,
        phone: 1,
        province: 1,
        city: 1,
        authed_product_count: 1,
        order_count: 1,
        deal_done_count: 1,
        auth_type: 1,
        uid_auth_type: 1,
        work_auth_type: 1,
        email_auth_type: 1,
      }, null, ep.done(function (designers) {
        async.mapLimit(designers, 3, function (designer, callback) {
          Plan.find({
            designerid: designer._id,
            requirementid: requirementid,
          }, {
            status: 1,
            house_check_time: 1,
          }, {
            skip: 0,
            limit: 1,
            sort: {
              last_status_update_time: -1
            },
          }, function (err, plans) {
            designer = designer.toObject();
            designer.plan = plans[0];
            if (tools.findIndexObjectId(requirement.rec_designerids,
                designer._id) > -1) {
              designer.is_rec = true;
            } else {
              designer.is_rec = false;
            }

            callback(err, designer);
          });
        }, ep.done(function (results) {
          res.sendData(results);
        }));
      }));
    } else {
      res.sendErrMsg('需求不存在');
    }
  }));
}