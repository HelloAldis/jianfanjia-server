var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../proxy').User;
var Plan = require('../../proxy').Plan;
var Requirement = require('../../proxy').Requirement;
var Designer = require('../../proxy').Designer;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../config');
var ApiUtil = require('../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var type = require('../../type');

exports.start = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var process = ApiUtil.buildProcess(req);
  process.userid = userid;
  process.going_on = 'kai_gong';
  process.kai_gong = {};
  process.chai_gai = {};
  process.shui_dian = {};
  process.ni_mu = {};
  process.you_qi = {};
  process.an_zhuang = {};
  process.jun_gong = {};

  if (process.duration === 60) {
    process.kai_gong.start_at = process.start_at;
    process.kai_gong.end_at = process.kai_gong.start_at
  }

}

exports.addComment = function (req, res, next) {

}

exports.addImage = function (req, res, next) {

}

exports.deleteImage = function (req, res, next) {

}

exports.reschedule = function (req, res, next) {

}

exports.done =  function (req, res, next) {

}
