var validator = require('validator');
var eventproxy = require('eventproxy');
var Designer = require('../../../proxy').Designer;
var Share = require('../../../proxy').Share;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../apiconfig');
var ApiUtil = require('../../../common/api_util');
var async = require('async');

exports.search_share = function (req, res, next) {
  var query = req.body.query || {};
  var sort = req.body.sort || {
    lastupdate: -1
  };
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = new eventproxy();
  ep.fail(next);

  Share.paginate(query, null, {
      sort: sort,
      skip: skip,
      limit: limit
    },
    ep.done(function (shares, totals) {
      async.mapLimit(shares, 3, function (share, callback) {
        Designer.findOne({
          _id: share.designerid
        }, {
          _id: 1,
          username: 1,
          imageid: 1
        }, function (err, designer_indb) {
          var s = share.toObject();
          s.designer = designer_indb;
          callback(err, s);
        });
      }, ep.done(function (results) {
        res.sendData({
          shares: results,
          total: totals
        });
      }));
    }));
}
