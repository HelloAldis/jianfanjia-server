var eventproxy = require('eventproxy');
var User = require('../../../proxy').User;
var UserMessage = require('../../../proxy').UserMessage;
var Designer = require('../../../proxy').Designer;
var DesignerMessage = require('../../../proxy').DesignerMessage;
var Plan = require('../../../proxy').Plan;
var Process = require('../../../proxy').Process;
var Requirement = require('../../../proxy').Requirement;
var Supervisor = require('../../../proxy').Supervisor;
var async = require('async');
var ApiUtil = require('../../../common/api_util');
var type = require('../../../type');

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
            }, null, callback);
          }
        }, ep.done(function (result) {
          Requirement.findOne({
            _id: result.plan.requirementid,
          }, {
            cell: 1,
            basic_address: 1,
            status: 1,
            dec_type: 1,
            cell_phase: 1,
            house_area: 1,
            work_type: 1,
            house_type: 1,
            package_type: 1,
          }, function (err, requirement) {
            message.requirement = requirement;
            message.designer = result.designer;
            message.plan = result.plan;
            callback(err, message);
          });
        }));
      } else {
        async.parallel({
          supervisor: function (callback) {
            if (message.supervisorid) {
              Supervisor.findOne({
                _id: message.supervisorid,
              }, {
                username: 1,
                imageid: 1,
              }, callback);
            } else {
              callback(null);
            }
          },
          designer: function (callback) {
            if (message.designerid) {
              Designer.findOne({
                _id: message.designerid,
              }, {
                username: 1,
                imageid: 1,
              }, callback);
            } else {
              callback(null);
            }
          },
          process: function (callback) {
            Process.findOne({
              _id: message.topicid,
            }, {
              cell: 1,
              basic_address: 1,
              sections: 1,
            }, callback);
          }
        }, function (err, result) {
          message.process = result.process;
          message.designer = result.designer;
          message.supervisor = result.supervisor;
          callback(err, message);
        });
      }
    }, ep.done(function (messages) {
      res.sendData({
        list: messages,
        total: total,
      });

      query.status = type.message_status_unread;
      UserMessage.setSome(query, {
        status: type.message_status_readed,
      }, {}, function () {});
    }));
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
            }, null, callback);
          }
        }, ep.done(function (result) {
          Requirement.findOne({
            _id: result.plan.requirementid,
          }, {
            cell: 1,
            basic_address: 1,
            status: 1,
            dec_type: 1,
            cell_phase: 1,
            house_area: 1,
            work_type: 1,
            house_type: 1,
            package_type: 1,
          }, function (err, requirement) {
            message.requirement = requirement;
            message.user = result.user;
            message.plan = result.plan;
            callback(err, message);
          });
        }));
      } else {
        async.parallel({
          supervisor: function (callback) {
            if (message.supervisorid) {
              Supervisor.findOne({
                _id: message.supervisorid,
              }, {
                username: 1,
                imageid: 1,
              }, callback);
            } else {
              callback(null);
            }
          },
          user: function (callback) {
            if (message.userid) {
              User.findOne({
                _id: message.userid,
              }, {
                username: 1,
                imageid: 1,
              }, callback);
            } else {
              callback(null);
            }
          },
          process: function (callback) {
            Process.findOne({
              _id: message.topicid,
            }, {
              cell: 1,
              basic_address: 1,
              sections: 1,
            }, callback);
          }
        }, function (err, result) {
          message.process = result.process;
          message.user = result.user;
          message.supervisor = result.supervisor;
          callback(err, message);
        });
      }
    }, ep.done(function (messages) {
      res.sendData({
        list: messages,
        total: total,
      });

      query.status = type.message_status_unread;
      DesignerMessage.setSome(query, {
        status: type.message_status_readed,
      }, {}, function () {});
    }));
  }));
}
