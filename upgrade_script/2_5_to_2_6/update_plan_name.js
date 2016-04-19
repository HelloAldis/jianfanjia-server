var Plan = require('../../proxy').Plan;
var Requirement = require('../../proxy').Requirement;
var async = require('async');
var _ = require('lodash');
var type = require('../../type');

var query = {
  status: {
    $in: [type.plan_status_not_respond, type.plan_status_designer_respond_no_housecheck, type.plan_status_designer_housecheck_no_plan]
  },
};

Plan.count(query, function (err, count) {
  if (err) {
    return console.log('err = ' + err);
  }

  async.timesSeries(count, function (n, next) {
    Plan.find(query, null, {
      skip: n,
      limit: 1,
      sort: {
        request_date: 1,
      }
    }, function (err, plans) {
      if (err) {
        next(err);
      } else {
        var plan = plans[0];
        Requirement.findOne({
          _id: plan.requirementid
        }, null, function (err, requirement) {
          if (requirement.status === type.requirement_status_final_plan || requirement.status === type.requirement_status_config_contract ||
            requirement.status === type.requirement_status_config_process || requirement.status === type.requirement_status_done_process
          ) {
            plan.status = type.plan_status_designer_expired;
            console.log('save to new plan status');
            console.log(plan);
            plan.save(function (err) {
              next(err);
            });
          } else {
            next();
          }
        });
      }
    });
  }, function (err) {
    if (err) {
      console.log('complete plan wit err =' + err);
    } else {
      console.log('complete plan ok');
    }
    process.exit();
  });
});
