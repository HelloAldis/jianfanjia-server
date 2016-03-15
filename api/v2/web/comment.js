var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../../proxy').User;
var Comment = require('../../../proxy').Comment;
var Designer = require('../../../proxy').Designer;
var Process = require('../../../proxy').Process;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../apiconfig');
var async = require('async');
var ApiUtil = require('../../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var type = require('../../../type');
var message_util = require('../../../common/message_util');

exports.add_comment = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var comment = ApiUtil.buildComment(req);
  comment.by = userid;
  comment.usertype = ApiUtil.getUsertype(req);
  comment.date = new Date().getTime();

  var ep = eventproxy();
  ep.fail(next);

  Comment.newAndSave(comment, ep.done(function (comment_indb) {
    res.sendSuccessMsg();
    if (comment_indb && comment_indb.section && comment_indb.item &&
      comment_indb.topictype === type.topic_type_process_item) {
      Process.addCommentCount(comment_indb.topicid, comment_indb.section,
        comment_indb.item,
        function (err) {});
    }

    if (comment_indb.usertype === type.role_user) {
      User.findOne({
        _id: userid
      }, {
        username: 1,
      }, function (err, user) {
        if (comment.topictype === type.topic_type_plan) {
          message_util.designer_message_type_comment_plan(comment_indb, user.username);
        } else if (comment.topictype === type.topic_type_process_item) {
          message_util.designer_message_type_comment_process_item(comment_indb, user.username);
        }
      });
    } else if (comment_indb.usertype === type.role_designer) {
      Designer.findOne({
        _id: userid,
      }, {
        username: 1,
      }, function (err, designer) {
        if (comment.topictype === type.topic_type_plan) {
          message_util.user_message_type_comment_plan(comment_indb, designer.username);
        } else if (comment.topictype === type.topic_type_process_item) {
          message_util.user_message_type_comment_process_item(comment_indb, designer.username);
        }
      });
    }
  }));
}

exports.topic_comments = function (req, res, next) {
  var ep = eventproxy();
  ep.fail(next);
  var topicid = req.body.topicid;
  var section = req.body.section;
  var item = req.body.item;
  var userid = ApiUtil.getUserid(req);
  var usertype = ApiUtil.getUsertype(req);
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;

  Comment.paginate({
    topicid: topicid,
    section: section,
    item: item,
  }, null, {
    skip: skip,
    limit: limit,
    sort: {
      date: -1
    },
    lean: true,
  }, ep.done(function (comments, total) {
    async.mapLimit(comments, 3, function (comment, callback) {
      if (comment.usertype === type.role_user) {
        User.findOne({
          _id: comment.by
        }, {
          imageid: 1,
          username: 1,
        }, function (err, user) {
          comment.byUser = user;
          callback(err, comment);
        });
      } else if (comment.usertype == type.role_designer) {
        Designer.findOne({
          _id: comment.by
        }, {
          imageid: 1,
          username: 1,
        }, function (err, designer) {
          comment.byUser = designer;
          callback(err, comment);
        });
      }
    }, ep.done(function (results) {
      res.sendData({
        comments: results,
        total: total,
      });
    }));
  }));
}
