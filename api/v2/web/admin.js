'use strict'

const eventproxy = require('eventproxy');
const Designer = require('../../../proxy').Designer;
const Share = require('../../../proxy').Share;
const Team = require('../../../proxy').Team;
const User = require('../../../proxy').User;
const Product = require('../../../proxy').Product;
const ApiStatistic = require('../../../proxy').ApiStatistic;
const Requirement = require('../../../proxy').Requirement;
const Evaluation = require('../../../proxy').Evaluation;
const DecStrategy = require('../../../proxy').DecStrategy;
const BeautifulImage = require('../../../proxy').BeautifulImage;
const Process = require('../../../proxy').Process;
const Image = require('../../../proxy').Image;
const Plan = require('../../../proxy').Plan;
const Answer = require('../../../proxy').Answer;
const Supervisor = require('../../../proxy').Supervisor;
const TempUser = require('../../../proxy').TempUser;
const Diary = require('../../../proxy').Diary;
const Comment = require('../../../proxy').Comment;
const UserMessage = require('../../../proxy').UserMessage;
const DesignerMessage = require('../../../proxy').DesignerMessage;
const tools = require('../../../common/tools');
const _ = require('lodash');
const ue_config = require('../../../ueditor/ue_config');
const async = require('async');
const ApiUtil = require('../../../common/api_util');
const type = require('../../../type');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const sms = require('../../../common/sms');
const utility = require('utility');
const imageUtil = require('../../../common/image_util');
const message_util = require('../../../common/message_util');
const reg_util = require('../../../common/reg_util');
const validator = require('validator');
const push_url = require('../../../business/push_url');

exports.login = function (req, res, next) {
  if (req.body.username === 'sunny' && req.body.pass === '!@Jyz20150608#$') {
    req.session.userid = 'Admin';
    req.session.usertype = type.role_admin;
    res.cookie('username', 'Admin'); //cookie 有效期1天
    res.cookie('usertype', type.role_admin);

    res.sendSuccessMsg();
  } else {
    res.sendErrMsg('ooooooOps');
  }
}

exports.update_basic_auth = function (req, res, next) {
  let designerid = tools.trim(req.body._id);
  let new_auth_type = tools.trim(req.body.new_auth_type);
  let auth_message = tools.trim(req.body.auth_message);
  let ep = eventproxy();
  ep.fail(next);

  Designer.setOne({
    _id: designerid
  }, {
    auth_type: new_auth_type,
    auth_date: new Date().getTime(),
    auth_message: auth_message,
  }, {}, ep.done(function (designer) {
    if (designer) {
      if (new_auth_type === type.designer_auth_type_done) {
        message_util.designer_message_type_basic_auth_done(designer);
        sms.sendYzxAuthSuccess(designer.phone, [designer.username]);
        push_url.push_designer_url(designer._id);
      } else if (new_auth_type === type.designer_auth_type_reject) {
        message_util.designer_message_type_basic_auth_reject(designer, auth_message);
      }
    }

    res.sendSuccessMsg();
  }));
}

exports.update_uid_auth = function (req, res, next) {
  let designerid = tools.trim(req.body._id);
  let new_auth_type = tools.trim(req.body.new_auth_type);
  let auth_message = tools.trim(req.body.auth_message);
  let ep = eventproxy();
  ep.fail(next);

  Designer.setOne({
    _id: designerid
  }, {
    uid_auth_type: new_auth_type,
    uid_auth_date: new Date().getTime(),
    uid_auth_message: auth_message,
  }, {}, ep.done(function (designer) {
    if (designer) {
      if (new_auth_type === type.designer_auth_type_done) {
        message_util.designer_message_type_uid_auth_done(designer);
      } else if (new_auth_type === type.designer_auth_type_reject) {
        message_util.designer_message_type_uid_auth_reject(designer, auth_message);
      }
    }

    res.sendSuccessMsg();
  }));
}

