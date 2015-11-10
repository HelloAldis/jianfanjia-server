var validator = require('validator');
var eventproxy = require('eventproxy');
var Requirement = require('../../proxy').Requirement;
var Plan = require('../../proxy').Plan;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../apiconfig');
var async = require('async');
var ApiUtil = require('../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var type = require('../../type');

Requirement.find({
  order_designerids: {
    $exists: false,
  },
  status: {
    $ne: type.requirement_status_new,
  }
}, null, function (err, requirements) {
  requirements.forEach(function (requirement) {
    Plan.find({
      requirementid: requirement._id,
    }, null, function (err, plans) {
      var designerids = _.pluck(plans, 'designerid');
      requirement.order_designerids = designerids;
      requirement.save(function () {
        console.log(requirement);
      });
    });
  });
});

console.log('over');
