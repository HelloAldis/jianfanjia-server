var validator = require('validator');
var tools = require('./tools');
var _ = require('lodash');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports.getUserid = function (req) {
  return req.session.userid;
}

exports.getUsertype = function (req) {
  return req.session.usertype;
}

exports.buildUser = function (req) {
  var user = {};
  user.username = tools.trim(req.body.username);
  user.sex = tools.trim(req.body.sex);
  user.city = tools.trim(req.body.city);
  user.district = tools.trim(req.body.district);
  user.address = tools.trim(req.body.address);
  user.communication_type = tools.trim(req.body.communication_type);
  return user;
}

exports.buildDesinger = function (req) {
  var designer = exports.buildUser(req);
  //设计师独有的
  designer.uid = tools.trim(req.body.uid);
  designer.company = tools.trim(req.body.company);
  designer.dec_types = req.body.dec_types;
  designer.dec_styles = req.body.dec_styles;
  designer.dec_districts = req.body.dec_districts;
  designer.design_fee_range = tools.trim(req.body.design_fee_range);
  designer.dec_fee_half = req.body.dec_fee_half;
  designer.dec_fee_all = req.body.dec_fee_all;
  designer.achievement = tools.trim(req.body.achievement);
  designer.philosophy = tools.trim(req.body.philosophy);

  return designer;
}

exports.buildTeam = function (req) {
  var team = {};
  team.manager = tools.trim(req.body.manager);
  team.uid = tools.trim(req.body.uid);
  team.company = tools.trim(req.body.company);
  team.work_year = tools.trim(req.body.work_year);
  team.good_at = tools.trim(req.body.good_at);
  team.working_on = tools.trim(req.body.working_on);
  team.sex = tools.trim(req.body.sex);
  team.hometown = tools.trim(req.body.hometown);

  return team;
}

exports.buildProduct = function (req) {
  var product = {};
  product.city = tools.trim(req.body.city);
  product.cell = tools.trim(req.body.cell);
  product.house_type = tools.trim(req.body.house_type);
  product.house_area = tools.trim(req.body.house_area);
  product.dec_style = tools.trim(req.body.dec_style);
  product.work_type = tools.trim(req.body.work_type);
  product.total_price = tools.trim(req.body.total_price);
  product.images = req.body.images;

  return product;
}

exports.buildPlan = function(req) {
  var plan = {};
  plan.duration = req.body.duration;
  plan.total_price = tools.trim(req.body.total_price);
  plan.description = tools.trim(req.body.description);
  plan.manager = tools.trim(req.body.manager);
  plan.price_detail = req.body.price_detail;

  plan.images = _.map(req.body.images, function (i) {
    return new ObjectId(i);
  });

  return plan;
}

exports.buildRequirement = function (req) {
  var requirement = {};
  requirement.city        = tools.trim(req.body.city);
  requirement.district       = tools.trim(req.body.district);
  requirement.cell = tools.trim(req.body.cell);
  requirement.house_type = tools.trim(req.body.house_type);
  requirement.house_area = req.body.house_area;
  requirement.dec_style = tools.trim(req.body.dec_style);
  requirement.work_type = tools.trim(req.body.work_type);
  requirement.total_price = req.body.total_price;

  return requirement;
}

exports.buildComment = function (req) {
  var comment = {};
  comment.content = tools.trim(req.body.content);

  return comment;
}

exports.buildShare = function (req) {
  var share = {};
  share.manager = tools.trim(req.body.manager);
  share.city = tools.trim(req.body.city);
  share.cell = tools.trim(req.body.cell);
  share.house_type = tools.trim(req.body.house_type);
  share.house_area = req.body.house_area;
  share.dec_style = tools.trim(req.body.dec_style);
  share.work_type = tools.trim(req.body.work_type);
  share.total_price = req.body.total_price;
  share.description = tools.trim(req.body.description);
  share.process = req.body.process;

  _.forEach(share.process, function (p) {
    p.images = _.map(p.images, function (i) {
      return new ObjectId(i);
    });
  });

  return share;
}

exports.buildProcess = function (req) {
  var process = {};
}
