"use strict";

const validator = require('validator');
const eventproxy = require('eventproxy');
const User = require('../../../proxy').User;
const Plan = require('../../../proxy').Plan;
const Requirement = require('../../../proxy').Requirement;
const Designer = require('../../../proxy').Designer;
const Evaluation = require('../../../proxy').Evaluation;
const Favorite = require('../../../proxy').Favorite;
const VerifyCode = require('../../../proxy').VerifyCode;
const tools = require('../../../common/tools');
const _ = require('lodash');
const config = require('../../../apiconfig');
const ApiUtil = require('../../../common/api_util');
const DateUtil = require('../../../common/date_util');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const type = require('../../../type');
const async = require('async');
const sms = require('../../../common/sms');
const moment = require('moment');
const authMiddleWare = require('../../../middlewares/auth');
const message_util = require('../../../common/message_util');

exports.user_my_info = function (req, res, next) {
  let userid = req.params._id || ApiUtil.getUserid(req);
  let ep = eventproxy();
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

exports.user_update_info = function (req, res, next) {
  let userid = ApiUtil.getUserid(req);
  let user = ApiUtil.buildUser(req);
  let ep = eventproxy();
  ep.fail(next);

  console.log(user);
  User.setOne({
    _id: userid
  }, user, {
    new: true
  }, ep.done(function (user) {
    authMiddleWare.gen_session(user, type.role_user, req, res);
    res.sendSuccessMsg();
  }));
};

exports.order_designer = function (req, res, next) {
  let designerids = _.map(req.body.designerids, function (e) {
    return new ObjectId(e);
  });
  let requirementid = req.body.requirementid;
  let userid = ApiUtil.getUserid(req);
  let ep = eventproxy();
  ep.fail(next);

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

    if (requirement.order_designerids.length + designerids.length > 3) {
      res.sendErrMsg('最多预约3个设计师');
    } else {
      _.forEach(designerids, function (designerid) {
        let json = {};
        json.designerid = designerid;
        json.userid = userid;
        json.requirementid = requirement._id;

        Plan.findOne({
          designerid: designerid,
          userid: userid,
          requirementid: requirement._id,
        }, null, ep.done(function (plan) {

          if (!plan) {
            Plan.newAndSave(json, ep.done(function (plan_indb) {}));

            Designer.incOne({
              _id: designerid
            }, {
              order_count: 1
            }, {});

            Designer.findOne({
              _id: designerid
            }, {
              phone: 1,
              username: 1
            }, ep.done(function (designer) {
              if (designer) {
                User.findOne({
                  _id: userid
                }, {
                  username: 1,
                  phone: 1
                }, ep.done(function (user) {
                  message_util.designer_message_type_user_order(user, designer, requirement);
                  sms.sendUserOrderDesigner(designer.phone, [user.username]);
                }));
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
        res.sendSuccessMsg();
      }));
    }
  }));
};

exports.user_change_ordered_designer = function (req, res, next) {
  let requirementid = req.body.requirementid;
  let userid = ApiUtil.getUserid(req);
  let old_designerid = new ObjectId(req.body.old_designerid);
  let new_designerid = new ObjectId(req.body.new_designerid);
  let ep = eventproxy();
  ep.fail(next);

  async.waterfall([function (callback) {
    Requirement.findOne({
      _id: requirementid
    }, null, function (err, requirement) {
      callback(err, requirement);
    });
  }], ep.done(function (requirement) {
    if (!requirement) {
      return res.sendErrMsg('需求不存在');
    }

    let json = {};
    json.designerid = new_designerid;
    json.userid = userid;
    json.requirementid = requirement._id;

    Plan.findOne(json, null, ep.done(function (plan) {
      if (!plan) {
        Plan.newAndSave(json, ep.done(function (plan_indb) {}));

        Designer.incOne({
          _id: new_designerid
        }, {
          order_count: 1
        }, {});

        Designer.findOne({
          _id: new_designerid
        }, {
          phone: 1,
          username: 1,
        }, ep.done(function (designer) {
          if (designer) {
            User.findOne({
              _id: userid
            }, {
              username: 1,
              phone: 1
            }, ep.done(function (user) {
              message_util.designer_message_type_user_order(user, designer, requirement);
              sms.sendUserOrderDesigner(designer.phone, [user.username]);
            }));
          }
        }));
      }
    }));

    Requirement.pull({
      _id: requirementid,
    }, {
      order_designerids: old_designerid
    }, null, ep.done(function () {
      Requirement.addToSet({
        _id: requirementid,
      }, {
        order_designerids: new_designerid,
        obsolete_designerids: old_designerid,
      }, null, ep.done(function () {
        res.sendSuccessMsg();
      }));
    }));
  }));
}

exports.designer_house_checked = function (req, res, next) {
  let designerid = req.body.designerid
  let requirementid = req.body.requirementid;
  let ep = eventproxy();
  ep.fail(next);

  let time = new Date().getTime();
  Plan.setOne({
    designerid: designerid,
    requirementid: requirementid,
    status: type.plan_status_designer_respond_no_housecheck,
  }, {
    status: type.plan_status_designer_housecheck_no_plan,
    last_status_update_time: time,
    user_ok_house_check_time: time,
  }, null, ep.done(function (plan) {
    if (plan) {
      Requirement.setOne({
        _id: plan.requirementid,
        status: type.requirement_status_respond_no_housecheck,
      }, {
        status: type.requirement_status_housecheck_no_plan
      }, null, function (err) {});

      async.parallel({
        user: function (callback) {
          User.findOne({
            _id: ApiUtil.getUserid(req),
          }, {
            username: 1,
            phone: 1,
          }, callback);
        },
        designer: function (callback) {
          Designer.findOne({
            _id: designerid,
          }, {
            username: 1,
            phone: 1,
          }, callback);
        }
      }, function (err, result) {
        if (!err && result.user && result.designer) {
          message_util.designer_message_type_user_ok_house_checked(result.user, result.designer, {
            _id: requirementid,
          });
          sms.sendRemimdDesignerPlan(result.designer.phone, [result.designer.username]);
        }
      });
    }

    res.sendSuccessMsg();
  }));
}

exports.user_evaluate_designer = function (req, res, next) {
  let evaluation = ApiUtil.buildEvaluation(req);
  evaluation.userid = ApiUtil.getUserid(req);
  let ep = eventproxy();
  ep.fail(next);

  Evaluation.setOne({
    userid: evaluation.userid,
    designerid: evaluation.designerid,
    requirementid: evaluation.requirementid,
  }, evaluation, {
    upsert: true,
  }, ep.done(function () {

    Evaluation.count({
      designerid: evaluation.designerid,
    }, ep.done(function (count) {
      Designer.findOne({
        _id: evaluation.designerid
      }, {
        service_attitude: 1,
        respond_speed: 1,
      }, ep.done(function (designer) {
        if (designer) {
          if (!designer.service_attitude) {
            designer.service_attitude = 0;
          }

          if (!designer.respond_speed) {
            designer.respond_speed = 0;
          }
          designer.service_attitude = ((designer.service_attitude *
              (count - 1)) + evaluation.service_attitude) /
            count;
          designer.respond_speed = ((designer.respond_speed *
              (count - 1)) + evaluation.respond_speed) /
            count;
          designer.save(ep.done(function () {
            res.sendSuccessMsg();
          }));
        } else {
          res.sendErrMsg('评价失败');
        }
      }));
    }));
  }));
}

exports.user_statistic_info = function (req, res, next) {
  let _id = ApiUtil.getUserid(req);
  let ep = eventproxy();
  ep.fail(next);

  async.parallel({
    requirement_count: function (callback) {
      Requirement.count({
        userid: _id,
      }, callback);
    },
    favorite: function (callback) {
      Favorite.findOne({
        userid: _id,
      }, callback);
    },
    user: function (callback) {
      User.findOne({
        _id: _id,
      }, {
        username: 1,
        imageid: 1,
      }, callback);
    },
  }, ep.done(function (result) {
    if (!result.user) {
      return res.sendErrMsg('没有登录');
    }

    let favorite_product_count = 0;
    let favorite_designer_count = 0;
    if (result.favorite) {
      if (result.favorite.favorite_product) {
        favorite_product_count = result.favorite.favorite_product.length;
      }

      if (result.favorite.favorite_designer) {
        favorite_designer_count = result.favorite.favorite_designer.length;
      }
    }

    res.sendData({
      username: result.user.username,
      imageid: result.user.imageid,
      requirement_count: result.requirement_count,
      favorite_product_count: favorite_product_count,
      favorite_designer_count: favorite_designer_count,
    });
  }));
}

exports.user_bind_phone = function (req, res, next) {
  let phone = req.body.phone;
  let code = req.body.code;
  let _id = ApiUtil.getUserid(req);
  let ep = eventproxy();
  ep.fail(next);

  //检查phone是不是被用了
  ep.all('user', 'designer', function (user, designer) {
    if (user || designer) {
      res.sendErrMsg('手机号码已被使用');
    } else {
      //用户名手机号验证通过
      VerifyCode.findOne({
        phone: phone
      }, ep.done(function (verifyCode) {
        if (config.need_verify_code) {
          if (!verifyCode) {
            return res.sendErrMsg('验证码不对或已过期');
          }

          if (verifyCode.code !== code) {
            return res.sendErrMsg('验证码不对或已过期');
          }
        }

        User.setOne({
          _id: _id,
        }, {
          phone: phone,
        }, null, ep.done(function () {
          res.sendSuccessMsg();
        }));
      }));
    }
  });

  User.findOne({
    phone: phone
  }, null, ep.done(function (user) {
    ep.emit('user', user);
  }));

  Designer.findOne({
    phone: phone
  }, {}, ep.done(function (designer) {
    ep.emit('designer', designer);
  }));
}

exports.user_bind_wechat = function (req, res, next) {
  let wechat_unionid = req.body.wechat_unionid;
  let wechat_openid = req.body.wechat_openid;
  let _id = ApiUtil.getUserid(req);
  let ep = eventproxy();
  ep.fail(next);

  if ([wechat_unionid, wechat_openid].some(function (item) {
      return !item;
    })) {
    return res.sendErrMsg('信息不完整。');
  }

  //检查phone是不是被用了
  ep.all('user', function (user) {
    if (user) {
      res.sendErrMsg('此微信号已经被其他账号绑定');
    } else {
      //用户名手机号验证通过
      User.setOne({
        _id: _id,
      }, {
        wechat_unionid: wechat_unionid,
        wechat_openid: wechat_openid,
      }, null, ep.done(function () {
        res.sendSuccessMsg();
      }));
    }
  });

  User.findOne({
    wechat_unionid: wechat_unionid,
    _id: {
      $ne: _id
    },
  }, null, ep.done(function (user) {
    ep.emit('user', user);
  }));
}
