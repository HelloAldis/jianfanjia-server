'use strict';

const TempUser = require('../../../proxy').TempUser;
const eventproxy = require('eventproxy');
const ApiUtil = require('../../../common/api_util');
const tools = require('../../../common/tools');

exports.add = function (req, res, next) {
  let tempUser = ApiUtil.buildTempUser(req);
  let ep = new eventproxy();
  ep.fail(next);

  tempUser.platform_type = req.platform_type;
  TempUser.newAndSave(tempUser, ep.done(function () {
    res.sendSuccessMsg();
  }));
};

exports.search_temp_user = function (req, res, next) {
  let query = req.body.query || {};
  let sort = req.body.sort || {
    create_at: 1
  };
  let skip = req.body.from || 0;
  let limit = req.body.limit || 10;
  let search_word = req.body.search_word;
  if (search_word && search_word.trim().length > 0) {
    if (tools.isValidObjectId(search_word)) {
      query['$or'] = [{
        _id: search_word
      }];
    } else {
      search_word = reg_util.reg(tools.trim(search_word), 'i');
      query['$or'] = [{
        name: search_word
      }, {
        district: search_word
      }];
    }
  }
  let ep = new eventproxy();
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
