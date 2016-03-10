var Plan = require('../../proxy').Plan;
var tools = require('../../common/tools');
var async = require('async');
var gm = require('gm');
var _ = require('lodash');
var type = require('../../type');

var query = {
  status: {
    $in: [type.plan_status_designer_upload, type.plan_status_user_not_final, type.plan_status_user_final]
  }
};

Plan.count(query, function (err, count) {
  if (err) {
    return console.log('err = ' + err);
  }

  async.timesSeries(count, function (n, next) {
    Plan.find(query, null, {
      skip: n,
      limit: 1,
    }, function (err, plans) {
      if (err) {
        next(err);
      } else {
        var plan = plans[0];
        Plan.find({
          requirementid: plan.requirementid,
          designerid: plan.designerid,
          status: {
            $in: [type.plan_status_designer_upload, type.plan_status_user_not_final, type.plan_status_user_final]
          }
        }, null, null, function (err, plan_array) {
          var planid_array = _.pluck(plan_array, '_id');
          var index = tools.findIndexObjectId(planid_array, plan._id);
          plan.name = '方案' + (index + 1);
          plan.save(function (err) {
            next(err);
          });
        });
      }
    });
  }, function (err) {
    if (err) {
      console.log('complete plan wit err =' + err);
    } else {
      console.log('complete plan ok, wait 1 min to save');
    }
  });
});
