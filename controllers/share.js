var eventproxy = require('eventproxy');
var Share = require('../proxy').Share;
var Designer = require('../proxy').Designer;
var _ = require('lodash');
var config = require('../apiconfig');
var async = require('async');
var ApiUtil = require('../common/api_util');
var type = require('../type');

exports.share_process_homepage = function (req, res, next) {
  var _id = req.query.pid;
  var ep = eventproxy();
  ep.fail(next);

  if (!_id) {
    return next();
  }

  Share.findOne({
    _id: _id
  }, null, ep.done(function (share) {
    if (share) {
      share = share.toObject();

      Designer.findOne({
        _id: share.designerid
      }, {
        _id: 1,
        username: 1,
        imageid: 1
      }, ep.done(function (designer_indb) {
        share.designer = designer_indb;
        res.render('share_process', {
          share: share
        });
      }));
    } else {
      next();
    }
  }));
}