exports.update_work_auth = function (req, res, next) {
  let designerid = tools.trim(req.body._id);
  let new_auth_type = tools.trim(req.body.new_auth_type);
  let auth_message = tools.trim(req.body.auth_message);
  let ep = eventproxy();
  ep.fail(next);

  Designer.setOne({
    _id: designerid
  }, {
    work_auth_type: new_auth_type,
    work_auth_date: new Date().getTime(),
    work_auth_message: auth_message,
  }, {}, ep.done(function (designer) {
    if (designer) {
      if (new_auth_type === type.designer_auth_type_done) {
        message_util.designer_message_type_work_auth_done(designer);
      } else if (new_auth_type === type.designer_auth_type_reject) {
        message_util.designer_message_type_work_auth_reject(designer, auth_message);
      }
    }

    res.sendSuccessMsg();
  }));
}

exports.update_product_auth = function (req, res, next) {
  let productid = tools.trim(req.body._id);
  let designerid = tools.trim(req.body.designerid);
  let new_auth_type = tools.trim(req.body.new_auth_type);
  let auth_message = tools.trim(req.body.auth_message);
  let ep = eventproxy();
  ep.fail(next);

  Product.setOne({
    _id: productid
  }, {
    auth_type: new_auth_type,
    auth_date: new Date().getTime(),
    auth_message: auth_message,
  }, {}, ep.done(function (product) {
    if (product) {
      if (new_auth_type === type.product_auth_type_done) {
        if (product.auth_type !== type.product_auth_type_done) {
          Designer.incOne({
            _id: designerid
          }, {
            authed_product_count: 1
          }, {
            upsert: true
          });
        }
        push_url.push_product_url(productid);
      } else if (new_auth_type !== type.product_auth_type_done) {
        if (product.auth_type === type.product_auth_type_done) {
          Designer.incOne({
            _id: designerid
          }, {
            authed_product_count: -1
          }, {
            upsert: true
          });
        }
      }

      Designer.findOne({
        _id: designerid
      }, {
        username: 1,
      }, function (err, designer) {
        if (new_auth_type === type.product_auth_type_done) {
          message_util.designer_message_type_product_auth_done(designer, product);
        } else if (new_auth_type === type.product_auth_type_reject) {
          message_util.designer_message_type_product_auth_reject(designer, product, auth_message);
        } else if (new_auth_type === type.product_auth_type_illegal) {
          message_util.designer_message_type_product_auth_illegal(designer, product, auth_message);
        }
      });
    }
    res.sendSuccessMsg();
  }));
}

exports.search_share = function (req, res, next) {
  let query = req.body.query;
  let skip = req.body.from || 0;
  let limit = req.body.limit || 10;
  let sort = req.body.sort || {
    create_at: -1,
  };
  let search_word = req.body.search_word;
  if (search_word && search_word.trim().length > 0) {
    if (tools.isValidObjectId(search_word)) {
      query['$or'] = [{
        _id: search_word
      }, {
        designerid: search_word
      }];
    } else {
      search_word = reg_util.reg(tools.trim(search_word), 'i');
      query['$or'] = [{
        cell: search_word
      }, {
        description: search_word
      }];
    }
  }
  let ep = eventproxy();
  ep.fail(next);

  Share.paginate(query, null, {
    sort: sort,
    skip: skip,
    limit: limit,
  }, ep.done(function (shares, totals) {
    async.mapLimit(shares, 3, function (share, callback) {
      Designer.findOne({
        _id: share.designerid
      }, {
        _id: 1,
        username: 1,
        imageid: 1,
        phone: 1,
      }, function (err, designer_indb) {
        let s = share.toObject();
        s.designer = designer_indb;
        callback(err, s);
      });
    }, ep.done(function (results) {
      res.sendData({
        shares: results,
        total: totals
      });
    }));
  }));
}

exports.add = function (req, res, next) {
  let share = ApiUtil.buildShare(req);
  let designerid = tools.trim(req.body.designerid);
  let userid = tools.trim(req.body.userid);
  let ep = eventproxy();
  ep.fail(next);

  if (userid) {
    share.userid = new ObjectId(userid);
  } else if (designerid) {
    share.designerid = new ObjectId(designerid);
  }

  share.progress = type.share_progress_going;
  Share.newAndSave(share, ep.done(function () {
    res.sendSuccessMsg();
  }));
};

exports.update = function (req, res, next) {
  let share = ApiUtil.buildShare(req);
  let shareid = tools.trim(req.body._id);
  let ep = eventproxy();
  ep.fail(next);

  share.lastupdate = new Date().getTime();
  Share.setOne({
    _id: shareid
  }, share, null, ep.done(function () {
    res.sendSuccessMsg();
  }));
};

