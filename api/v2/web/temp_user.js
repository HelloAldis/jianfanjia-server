var TempUser = require('../../../proxy').TempUser;
var eventproxy = require('eventproxy');
var ApiUtil = require('../../../common/api_util');

exports.add = function (req, res, next) {
  var tempUser = ApiUtil.buildTempUser(req);
  var ep = new eventproxy();
  ep.fail(next);

  TempUser.newAndSave(tempUser, ep.done(function () {
    res.sendSuccessMsg();
  }));
};

exports.search_temp_user = function (req, res, next) {
  var query = req.body.query || {};
  var sort = {
    create_at: 1
  };
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = new eventproxy();
  ep.fail(next);

  TempUser.paginate(query, null, {
    sort: sort,
    skip: skip,
    limit: limit
  }, ep.done(function (users, total) {
    res.sendData({
      users: users,
      total: total
    });
  }));
};
