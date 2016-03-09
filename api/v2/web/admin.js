var validator = require('validator');
var eventproxy = require('eventproxy');
var Designer = require('../../../proxy').Designer;
var Share = require('../../../proxy').Share;
var Team = require('../../../proxy').Team;
var User = require('../../../proxy').User;
var Product = require('../../../proxy').Product;
var ApiStatistic = require('../../../proxy').ApiStatistic;
var Requirement = require('../../../proxy').Requirement;
var Evaluation = require('../../../proxy').Evaluation;
var DecStrategy = require('../../../proxy').DecStrategy;
var BeautifulImage = require('../../../proxy').BeautifulImage;
var Process = require('../../../proxy').Process;
var Image = require('../../../proxy').Image;
var Plan = require('../../../proxy').Plan;
var Answer = require('../../../proxy').Answer;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../apiconfig');
var ue_config = require('../../../ueditor/ue_config');
var async = require('async');
var ApiUtil = require('../../../common/api_util');
var type = require('../../../type');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var sms = require('../../../common/sms');
var utility = require('utility');
var imageUtil = require('../../../common/image_util');
var message_util = require('../../../common/message_util');

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
  var designerid = tools.trim(req.body._id);
  var new_auth_type = tools.trim(req.body.new_auth_type);
  var auth_message = tools.trim(req.body.auth_message);
  var ep = eventproxy();
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
      } else if (new_auth_type === type.designer_auth_type_reject) {
        message_util.designer_message_type_basic_auth_reject(designer, auth_message);
      }
    }

    res.sendSuccessMsg();
  }));
}

exports.update_uid_auth = function (req, res, next) {
  var designerid = tools.trim(req.body._id);
  var new_auth_type = tools.trim(req.body.new_auth_type);
  var auth_message = tools.trim(req.body.auth_message);
  var ep = eventproxy();
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
  var designerid = tools.trim(req.body._id);
  var new_auth_type = tools.trim(req.body.new_auth_type);
  var auth_message = tools.trim(req.body.auth_message);
  var ep = eventproxy();
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
  var productid = tools.trim(req.body._id);
  var designerid = tools.trim(req.body.designerid);
  var new_auth_type = tools.trim(req.body.new_auth_type);
  var auth_message = tools.trim(req.body.auth_message);
  var ep = eventproxy();
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

      if (new_auth_type === type.product_auth_type_done) {
        message_util.designer_message_type_product_auth_done(designer, product);
      } else if (new_auth_type === type.product_auth_type_reject) {
        message_util.designer_message_type_work_auth_reject(designer, product);
      } else if (new_auth_type === type.product_auth_type_illegal) {
        message_util.designer_message_type_product_auth_illegal(designer, product);
      }
    }
    res.sendSuccessMsg();
  }));
}

