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

Plan.find({}, null, function (err, plans) {
  plans.forEach(function (plan) {

    if (plan.status === type.plan_status_designer_upload || plan.status === type.plan_status_user_not_final ||
      plan.plan_status_user_final) {
      var bt = plan.total_price;
      var bpa = plan.project_price_after_discount;
      var bpb = plan.project_price_before_discount;
      var bte = plan.total_design_fee;

      var project_price_before_discount = 0;
      for (var i = 0; i < plan.price_detail.length; i++) {
        project_price_before_discount += plan.price_detail[i].price;
      }

      if (plan.project_price_before_discount) {
        if (plan.project_price_before_discount !=
          project_price_before_discount) {
          plan.project_price_before_discount =
            project_price_before_discount;
        }
      } else {
        plan.project_price_before_discount =
          project_price_before_discount;
      }

      if (!plan.project_price_after_discount) {
        plan.project_price_after_discount =
          project_price_before_discount;
      }

      if (!plan.total_design_fee) {
        plan.total_design_fee = 0;
      }

      plan.total_price = plan.project_price_after_discount + plan.total_design_fee;
      plan.save(function () {
        console.log("before change total :" + bt +
          " project_price_after_discount:" + bpa +
          " project_price_before_discount:" + bpb +
          " total_design_fee:" + bte);
        console.log("after change total :" + plan.total_price +
          " project_price_after_discount:" + plan.project_price_after_discount +
          " project_price_before_discount:" + plan.project_price_before_discount +
          " total_design_fee:" + plan.total_design_fee);
      });
    }
  });
});

console.log('over');