exports.delete = function (req, res, next) {
  let _id = tools.trim(req.body._id);
  let ep = eventproxy();
  ep.fail(next);

  Share.removeOne({
    _id: _id
  }, null, ep.done(function () {
    res.sendSuccessMsg();
  }));
}

exports.listAuthingDesigner = function (req, res, next) {
  let ep = eventproxy();
  ep.fail(next);

  Designer.find({
    auth_type: type.designer_auth_type_processing
  }, {
    pass: 0,
    accessToken: 0
  }, {}, ep.done(function (designers) {
    res.sendData(designers);
  }));
};

exports.searchDesigner = function (req, res, next) {
  let query = req.body.query || {};
  let skip = req.body.from || 0;
  let limit = req.body.limit || 10;
  let sort = req.body.sort || {
    create_at: 1
  };
  let search_word = req.body.search_word;
  if (search_word && search_word.trim().length > 0) {
    if (tools.isValidObjectId(search_word)) {
      query['$or'] = [{
        _id: search_word
      }];
    } else {
      search_word = reg_util.reg(tools.trim(search_word), 'i');
      query['$or'] = [{
        phone: search_word
      }, {
        username: search_word
      }];
    }
  }
  let ep = eventproxy();
  ep.fail(next);

  Designer.paginate(query, {
    pass: 0,
    accessToken: 0
  }, {
    sort: sort,
    skip: skip,
    limit: limit
  }, ep.done(function (designers, total) {
    res.sendData({
      designers: designers,
      total: total
    });
  }));
}

exports.searchUser = function (req, res, next) {
  let query = req.body.query || {};
  let skip = req.body.from || 0;
  let limit = req.body.limit || 10;
  let sort = req.body.sort || {
    create_at: 1
  };
  let search_word = req.body.search_word;
  if (search_word && search_word.trim().length > 0) {
    if (tools.isValidObjectId(search_word)) {
      query['$or'] = [{
        _id: search_word
      }];
    } else {
      search_word = reg_util.reg(tools.trim(search_word), 'i');
      query['$or'] = [{
        phone: search_word
      }, {
        username: search_word
      }];
    }
  }
  let ep = eventproxy();
  ep.fail(next);

  User.paginate(query, {
    pass: 0,
    accessToken: 0
  }, {
    sort: sort,
    skip: skip,
    limit: limit
  }, ep.done(function (users, total) {
    async.mapLimit(users, 3, function (user, callback) {
      Requirement.find({
        userid: user._id,
      }, {
        status: 1,
      }, null, function (err, requirement) {
        user = user.toObject();
        user.requirement = requirement;
        callback(err, user);
      });
    }, ep.done(function (results) {
      res.sendData({
        users: results,
        total: total
      });
    }));
  }));
}

exports.searchProduct = function (req, res, next) {
  let query = req.body.query;
  let sort = req.body.sort || {
    create_at: 1
  };
  let skip = req.body.from || 0;
  let limit = req.body.limit || 10;
  let search_word = req.body.search_word;
  if (search_word && search_word.trim().length > 0) {
    if (tools.isValidObjectId(search_word)) {
      query['$or'] = [{
        _id: search_word
      }, {
        designerid: search_word
      }];
    } else {
      search_word = reg_util.reg(tools.trim(search_word), 'i');
      query['$or'] = [{
        cell: search_word
      }, {
        description: search_word
      }];
    }
  }
  let ep = eventproxy();
  ep.fail(next);

  Product.paginate(query, null, {
    sort: sort,
    skip: skip,
    limit: limit
  }, ep.done(function (products, total) {
    async.mapLimit(products, 3, function (product, callback) {
      Designer.findOne({
        _id: product.designerid,
      }, {
        username: 1,
        phone: 1
      }, function (err, designer) {
        product = product.toObject();
        product.designer = designer;
        callback(err, product);
      });
    }, ep.done(function (results) {
      res.sendData({
        products: results,
        total: total
      });
    }));
  }));
}

