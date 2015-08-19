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
  Plan.findOneAndUpdate(json, json, {upsert: true}, callback);
};

exports.updateByQuery = function (query, json, callback) {
  Plan.update(query, {$set: json}, callback);
}

exports.removeOneByQuery = function (_id, callback) {
  Plan.findOneAndRemove({_id:_id}, {$set: {is_deleted: true}}, callback);
}

/**
 * 根据关键字，获取一组方案
 * callback:
 * - err, 数据库异常
 * - plan, 方案列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getPlansByQuery = function (query, opt, callback) {
  Plan.find(query, '', opt, callback);
};

exports.addComment = function (planid, json, callback) {
  // json.commentid = uuid.v1();
  Plan.findOneAndUpdate({_id:planid}, {'$push': {comments: json}}, callback);
}
