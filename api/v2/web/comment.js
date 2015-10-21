var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../../proxy').User;
var Comment = require('../../../proxy').Comment;
var Designer = require('../../../proxy').Designer;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../apiconfig');
var async = require('async');
var ApiUtil = require('../../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var type = require('../../../type');

exports.add_comment = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var comment = ApiUtil.buildComment(req);
  comment.by = userid;
  comment.usertype = ApiUtil.getUsertype(req);
  comment.date = new Date().getTime();
  if (comment.usertype === type.role_user) {
    comment.status = type.comment_status_need_designer_read;
  } else if (comment.usertype === type.role_designer) {
    comment.status = type.comment_status_need_user_read;
  }

  var ep = eventproxy();
  ep.fail(next);

  Comment.newAndSave(comment, ep.done(function () {
    res.sendSuccessMsg();
  }));
}


exports.unread_comment = function (req, res, next) {
  var ep = eventproxy();
  ep.fail(next);
  var userid = ApiUtil.getUserid(req);
  var usertype = ApiUtil.getUsertype(req);
  var query = {};
  query.to = userid;
  query.topictype = type.topic_type_plan;
  if (usertype === type.role_user) {
    query.status = type.comment_status_need_user_read;
  } else if (usertype === type.role_designer) {
    query.status = type.comment_status_need_designer_read;
  }

  Comment.find(query, null, {
    sort: {
      date: -1
    },
    lean: true,
  }, ep.done(function (comments) {
    console.log(comments);
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
      res.sendData(results);
    }));
  }));
}

exports.topic_comments = function (req, res, next) {
  var ep = eventproxy();
  ep.fail(next);
  var topicid = req.body.topicid;
  var userid = ApiUtil.getUserid(req);
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;

  Comment.paginate({
    topicid: topicid
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

      Comment.setOne({
        _id: comment._id,
      }, {
        status: type.comment_status_all_read,
      }, null, function () {});
    }, ep.done(function (results) {
      res.sendData({
        comments: results,
        total: total,
      });
    }));
  }));
}

exports.getOne = function (req, res, next) {
  var ep = eventproxy();
  ep.fail(next);


}