exports.search_plan = function (req, res, next) {
  let query = req.body.query || {};
  let sort = req.body.sort || {
    request_date: 1
  };
  let skip = req.body.from || 0;
  let limit = req.body.limit || 10;
  let search_word = req.body.search_word;
  if (search_word && search_word.trim().length > 0) {
    if (tools.isValidObjectId(search_word)) {
      query['$or'] = [{
        _id: search_word
      }, {
        userid: search_word
      }, {
        designerid: search_word
      }, {
        requirementid: search_word
      }];
    } else {
      search_word = reg_util.reg(tools.trim(search_word), 'i');
      query['$or'] = [{
        description: search_word
      }];
    }
  }
  let ep = eventproxy();
  ep.fail(next);

  Plan.paginate(query, null, {
    sort: sort,
    skip: skip,
    limit: limit
  }, ep.done(function (plans, total) {
    async.mapLimit(plans, 3, function (plan, callback) {
      Designer.findOne({
        _id: plan.designerid,
      }, {
        username: 1,
        phone: 1
      }, function (err, designer) {
        plan = plan.toObject();
        plan.designer = designer;
        callback(err, plan);
      });
    }, ep.done(function (plans) {
      async.mapLimit(plans, 3, function (plan, callback) {
        User.findOne({
          _id: plan.userid,
        }, {
          username: 1,
          phone: 1
        }, function (err, user) {
          plan.user = user;
          callback(err, plan);
        });
      }, ep.done(function (plans) {
        async.mapLimit(plans, 3, function (plan, callback) {
          Requirement.findOne({
            _id: plan.requirementid,
          }, {
            rec_designerids: 1,
          }, function (err, requirement) {
            plan.requirement = requirement;
            callback(err, plan);
          });
        }, ep.done(function (results) {
          res.sendData({
            requirements: results,
            total: total
          });
        }));
      }));
    }));
  }));
}


exports.getDesigner = function (req, res, next) {
  let designerid = req.params._id;
  let ep = eventproxy();
  ep.fail(next);

  Designer.findOne({
    _id: designerid
  }, {
    pass: 0,
    accessToken: 0
  }, ep.done(function (designer) {
    if (designer) {
      res.sendData(designer);
    } else {
      res.sendData({});
    }
  }));
}

exports.search_team = function (req, res, next) {
  let query = req.body.query || {};
  let sort = req.body.sort;
  let skip = req.body.from || 0;
  let limit = req.body.limit || 10;
  let ep = eventproxy();
  ep.fail(next);

  Team.paginate(query, null, {
    sort: sort,
    skip: skip,
    limit: limit
  }, ep.done(function (teams, total) {
    res.sendData({
      teams: teams,
      total: total
    });
  }));
}

exports.api_statistic = function (req, res, next) {
  let ep = eventproxy();
  ep.fail(next);

  ApiStatistic.find({}, {}, {
    sort: {
      count: -1
    }
  }, ep.done(function (arr) {
    res.sendData(arr);
  }));
};

exports.search_requirement = function (req, res, next) {
  let query = req.body.query || {};
  let sort = req.body.sort || {
    create_at: 1
  };
  let skip = req.body.from || 0;
  let limit = req.body.limit || 10;
  let search_word = req.body.search_word;
  if (search_word && search_word.trim().length > 0) {
    if (tools.isValidObjectId(search_word)) {
      query['$or'] = [{
        _id: search_word
      }, {
        userid: search_word
      }];
    } else {
      search_word = reg_util.reg(tools.trim(search_word), 'i');
      query['$or'] = [{
        basic_address: search_word
      }, {
        detail_address: search_word
      }];
    }
  }
  let ep = eventproxy();
  ep.fail(next);

  Requirement.paginate(query, null, {
    sort: sort,
    skip: skip,
    limit: limit,
    lean: true,
  }, ep.done(function (requirements, total) {
    async.mapLimit(requirements, 3, function (requirement, callback) {
      async.parallel({
        user: function (callback) {
          User.findOne({
            _id: requirement.userid,
          }, {
            username: 1,
            phone: 1
          }, callback);
        },
        evaluations: function (callback) {
          Evaluation.find({
            requirementid: requirement._id,
          }, null, {
            lean: true,
          }, function (err, evaluations) {
            async.mapLimit(evaluations, 3, function (
              evaluation, callback) {
              Designer.findOne({
                _id: evaluation.designerid
              }, {
                username: 1,
                phone: 1,
              }, function (err, designer) {
                evaluation.designer = designer;
                callback(err, evaluation);
              });
            }, callback);
          });
        },
      }, function (err, result) {
        requirement.user = result.user;
        requirement.evaluations = result.evaluations;
        callback(err, requirement);
      });
    }, ep.done(function (results) {
      res.sendData({
        requirements: results,
        total: total
      });
    }));
  }));
}

