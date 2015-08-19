var models  = require('../models');
var Plan    = models.Plan;
var uuid    = require('node-uuid');


exports.getPlansByDesignerid = function (designerid, callback) {
  Plan.find({'designerid':designerid}, callback);
};
exports.getPlansByUserid = function (userid, callback) {
  Plan.find({'userid':userid}, callback);
};

exports.newAndSave = function (json, callback) {
  var plan = new Plan(json);
  plan.save(callback);
};

exports.saveOrUpdate = function (json, callback) {
  Plan.findOneAndUpdate(json, json, {upsert: true}, callback);
};

exports.updateByQuery = function (query, json, callback) {
  Plan.update(query, {$set: json}, callback);
}

exports.removeOneByQuery = function (_id, callback) {
  Plan.findOneAndRemove({_id:_id}, {$set: {is_deleted: true}}, callback);
}

exports.getStatus2PlanByUseridDesigneridRequirementid = function (userid, designerid, requirementid, callback) {
  Plan.findOne({
    userid: userid,
    designerid: designerid,
    requirementid: requirementid,
    status: '2',
  }, callback);
}

exports.addComment = function (planid, json, callback) {
  // json.commentid = uuid.v1();
  Plan.findOneAndUpdate({_id:planid}, {'$push': {comments: json}}, callback);
}
