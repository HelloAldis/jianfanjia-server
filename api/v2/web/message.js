var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../../proxy').User;
var UserMessage = require('../../../proxy').UserMessage;
var Designer = require('../../../proxy').Designer;
var DesignerMessage = require('../../../proxy').DesignerMessage;
var Plan = require('../../../proxy').Plan;
var Process = require('../../../proxy').Process;
var Requirement = require('../../../proxy').Requirement;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../apiconfig');
var async = require('async');
var ApiUtil = require('../../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var type = require('../../../type');
var message_util = require('../../../common/message_util');

exports.search_user_message = function (req, res, next) {
  var query = req.body.query || {};
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var sort = req.body.sort || {
    create_at: -1
  }
  query.userid = ApiUtil.getUserid(req);
  var ep = eventproxy();
  ep.fail(next);

  UserMessage.paginate(query, {
    title: 1,
    content: 1,
    status: 1,
    message_type: 1,
    create_at: 1,
  }, {
    skip: skip,
    limit: limit,
    sort: sort,
    lean: true,
  }, ep.done(function (messages, total) {
    res.sendData({
      list: messages,
      total: total,
    });
  }));
}

exports.search_user_comment = function (req, res, next) {
  var query = req.body.query || {};
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var sort = req.body.sort || {
    create_at: -1
  }
  query.userid = ApiUtil.getUserid(req);
  query.message_type = {
    $in: [type.user_message_type_comment_plan, type.user_message_type_comment_process_item]
  }
  var ep = eventproxy();
  ep.fail(next);

  UserMessage.paginate(query, null, {
    skip: skip,
    limit: limit,
    sort: sort,
    lean: true,
  }, ep.done(function (messages, total) {
    async.mapLimit(messages, 3, function (message, callback) {
      if (message.message_type === type.user_message_type_comment_plan) {
        async.parallel({
          designer: function (callback) {
            Designer.findOne({
              _id: message.designerid,
            }, {
              username: 1,
              imageid: 1,
            }, callback);
          },
          plan: function (callback) {
            Plan.findOne({
              _id: message.topicid,
            }, {
              images: 1,
              status: 1,
              requirementid: 1,
            }, callback);
          }
        }, ep.done(function (result) {
          Requirement.findOne({
            _id: result.plan.requirementid,
          }, {
            cell: 1,
          }, function (err, requirement) {
            message.requirement = requirement;
            message.designer = result.designer;
            message.plan = result.plan;
            callback(err, message);
          });
        }));
      } else {
        async.parallel({
          designer: function (callback) {
            Designer.findOne({
              _id: message.designerid,
            }, {
              username: 1,
              imageid: 1,
            }, callback);
          },
          process: function (callback) {
            Process.findOne({
              _id: message.topicid,
            }, {
              cell: 1,
              sections: 1,
            }, callback);
          }
        }, function (err, result) {
          message.process = result.process;
          message.designer = result.designer;
          callback(err, message);
        });
      }
    }, ep.done(function (messages) {
      res.sendData({
        list: messages,
        total: total,
      });
    }));
  }));
}

exports.unread_user_message_count = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var query_array = req.body.query_array;
  var ep = eventproxy();
  ep.fail(next);

  async.mapLimit(query_array, 3, function (query, callback) {
    var q = {};
    q.userid = userid;
    q.message_type = {
      $in: query
    };
    UserMessage.count(q, callback);
  }, ep.done(function (count_array) {
    res.sendData(count_array);
  }));
}

exports.user_message_detail = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var messageid = req.body.messageid;
  var ep = eventproxy();
  ep.fail(next);

  UserMessage.findOne({
    _id: messageid,
    userid: userid,
  }, null, ep.done(function (message) {
    res.sendData(message);
    UserMessage.setOne({
      _id: messageid,
      userid: userid,
    }, {
      status: type.message_status_readed,
    }, function () {});
  }));
}