exports.search_process = function (req, res, next) {
  let query = req.body.query || {};
  let sort = req.body.sort || {
    create_at: 1
  };
  let skip = req.body.from || 0;
  let limit = req.body.limit || 10;
  let search_word = req.body.search_word;
  if (search_word && search_word.trim().length > 0) {
    if (tools.isValidObjectId(search_word)) {
      query['$or'] = [{
        _id: search_word
      }, {
        userid: search_word
      }, {
        final_designerid: search_word
      }, {
        requirementid: search_word
      }];
    } else {
      search_word = reg_util.reg(tools.trim(search_word), 'i');
      query['$or'] = [{
        basic_address: search_word
      }, {
        detail_address: search_word
      }];
    }
  }
  let ep = eventproxy();
  ep.fail(next);

  Process.paginate(query, null, {
    sort: sort,
    skip: skip,
    limit: limit,
    lean: true,
  }, ep.done(function (processes, total) {
    async.mapLimit(processes, 3, function (process, callback) {
      async.parallel({
        user: function (callback) {
          User.findOne({
            _id: process.userid,
          }, {
            username: 1,
            phone: 1
          }, callback);
        },
        designer: function (callback) {
          Designer.findOne({
            _id: process.final_designerid,
          }, {
            username: 1,
            phone: 1
          }, callback);
        },
      }, function (err, result) {
        process.user = result.user;
        process.designer = result.designer;
        callback(err, process);
      });
    }, ep.done(function (results) {
      res.sendData({
        processes: results,
        total: total
      });
    }));
  }));
}

exports.update_team = function (req, res, next) {
  let team = ApiUtil.buildTeam(req);
  let oid = tools.trim(req.body._id);
  let ep = eventproxy();
  ep.fail(next);

  if (oid === '') {
    res.sendErrMsg('信息不完全');
    return;
  }

  Team.setOne({
    _id: oid,
  }, team, null, ep.done(function () {
    res.sendSuccessMsg();
  }));
}

exports.update_designer_online_status = function (req, res, next) {
  let designerid = tools.trim(req.body.designerid);
  let new_oneline_status = tools.trim(req.body.new_oneline_status);

  let ep = eventproxy();
  ep.fail(next);

  Designer.setOne({
    _id: designerid
  }, {
    online_status: new_oneline_status,
    online_update_time: new Date().getTime(),
  }, {}, ep.done(function () {
    res.sendSuccessMsg();
  }));
}

exports.ueditor_get = function (req, res, next) {
  let action = req.query.action;

  switch (action) {
    case 'config':
      res.json(ue_config);
      break;
    default:
      res.sendErrMsg('请求地址有误');
      break;
  }
}

exports.ueditor_post = function (req, res, next) {
  let ep = eventproxy();
  ep.fail(next);
  let action = req.query.action;

  switch (action) {
    case 'uploadimage':
      let data = req.file.buffer;
      let userid = ApiUtil.getUserid(req);
      let md5 = utility.md5(data);

      Image.findOne({
        md5: md5
      }, null, ep.done(function (image) {
        if (image) {
          res.json({
            url: image._id,
            title: req.file.originalname,
            original: req.file.originalname,
            state: 'SUCCESS',
          });
        } else {
          imageUtil.jpgbuffer(data, ep.done(function (buf) {
            Image.newAndSave(md5, buf, userid, ep.done(function (
              savedImage) {
              res.json({
                url: savedImage._id,
                title: req.file.originalname,
                original: req.file.originalname,
                state: 'SUCCESS',
              });
            }));
          }));
        }
      }));
      break;
    default:
      res.sendErrMsg('请求地址有误');
      break;
  }
}


/*
23/Nov/2015:07:52:27 +0000 59.173.226.250 - GET - /api/v2/web/admin/ueditor?action=listimage&start=0&size=20&noCache=1448265381556
HTTP/1.1/Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36 200 32 - 0.604 ms
*/

