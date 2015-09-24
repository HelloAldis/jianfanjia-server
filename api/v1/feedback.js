var eventproxy = require('eventproxy');
var Feedback = require('../../proxy').Feedback;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../config');
var async = require('async');
var ApiUtil = require('../../common/api_util');
var type = require('../../type');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports.add = function (req, res, next) {
  var feedback = ApiUtil.buildFeedback(req);
  feedback.by = ApiUtil.getUserid(req);
  feedback.usertype = ApiUtil.getUsertype(req);

  Feedback.newAndSave(feedback, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
}

exports.search = function (req, res, next) {
  var query = req.body.query;

  Feedback.find(query, {}, {
    sort: {
      create_at: -1
    }
  }, function (err, feedbacks) {
    if (err) {
      return next(err);
    }

    res.sendData(feedbacks);
  });
}
