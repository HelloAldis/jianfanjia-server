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
      let base_total = 0;
      let main_total = 0;
      for (var i = 0; i < result.quotation.sections.length; i++) {
        base_total += result.quotation.sections[i].base_price;
        main_total += result.quotation.sections[i].main_price;
      }
      result.quotation = result.quotation.toObject();
      result.quotation.base_total = base_total;
      result.quotation.main_total = main_total;

      res.ejs('page/quotation', result, req);
    } else {
      next();
    }
  }));
}
