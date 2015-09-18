var validator = require('validator');
var tools = require('./tools');
var _ = require('lodash');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports.getUserid = function (req) {
  if (req.session) {
    return req.session.userid;
  }
}

exports.getUsertype = function (req) {
  if (req.session) {
    return req.session.usertype;
  }
}

exports.buildUser = function (req) {
  var user = {};
  user.username = tools.trim(req.body.username);
  user.sex = tools.trim(req.body.sex);
  user.province = tools.trim(req.body.province);
  user.city = tools.trim(req.body.city);
  user.district = tools.trim(req.body.district);
  user.address = tools.trim(req.body.address);
  user.email = tools.trim(req.body.email);

  if (req.body.imageid) {
    user.imageid = new ObjectId(req.body.imageid);
  }

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
  designer.dec_house_types = req.body.dec_house_types;
  designer.design_fee_range = tools.trim(req.body.design_fee_range);
  designer.dec_fee_half = req.body.dec_fee_half;
  designer.dec_fee_all = req.body.dec_fee_all;
  designer.achievement = tools.trim(req.body.achievement);
  designer.philosophy = tools.trim(req.body.philosophy);
  designer.communication_type = tools.trim(req.body.communication_type);
  designer.bank_card = tools.trim(req.body.bank_card);
  designer.bank = tools.trim(req.body.bank);
  designer.work_year = req.body.work_year;
  designer.university = tools.trim(req.body.university);

  if (req.body.big_imageid) {
    designer.big_imageid = new ObjectId(req.body.big_imageid);
  }

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
  team.province = tools.trim(req.body.province);
  team.city = tools.trim(req.body.city);
  team.district = tools.trim(req.body.district);

  return team;
}

exports.buildProduct = function (req) {
  var product = {};
  product.province = tools.trim(req.body.province);
  product.city = tools.trim(req.body.city);
  product.district = tools.trim(req.body.district);
  product.cell = tools.trim(req.body.cell);
  product.house_type = tools.trim(req.body.house_type);
  product.house_area = tools.trim(req.body.house_area);
  product.dec_style = tools.trim(req.body.dec_style);
  product.dec_type = tools.trim(req.body.dec_type);
  product.work_type = tools.trim(req.body.work_type);
  product.total_price = tools.trim(req.body.total_price);
  product.description = tools.trim(req.body.description);
  product.images = _.map(req.body.images, function (i) {
    i.imageid = new ObjectId(i.imageid);
    return i;
  });

  return product;
}

exports.buildPlan = function (req) {
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
  requirement.province = tools.trim(req.body.province);
  requirement.city = tools.trim(req.body.city);
  requirement.district = tools.trim(req.body.district);
  requirement.cell = tools.trim(req.body.cell);
  requirement.street = tools.trim(req.body.street);
  requirement.cell_phase = tools.trim(req.body.cell_phase);
  requirement.cell_building = tools.trim(req.body.cell_building);
  requirement.cell_unit = tools.trim(req.body.cell_unit);
  requirement.cell_detail_number = tools.trim(req.body.cell_detail_number);
  requirement.house_type = tools.trim(req.body.house_type);
  requirement.house_area = req.body.house_area;
  requirement.dec_style = tools.trim(req.body.dec_style);
  requirement.work_type = tools.trim(req.body.work_type);
  requirement.total_price = req.body.total_price;
  requirement.communication_type = tools.trim(req.body.communication_type);
  requirement.family_description = tools.trim(req.body.family_description);

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
  share.province = tools.trim(req.body.province);
  share.city = tools.trim(req.body.city);
  share.district = tools.trim(req.body.district);
  share.cell = tools.trim(req.body.cell);
  share.house_type = tools.trim(req.body.house_type);
  share.house_area = req.body.house_area;
  share.dec_style = tools.trim(req.body.dec_style);
  share.dec_type = tools.trim(req.body.dec_type);
  share.work_type = tools.trim(req.body.work_type);
  share.total_price = req.body.total_price;
  share.description = tools.trim(req.body.description);
  share.process = req.body.process;
  share.start_at = req.body.start_at;

  _.forEach(share.process, function (p) {
    p.images = _.map(p.images, function (i) {
      return new ObjectId(i);
    });
  });

  return share;
}

exports.buildProcess = function (req) {
  var process = {};
  process.final_designerid = new ObjectId(req.body.final_designerid);
  process.final_planid = new ObjectId(req.body.final_planid);
  process.requirementid = new ObjectId(req.body.requirementid);
  process.province = tools.trim(req.body.province);
  process.city = tools.trim(req.body.city);
  process.district = tools.trim(req.body.district);
  process.cell = tools.trim(req.body.cell);
  process.house_type = tools.trim(req.body.house_type);
  process.house_area = tools.trim(req.body.house_area);
  process.dec_style = tools.trim(req.body.dec_style);
  process.work_type = tools.trim(req.body.work_type);
  process.total_price = tools.trim(req.body.total_price);
  process.start_at = req.body.start_at;
  process.duration = req.body.duration;

  return process;
}

exports.buildReschedule = function (req) {
  var reschedule = {};
  reschedule.processid = new ObjectId(tools.trim(req.body.processid));
  reschedule.userid = new ObjectId(tools.trim(req.body.userid));
  reschedule.designerid = new ObjectId(tools.trim(req.body.designerid));
  reschedule.section = tools.trim(req.body.section);
  reschedule.new_date = req.body.new_date;

  return reschedule;
}

exports.buildFeedback = function (req) {
  var feedback = {};

  feedback.content = tools.trim(req.body.content);
  feedback.platform = tools.trim(req.body.platform);
  return feedback;
}
