var eventproxy = require('eventproxy');
var type = require('lib/type/type');
var Answer = require('lib/proxy').Quatation;
var ApiUtil = require('lib/common/api_util');
var async = require('async');

exports.generate_quotation = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var usertype = ApiUtil.getUsertype(req);
  var answers = ApiUtil.buildAnswers(req);
  var ep = eventproxy();
  ep.fail(next);
  // master_bedroom_count: {
  //   type: Number, // 主卧数量
  //   default: 1
  // },
  // extra_bedroom_count: {
  //   type: Number, // 次卧数量
  //   default: 0
  // },
  // children_bedroom_count: {
  //   type: Number, // 儿童房数量
  //   default: 0
  // },
  // living_room_count: {
  //   type: Number, // 客厅数量
  //   default: 0
  // },
  // kitchen_count: {
  //   type: Number, // 厨房数量
  //   default: 0
  // },
  // washroom_count: {
  //   type: Number, // 厨房数量
  //   default: 0
  // },

}