exports.add_article = function (req, res, next) {
  let article = ApiUtil.buildArticle(req);
  article.status = type.article_status_private;
  article.authorid = ApiUtil.getUserid(req);
  article.usertype = ApiUtil.getUsertype(req);
  let ep = eventproxy();
  ep.fail(next);

  switch (article.articletype) {
    case type.articletype_dec_strategy:
    case type.articletype_dec_tip:
      DecStrategy.newAndSave(article, ep.done(function (dec_strategy) {
        res.sendSuccessMsg();
      }));
      break;
    default:
      res.sendErrMsg('请求articletype类型错误');
  }
}

exports.update_article = function (req, res, next) {
  let article = ApiUtil.buildArticle(req);
  let _id = req.body._id;
  let ep = eventproxy();
  ep.fail(next);

  DecStrategy.setOne({
    _id: _id
  }, article, null, ep.done(function (dec_strategy) {
    res.sendSuccessMsg();
    push_url.push_strategy_url(dec_strategy._id);
  }));
}

exports.search_article = function (req, res, next) {
  let query = req.body.query || {};
  let sort = req.body.sort || {
    create_at: -1
  };
  let skip = req.body.from || 0;
  let limit = req.body.limit || 10;
  let search_word = req.body.search_word;
  if (search_word && search_word.trim().length > 0) {
    if (tools.isValidObjectId(search_word)) {
      query['$or'] = [{
        _id: search_word
      }];
    } else {
      search_word = reg_util.reg(tools.trim(search_word), 'i');
      query['$or'] = [{
        title: search_word
      }];
    }
  }
  let ep = eventproxy();
  ep.fail(next);

  let project = null;
  if (limit > 1) {
    project = {
      title: 1,
      create_at: 1,
      lastupdate: 1,
      status: 1,
      articletype: 1,
    };
  }

  DecStrategy.paginate(query, project, {
    sort: sort,
    skip: skip,
    limit: limit
  }, ep.done(function (articles, total) {
    res.sendData({
      articles: articles,
      total: total
    });
  }));
}

exports.add_beautiful_image = function (req, res, next) {
  let beautifulImage = ApiUtil.buildBeautifulImage(req);
  beautifulImage.status = type.beautiful_image_status_private;
  beautifulImage.authorid = ApiUtil.getUserid(req);
  beautifulImage.usertype = ApiUtil.getUsertype(req);

  let ep = eventproxy();
  ep.fail(next);

  BeautifulImage.newAndSave(beautifulImage, ep.done(function (beautifulImage) {
    res.sendSuccessMsg();
  }));
}

exports.update_beautiful_image = function (req, res, next) {
  let beautifulImage = ApiUtil.buildBeautifulImage(req);
  let _id = req.body._id;
  let ep = eventproxy();
  ep.fail(next);

  BeautifulImage.setOne({
    _id: _id
  }, beautifulImage, null, ep.done(function (beautifulImage) {
    res.sendSuccessMsg();
  }));
}

exports.search_beautiful_image = function (req, res, next) {
  let query = req.body.query || {};
  let sort = req.body.sort || {
    create_at: -1
  };
  let skip = req.body.from || 0;
  let limit = req.body.limit || 10;
  let search_word = req.body.search_word;
  if (search_word && search_word.trim().length > 0) {
    if (tools.isValidObjectId(search_word)) {
      query['$or'] = [{
        _id: search_word
      }];
    } else {
      search_word = reg_util.reg(tools.trim(search_word), 'i');
      query['$or'] = [{
        title: search_word
      }];
    }
  }
  let ep = eventproxy();
  ep.fail(next);

  let project = null;
  if (limit > 1) {
    project = {
      title: 1,
      create_at: 1,
      lastupdate: 1,
      status: 1,
      images: 1,
    };
  }

  BeautifulImage.paginate(query, project, {
    sort: sort,
    skip: skip,
    limit: limit
  }, ep.done(function (beautifulImages, total) {
    res.sendData({
      beautifulImages: beautifulImages,
      total: total
    });
  }));
}

