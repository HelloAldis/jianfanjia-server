var TempUser = require('../../proxy').TempUser;
var eventproxy = require('eventproxy');
var validator = require('validator');
var _ = require('lodash');
var ApiUtil = require('../../common/api_util');

exports.add = function (req, res, next) {
  var tempUser = ApiUtil.buildTempUser(req);

  TempUser.newAndSave(tempUser, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
};

exports.search_temp_user = function (req, res, next) {
  var query = req.body.query || {};
  var sort = req.body.sort;
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;

  TempUser.paginate(query, null, {
    sort: sort,
    skip: skip,
    limit: limit
  }, function (err, users, total) {
    if (err) {
      return next(err);
    }

    res.sendData({
      users: users,
      total: total
    });
  });
};
