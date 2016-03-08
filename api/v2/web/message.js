var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../../proxy').User;
var UserMessage = require('../../../proxy').UserMessage;
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

exports.search_designer_message = function (req, res, next) {

}
