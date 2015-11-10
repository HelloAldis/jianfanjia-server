var validator = require('validator');
var eventproxy = require('eventproxy');
var Plan = require('../../proxy').Plan;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../apiconfig');
var async = require('async');
var ApiUtil = require('../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var type = require('../../type');

Plan.find({
  project_price_after_discount: {
    $exists: false
  }
}, null, function (err, plans) {
  plans.forEach(function (plan) {
    if (plan.price_detail && plan.price_detail.length > 0) {
      console.log(plan);
      var design_fee_index = -1;
      for (var i = 0; i < plan.price_detail.length; i++) {
        if (plan.price_detail[i].item === '设计费') {
          design_fee_index = i;
          break;
        }
      }

      if (design_fee_index > -1) {
        plan.total_design_fee = plan.price_detail[design_fee_index].price
        plan.project_price_after_discount = plan.total_price - plan.total_design_fee;
        plan.project_price_before_discount = plan.project_price_after_discount;
        plan.price_detail.splice(design_fee_index, 1);

        plan.save(function () {
          console.log("total :" + plan.total_price +
            " project_price_after_discount:" + plan.project_price_after_discount +
            " project_price_before_discount:" + plan.project_price_before_discount +
            " total_design_fee:" + plan.total_design_fee);
        });
      }
    }
  });
});

console.log('over');
