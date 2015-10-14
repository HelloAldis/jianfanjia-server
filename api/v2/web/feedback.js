var eventproxy = require('eventproxy');
var Feedback = require('../../../proxy').Feedback;
var User = require('../../../proxy').User;
var Designer = require('../../../proxy').Designer;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../config');
var async = require('async');
var ApiUtil = require('../../../common/api_util');
var type = require('../../../type');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports.search = function (req, res, next) {
  var query = req.body.query || {};
  var sort = req.body.sort || {
    create_at: -1
  };
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
  ep.fail(next);

  Feedback.paginate(query, null, {
    sort: sort,
    skip: skip,
    limit: limit
  }, ep.done(function (feedbacks, total) {
    async.mapLimit(feedbacks, 3, function (feedback, callback) {
      if (feedback.usertype === type.role_user) {
        User.findOne({
          _id: feedback.by,
        }, {
          username: 1,
          phone: 1
        }, function (err, user) {
          feedback = feedback.toObject();
          feedback.user = user;
          callback(err, feedback);
        });
      } else if (feedback.usertype === type.role_designer) {
        Designer.findOne({
          _id: feedback.by,
        }, {
          username: 1,
          phone: 1
        }, function (err, designer) {
          feedback = feedback.toObject();
          feedback.user = designer;
          callback(err, feedback);
        });
      } else {
        callback(null, feedback);
      }
    }, ep.done(function (results) {
      res.sendData({
        requirements: results,
        total: total
      });
    }));
  }));
}
