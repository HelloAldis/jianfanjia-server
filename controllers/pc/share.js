'use strict'

const eventproxy = require('eventproxy');
const Share = require('../../proxy').Share;
const Designer = require('../../proxy').Designer;
const async = require('async');
const ApiUtil = require('../../common/api_util');
const tools = require('../../common/tools');
const pc_web_header = require('../../business/pc_web_header');

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
        result.designer = designer_indb;
        res.ejs('page/share_process', result, req);
      }));
    } else {
      next();
    }
  }));
}
