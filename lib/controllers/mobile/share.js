'use strict'

const eventproxy = require('eventproxy');
const Share = require('lib/proxy').Share;
const Designer = require('lib/proxy').Designer;
const async = require('async');
const ApiUtil = require('lib/common/api_util');
const tools = require('lib/common/tools');

exports.share_process_homepage = function (req, res, next) {
  const _id = req.query.pid;
  const ep = eventproxy();
  ep.fail(next);

  if (!tools.isValidObjectId(_id)) {
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
        res.ejs('page/share_process', {
          share: share
        }, req);
      }));
    } else {
      next();
    }
  }));
}
