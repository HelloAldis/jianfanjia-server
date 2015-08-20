var eventproxy = require('eventproxy');
var User = require('../../proxy').User;
var Plan = require('../../proxy').Plan;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../config');
var ApiUtil = require('../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports.add = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var planid = tools.trim(req.body.planid);
  var comment = ApiUtil.buildComment(req);
  comment.userid = userid;
  comment.date = new Date();

  Plan.addComment(planid, comment, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
}