exports.search_answer = function (req, res, next) {
  let query = req.body.query || {};
  let sort = req.body.sort || {
    questionid: 1
  };
  let skip = req.body.from || 0;
  let limit = req.body.limit || 10;
  let ep = eventproxy();
  ep.fail(next);

  Answer.paginate(query, null, {
    sort: sort,
    skip: skip,
    limit: limit,
    lean: true,
  }, ep.done(function (answers, total) {
    async.mapLimit(answers, 3, function (answer, callback) {
      if (answer.userid && answer.usertype) {
        if (answer.usertype === type.role_user) {
          User.find({
            _id: answer.userid,
          }, {
            username: 1,
          }, function (err, user) {
            answer.by = user;
            callback(err, answer);
          });
        } else if (answer.usertype === type.role_designer) {
          Designer.find({
            _id: answer.userid,
          }, {
            username: 1,
          }, function (err, designer) {
            answer.by = designer;
            callback(err, answer);
          });
        } else {
          callback(null, answer);
        }
      } else {
        callback(null, answer);
      }
    }, ep.done(function (results) {
      res.sendData({
        answers: results,
        total: total
      });
    }));
  }))
}

exports.count_answer = function (req, res, next) {
  let wenjuanid = req.body.wenjuanid;
  let questionid = req.body.questionid;
  let ep = eventproxy();
  ep.fail(next);

  Answer.find({
    wenjuanid: wenjuanid
  }, {
    choice_answer: 1,
    text_answer: 1,
    questionid: 1,
  }, {
    sort: {
      questionid: 1
    }
  }, ep.done(function (answers) {
    let result = [];
    for (let answer of answers) {
      let a = _.find(result, function (o) {
        return o.questionid === answer.questionid;
      });

      if (!a) {
        a = {
          questionid: answer.questionid,
          answer_count: [],
        }
        result.push(a);
      }

      for (let i = 0; i < answer.choice_answer.length; i++) {
        if (a.answer_count[answer.choice_answer[i]]) {
          a.answer_count[answer.choice_answer[i]] = a.answer_count[
            answer.choice_answer[i]] + 1;
        } else {
          a.answer_count[answer.choice_answer[
            i]] = 1;
        }
      }
    }

    for (let i = 0; i < result.length; i++) {
      if (result[i]) {
        for (let j = 0; j < result[i].answer_count.length; j++) {
          if (!result[i].answer_count[j]) {
            result[i].answer_count[j] = 0;
          }
        }
      }
    }

    res.sendData(result);
  }));
}

exports.add_supervisor = function (req, res, next) {
  let phone = validator.trim(req.body.phone);
  let pass = validator.trim(req.body.pass);
  let username = validator.trim(req.body.username);
  let ep = eventproxy();
  ep.fail(next);

  async.parallel({
    supervisor: function (callback) {
      Supervisor.findOne({
        phone: phone,
      }, null, callback);
    }
  }, ep.done(function (result) {
    if (result.supervisor) {
      res.sendErrMsg('手机号已经存在！');
      return;
    }

    tools.bhash(pass, ep.done(function (passhash) {
      Supervisor.newAndSave({
        phone: phone,
        pass: passhash,
        username: username,
        auth_type: type.designer_auth_type_done,
      }, ep.done(function (supervisor_indb) {
        res.sendData(supervisor_indb);
      }));
    }));
  }));
}

exports.statistic_info = function (req, res, next) {
  const querys = req.body.querys;
  const ep = eventproxy();
  ep.fail(next);

  const map = {
    requirement: Requirement.count,
    user: User.count,
    designer: Designer.count,
    plans: Plan.count,
    product: Product.count,
    live: Share.count,
    fieldList: Process.count,
    recruit: TempUser.count,
    news: DecStrategy.count,
    pictures: BeautifulImage.count,
  }

  async.mapLimit(querys, 3, function (q, callback) {
    async.mapLimit(q.querys, 3, function (query, callback) {
      map[q.key](query, callback);
    }, callback);
  }, ep.done(function (statistic) {
    res.sendData(statistic);
  }));
}

exports.update_designer = function (req, res, next) {
  const designerid = req.body.designer._id;
  const designer = ApiUtil.buildAdminDesingerUpdate(req);
  let ep = new eventproxy();
  ep.fail(next);

  Designer.setOne({
    _id: designerid
  }, designer, null, ep.done(function (designer) {
    res.sendSuccessMsg();
  }));
};