exports.delete_user_message = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var messageid = req.body.messageid;
  var ep = eventproxy();
  ep.fail(next);

  UserMessage.removeOne({
    _id: messageid,
    userid: userid,
  }, null, ep.done(function () {
    res.sendSuccessMsg();
  }));
}

exports.search_designer_message = function (req, res, next) {
  var query = req.body.query || {};
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var sort = req.body.sort || {
    create_at: -1
  }
  query.designerid = ApiUtil.getUserid(req);
  var ep = eventproxy();
  ep.fail(next);

  DesignerMessage.paginate(query, {
    title: 1,
    content: 1,
    status: 1,
    message_type: 1,
    create_at: 1,
  }, {
    skip: skip,
    limit: limit,
    sort: sort,
    lean: true,
  }, ep.done(function (messages, total) {
    res.sendData({
      list: messages,
      total: total,
    });
  }));
}

exports.designer_message_detail = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var messageid = req.body.messageid;
  var ep = eventproxy();
  ep.fail(next);

  DesignerMessage.findOne({
    _id: messageid,
    designerid: designerid,
  }, null, ep.done(function (message) {
    res.sendData(message);
    DesignerMessage.setOne({
      _id: messageid,
      designerid: designerid,
    }, {
      status: type.message_status_readed,
    }, function () {});
  }));
}

exports.delete_designer_message = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var messageid = req.body.messageid;
  var ep = eventproxy();
  ep.fail(next);

  DesignerMessage.removeOne({
    _id: messageid,
    designerid: designerid,
  }, null, ep.done(function () {
    res.sendSuccessMsg();
  }));
}

exports.unread_designer_message_count = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var query_array = req.body.query_array;
  var ep = eventproxy();
  ep.fail(next);

  async.mapLimit(query_array, 3, function (query, callback) {
    var q = {};
    q.designerid = designerid;
    q.message_type = {
      $in: query
    };
    DesignerMessage.count(q, callback);
  }, ep.done(function (count_array) {
    res.sendData(count_array);
  }));
}

exports.search_designer_comment = function (req, res, next) {
  var query = req.body.query || {};
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var sort = req.body.sort || {
    create_at: -1
  }
  query.designerid = ApiUtil.getUserid(req);
  query.message_type = {
    $in: [type.designer_message_type_comment_plan, type.designer_message_type_comment_process_item]
  }
  var ep = eventproxy();
  ep.fail(next);

  DesignerMessage.paginate(query, null, {
    skip: skip,
    limit: limit,
    sort: sort,
    lean: true,
  }, ep.done(function (messages, total) {
    async.mapLimit(messages, 3, function (message, callback) {
      if (message.message_type === type.designer_message_type_comment_plan) {
        async.parallel({
          user: function (callback) {
            User.findOne({
              _id: message.userid,
            }, {
              username: 1,
              imageid: 1,
            }, callback);
          },
          plan: function (callback) {
            Plan.findOne({
              _id: message.topicid,
            }, {
              images: 1,
              status: 1,
              requirementid: 1,
            }, callback);
          }
        }, ep.done(function (result) {
          Requirement.findOne({
            _id: result.plan.requirementid,
          }, {
            cell: 1,
          }, function (err, requirement) {
            message.requirement = requirement;
            message.user = result.user;
            message.plan = result.plan;
            callback(err, message);
          });
        }));
      } else {
        async.parallel({
          user: function (callback) {
            User.findOne({
              _id: message.userid,
            }, {
              username: 1,
              imageid: 1,
            }, callback);
          },
          process: function (callback) {
            Process.findOne({
              _id: message.topicid,
            }, {
              cell: 1,
              sections: 1,
            }, callback);
          }
        }, function (err, result) {
          message.process = result.process;
          message.user = result.user;
          callback(err, message);
        });
      }
    }, ep.done(function (messages) {
      res.sendData({
        list: messages,
        total: total,
      });
    }));
  }));
}
