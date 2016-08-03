'use strict'

const eventproxy = require('eventproxy');
const Share = require('lib/proxy').Share;
const Designer = require('lib/proxy').Designer;
const ApiUtil = require('lib/common/api_util');
const async = require('async');
const tools = require('lib/common/tools');
const pc_web_header = require('lib/business/pc_web_header');

exports.share_process_homepage = function (req, res, next) {
  const _id = req.params.shareid;
  const userid = ApiUtil.getUserid(req);
  const usertype = ApiUtil.getUsertype(req);
  const ep = eventproxy();
  ep.fail(next);

  if (!tools.isValidObjectId(_id)) {
    return next();
  }

  async.parallel({
    header_info: function (callback) {
      pc_web_header.statistic_info(userid, usertype, callback);
    },
    share: function (callback) {
      Share.findOne({
        _id: _id
      }, null, callback);
    },
  }, ep.done(function (result) {
    if (result.share) {
      Designer.findOne({
        _id: result.share.designerid
      }, {
        _id: 1,
        username: 1,
        imageid: 1
      }, ep.done(function (designer_indb) {
        result.share = result.share.toObject();
        result.share.designer = designer_indb;
        res.ejs('page/share_process', result, req);
      }));
    } else {
      next();
    }
  }));
}