exports.search_diary = function (req, res, next) {
  let query = req.body.query || {};
  let sort = req.body.sort || {
    create_at: -1
  };
  let skip = req.body.from || 0;
  let limit = req.body.limit || 10;
  let search_word = req.body.search_word;
  if (search_word && search_word.trim().length > 0) {
    if (tools.isValidObjectId(search_word)) {
      query['$or'] = [{
        _id: search_word
      }, {
        diarySetid: search_word
      }, {
        authorid: search_word
      }];
    } else {
      search_word = reg_util.reg(tools.trim(search_word), 'i');
      query['$or'] = [{
        content: search_word
      }];
    }
  }

  let ep = eventproxy();
  ep.fail(next);

  Diary.paginate(query, null, {
    sort: sort,
    skip: skip,
    limit: limit,
    lean: true
  }, ep.done(function (diaries, total) {
    async.mapLimit(diaries, 3, function (diary, callback) {
      User.findOne({
        _id: diary.authorid
      }, {
        username: 1,
      }, function (err, user) {
        diary.user = user;
        callback(err, diary);
      });
    }, ep.done(function (diaries) {
      res.sendData({
        diaries: diaries,
        total: total
      });
    }));
  }));
}

exports.delete_diary = function (req, res, next) {
  const diaryid = req.body.diaryid;
  const ep = new eventproxy();
  ep.fail(next);

  if (!tools.convert2ObjectId(diaryid)) {
    res.sendErrMsg('信息不完全');
    return;
  }

  Diary.removeOne({
    _id: diaryid
  }, null, ep.done(function (diary) {
    res.sendSuccessMsg();

    if (diary) {
      Comment.removeSome({
        topicid: diary._id
      }, function (err, re) {});

      UserMessage.removeSome({
        topicid: diary._id
      }, function (err, re) {});
    }

  }));
}

exports.search_comment = function (req, res, next) {
  let query = req.body.query || {};
  let sort = req.body.sort || {
    create_at: -1
  };
  let skip = req.body.from || 0;
  let limit = req.body.limit || 10;
  let search_word = req.body.search_word;
  if (search_word && search_word.trim().length > 0) {
    if (tools.isValidObjectId(search_word)) {
      query['$or'] = [{
        _id: search_word
      }, {
        topicid: search_word
      }, {
        by: search_word
      }];
    } else {
      search_word = reg_util.reg(tools.trim(search_word), 'i');
      query['$or'] = [{
        content: search_word
      }];
    }
  }

  let ep = eventproxy();
  ep.fail(next);

  Comment.paginate(query, null, {
    sort: sort,
    skip: skip,
    limit: limit,
    lean: true
  }, ep.done(function (comments, total) {
    res.sendData({
      comments: comments,
      total: total
    });
  }));
}

exports.forbid_comment = function (req, res, next) {
  let commentid = req.body.commentid;
  const content = '我错了，我再也不乱说话了！';
  let ep = eventproxy();
  ep.fail(next);

  Comment.setOne({
    _id: commentid,
  }, {
    content: content
  }, ep.done(function () {
    res.sendSuccessMsg();

    UserMessage.setOne({
      commentid: commentid
    }, {
      content: content,
    }, function () {});

    DesignerMessage.setOne({
      commentid: commentid
    }, {
      content: content,
    }, function () {});
  }));
}

exports.assign_supervisor = function (req, res, next) {
  const supervisorids = _.map(req.body.supervisorids, function (i) {
    return tools.convert2ObjectId(i);
  });;
  let ep = eventproxy();
  ep.fail(next);

  Process.addToSet({
    _id: requirementid,
  }, {
    supervisorids: {
      $each: supervisorids
    }
  }, null, ep.done(function () {
    res.sendSuccessMsg();
  }));
}

exports.search_supervisor = function (req, res, next) {
  let query = req.body.query || {};
  let sort = req.body.sort || {
    create_at: -1
  };
  let skip = req.body.from || 0;
  let limit = req.body.limit || 10;
  let search_word = req.body.search_word;
  if (search_word && search_word.trim().length > 0) {
    if (tools.isValidObjectId(search_word)) {
      query['$or'] = [{
        _id: search_word
      }];
    } else {
      search_word = reg_util.reg(tools.trim(search_word), 'i');
      query['$or'] = [{
        phone: search_word
      }, {
        username: search_word
      }];
    }
  }

  Supervisor.paginate(query, null, {
    sort: sort,
    skip: skip,
    limit: limit,
    lean: true
  }, ep.done(function (supervisors, total) {
    res.sendData({
      supervisors: supervisors,
      total: total
    });
  }));
}
