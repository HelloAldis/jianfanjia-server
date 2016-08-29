'use strict'

const eventproxy = require('eventproxy');
const async = require('async');
const Quotation = require('lib/proxy').Quotation;
const tools = require('lib/common/tools');

exports.quotation = function (req, res, next) {
  const quotationid = req.params.quotationid;
  const ep = eventproxy();
  ep.fail(next);

  if (!tools.isValidObjectId(quotationid)) {
    return next();
  }

  async.parallel({
    quotation: function (callback) {
      Quotation.findOne({
        _id: quotationid
      }, null, callback);
    }
  }, ep.done(function (result) {
    if (result.quotation) {
      res.ejs('page/quotation', result, req);
    } else {
      next();
    }
  }));
}