exports.search_share = function (req, res, next) {
  var query = req.body.query;
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
  ep.fail(next);

  Share.paginate(query, null, {
    sort: {
      create_at: -1,
    },
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
        var s = share.toObject();
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
  var share = ApiUtil.buildShare(req);
  var designerid = tools.trim(req.body.designerid);
  var userid = tools.trim(req.body.userid);
  var ep = eventproxy();
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
  var share = ApiUtil.buildShare(req);
  var shareid = tools.trim(req.body._id);
  var ep = eventproxy();
  ep.fail(next);

  share.lastupdate = new Date().getTime();
  Share.setOne({
    _id: shareid
  }, share, null, ep.done(function () {
    res.sendSuccessMsg();
  }));
};

exports.delete = function (req, res, next) {
  var _id = tools.trim(req.body._id);
  var ep = eventproxy();
  ep.fail(next);

  Share.removeOne({
    _id: _id
  }, null, ep.done(function () {
    res.sendSuccessMsg();
  }));
}

exports.listAuthingDesigner = function (req, res, next) {
  var ep = eventproxy();
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
  var query = req.body.query;
  var phone = tools.trim(query.phone);
  var phoneReg = new RegExp('^' + tools.trim(phone));
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
  ep.fail(next);

  if (phone) {
    query['$or'] = [{
      phone: phoneReg
    }, {
      username: phoneReg
    }];
  }
  delete query.phone;

  Designer.paginate(query, {
    pass: 0,
    accessToken: 0
  }, {
    sort: {
      create_at: 1
    },
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
  var query = req.body.query;
  var phone = tools.trim(query.phone);
  var phoneReg = new RegExp('^' + tools.trim(phone));
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
  ep.fail(next);

  if (phone) {
    query['$or'] = [{
      phone: phoneReg
    }, {
      username: phoneReg
    }];
  }
  delete query.phone;

  User.paginate(query, {
    pass: 0,
    accessToken: 0
  }, {
    sort: {
      create_at: 1
    },
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
  var query = req.body.query;
  var sort = req.body.sort || {
    create_at: 1
  };
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
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
  var query = req.body.query;
  var sort = req.body.sort || {
    request_date: 1
  };
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
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
  var designerid = req.params._id;
  var ep = eventproxy();
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
  var query = req.body.query || {};
  var sort = req.body.sort;
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
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
  var ep = eventproxy();
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
  var query = req.body.query || {};
  var sort = req.body.sort || {
    create_at: 1
  };
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
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
  var query = req.body.query || {};
  var sort = req.body.sort || {
    create_at: 1
  };
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
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
  var team = ApiUtil.buildTeam(req);
  var oid = tools.trim(req.body._id);

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
  var designerid = tools.trim(req.body.designerid);
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

exports.ueditor_get = function (req, res, next) {
  var action = req.query.action;

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
  var ep = eventproxy();
  ep.fail(next);
  var action = req.query.action;

  switch (action) {
    case 'uploadimage':
      var data = req.file.buffer;
      var userid = ApiUtil.getUserid(req);
      var md5 = utility.md5(data);

      Image.findOne({
        'md5': md5,
        'userid': userid
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
  var article = ApiUtil.buildArticle(req);
  var articletype = req.body.articletype;
  article.status = type.article_status_private;
  article.authorid = ApiUtil.getUserid(req);
  article.usertype = ApiUtil.getUsertype(req);
  var ep = eventproxy();
  ep.fail(next);

  switch (articletype) {
    case type.articletype_dec_strategy:
    case type.articletype_dec_tip:
      article.articletype = articletype;
      DecStrategy.newAndSave(article, ep.done(function (dec_strategy) {
        res.sendSuccessMsg();
      }));
      break;
    default:
      res.sendErrMsg('请求articletype类型错误');
  }
}

exports.update_article = function (req, res, next) {
  var article = ApiUtil.buildArticle(req);
  var articletype = req.body.articletype;
  var _id = req.body._id;
  var ep = eventproxy();
  ep.fail(next);

  article.articletype = articletype;
  DecStrategy.setOne({
    _id: _id
  }, article, null, ep.done(function (dec_strategy) {
    res.sendSuccessMsg();
  }));
}

exports.search_article = function (req, res, next) {
  var query = req.body.query || {};
  var sort = req.body.sort || {
    create_at: -1
  };
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var articletype = req.body.articletype;
  var ep = eventproxy();
  ep.fail(next);

  var project = null;
  if (limit > 1) {
    project = {
      title: 1,
      create_at: 1,
      lastupdate: 1,
      status: 1,
      articletype: 1,
    };
  }

  switch (articletype) {
    case undefined:
    case type.articletype_dec_strategy:
    case type.articletype_dec_tip:
      query.articletype = articletype;
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
      break;
    default:
      res.sendErrMsg('请求articletype类型错误');
  }
}

exports.add_beautiful_image = function (req, res, next) {
  var beautifulImage = ApiUtil.buildBeautifulImage(req);
  beautifulImage.status = type.beautiful_image_status_private;
  beautifulImage.authorid = ApiUtil.getUserid(req);
  beautifulImage.usertype = ApiUtil.getUsertype(req);

  var ep = eventproxy();
  ep.fail(next);

  BeautifulImage.newAndSave(beautifulImage, ep.done(function (beautifulImage) {
    res.sendSuccessMsg();
  }));
}

exports.update_beautiful_image = function (req, res, next) {
  var beautifulImage = ApiUtil.buildBeautifulImage(req);
  var _id = req.body._id;
  var ep = eventproxy();
  ep.fail(next);

  BeautifulImage.setOne({
    _id: _id
  }, beautifulImage, null, ep.done(function (beautifulImage) {
    res.sendSuccessMsg();
  }));
}

exports.search_beautiful_image = function (req, res, next) {
  var query = req.body.query || {};
  var sort = req.body.sort || {
    create_at: -1
  };
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
  ep.fail(next);

  var project = null;
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
  var query = req.body.query || {};
  var sort = req.body.sort || {
    questionid: 1
  };
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
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
  var wenjuanid = req.body.wenjuanid;
  var questionid = req.body.questionid;
  var ep = eventproxy();
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
    var result = [];
    for (answer of answers) {
      var a = _.find(result, function (o) {
        return o.questionid === answer.questionid;
      });

      if (!a) {
        a = {
          questionid: answer.questionid,
          answer_count: [],
        }
        result.push(a);
      }

      for (var i = 0; i < answer.choice_answer.length; i++) {
        if (a.answer_count[answer.choice_answer[i]]) {
          a.answer_count[answer.choice_answer[i]] = a.answer_count[
            answer.choice_answer[i]] + 1;
        } else {
          a.answer_count[answer.choice_answer[
            i]] = 1;
        }
      }
    }

    for (var i = 0; i < result.length; i++) {
      if (result[i]) {
        for (var j = 0; j < result[i].answer_count.length; j++) {
          if (!result[i].answer_count[j]) {
            result[i].answer_count[j] = 0;
          }
        }
      }
    }

    res.sendData(result);
  }));
}
