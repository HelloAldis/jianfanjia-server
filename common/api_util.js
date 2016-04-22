'use strict'

const tools = require('./tools');
const requirement_util = require('./requirement_util');
const _ = require('lodash');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

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

exports.getAgreeeLicense = function (req) {
  if (req.session) {
    return req.session.agreee_license;
  }
}

exports.buildUser = function (req) {
  let user = {};
  let input;
  if (req.body.user) {
    input = req.body.user;
  } else {
    input = req.body;
  }

  user.username = input.username;
  user.sex = input.sex;
  user.province = input.province;
  user.city = input.city;
  user.district = input.district;
  user.address = input.address;
  user.email = input.email;
  user.dec_progress = input.dec_progress;
  user.dec_styles = input.dec_styles;
  user.family_description = input.family_description;

  if (input.imageid) {
    user.imageid = new ObjectId(input.imageid);
  }

  return tools.deleteUndefinedAndNullThenFilterXss(user);
}

exports.buildWechatUser = function (req) {
  let user = {};
  user.username = req.body.username;
  user.sex = req.body.sex;
  user.image_url = req.body.image_url;
  user.wechat_openid = req.body.wechat_openid;
  user.wechat_unionid = req.body.wechat_unionid;

  return tools.deleteUndefinedAndNullThenFilterXss(user);
}

exports.buildDesinger = function (req) {
  let designer = {};
  designer.username = req.body.username;
  designer.sex = req.body.sex;
  designer.province = req.body.province;
  designer.city = req.body.city;
  designer.district = req.body.district;
  designer.address = req.body.address;
  designer.company = req.body.company;
  designer.achievement = req.body.achievement;
  designer.philosophy = req.body.philosophy;
  designer.work_year = req.body.work_year;
  designer.university = req.body.university;

  if (req.body.diploma_imageid) {
    designer.diploma_imageid = new ObjectId(req.body.diploma_imageid);
  }

  if (req.body.imageid) {
    designer.imageid = new ObjectId(req.body.imageid);
  }

  if (req.body.big_imageid) {
    designer.big_imageid = new ObjectId(req.body.big_imageid);
  }

  if (req.body.award_details) {
    designer.award_details = _.map(req.body.award_details, function (i) {
      i.award_imageid = new ObjectId(i.award_imageid);
      return i;
    });
  }

  return tools.deleteUndefinedAndNullThenFilterXss(designer);
}

exports.buildDesignerBusinessInfo = function (req) {
  let designer = {};
  designer.dec_types = req.body.dec_types;
  designer.work_types = req.body.work_types;
  designer.dec_styles = req.body.dec_styles;
  designer.dec_districts = req.body.dec_districts;
  designer.dec_house_types = req.body.dec_house_types;
  designer.design_fee_range = req.body.design_fee_range;
  designer.dec_fee_half = req.body.dec_fee_half;
  designer.dec_fee_all = req.body.dec_fee_all;
  designer.communication_type = req.body.communication_type;

  return tools.deleteUndefinedAndNullThenFilterXss(designer);
}

exports.buildUidBank = function (req) {
  let designer = {};
  designer.username = req.body.username;
  designer.uid = req.body.uid;
  designer.bank_card = req.body.bank_card;
  designer.bank = req.body.bank;

  if (req.body.uid_image1) {
    designer.uid_image1 = new ObjectId(req.body.uid_image1);
  }

  if (req.body.uid_image2) {
    designer.uid_image2 = new ObjectId(req.body.uid_image2);
  }

  if (req.body.bank_card_image1) {
    designer.bank_card_image1 = new ObjectId(req.body.bank_card_image1);
  }

  return tools.deleteUndefinedAndNullThenFilterXss(designer);
}

exports.buildTeam = function (req) {
  let team = {};
  team.manager = req.body.manager;
  team.uid = req.body.uid;
  team.company = req.body.company;
  team.work_year = req.body.work_year;
  team.good_at = req.body.good_at;
  team.working_on = req.body.working_on;
  team.sex = req.body.sex;
  team.province = req.body.province;
  team.city = req.body.city;
  team.district = req.body.district;

  if (req.body.uid_image1) {
    team.uid_image1 = new ObjectId(req.body.uid_image1);
  }

  if (req.body.uid_image2) {
    team.uid_image2 = new ObjectId(req.body.uid_image2);
  }

  return tools.deleteUndefinedAndNullThenFilterXss(team);
}

exports.buildProduct = function (req) {
  let product = {};
  product.province = req.body.province;
  product.city = req.body.city;
  product.district = req.body.district;
  product.cell = req.body.cell;
  product.house_type = req.body.house_type;
  product.business_house_type = req.body.business_house_type;
  product.house_area = req.body.house_area;
  product.dec_style = req.body.dec_style;
  product.dec_type = req.body.dec_type;
  product.work_type = req.body.work_type;
  product.total_price = req.body.total_price;
  product.description = req.body.description;

  if (req.body.images) {
    product.images = _.map(req.body.images, function (i) {
      i.imageid = new ObjectId(i.imageid);
      return i;
    });
  }

  return tools.deleteUndefinedAndNullThenFilterXss(product);
}

exports.buildPlan = function (req) {
  let plan = {};
  plan.duration = req.body.duration;
  plan.description = req.body.description;
  plan.manager = req.body.manager;
  plan.price_detail = req.body.price_detail;
  plan.total_design_fee = req.body.total_design_fee || 0;
  plan.project_price_before_discount = req.body.project_price_before_discount || 0;
  plan.project_price_after_discount = req.body.project_price_after_discount || plan.project_price_before_discount;
  plan.total_price = req.body.total_price || (plan.total_design_fee + plan.project_price_after_discount);

  //防止没有折前价,没有折前价用折后价代替
  plan.project_price_before_discount = plan.project_price_before_discount || plan.project_price_after_discount;

  if (req.body.images) {
    plan.images = _.map(req.body.images, function (i) {
      return new ObjectId(i);
    });
  }

  return tools.deleteUndefinedAndNullThenFilterXss(plan);
}

exports.buildRequirement = function (req) {
  let requirement = {};
  let input;
  if (req.body.requirement) {
    input = req.body.requirement;
  } else {
    input = req.body;
  }

  requirement.province = input.province;
  requirement.city = input.city;
  requirement.district = input.district;

  // requirement.street = input.street;
  // requirement.cell = input.cell;
  // requirement.cell_phase = input.cell_phase;
  // requirement.cell_building = input.cell_building;
  // requirement.cell_unit = input.cell_unit;
  // requirement.cell_detail_number = input.cell_detail_number;
  requirement.basic_address = input.basic_address || requirement_util.merge2BasciAddress(input.cell, input.cell_phase);
  requirement.detail_address = input.detail_address || requirement_util.merge2DetailAddress(input.cell_building, input.cell_unit, input.cell_detail_number);

  requirement.house_type = input.house_type;
  requirement.business_house_type = input.business_house_type;
  requirement.house_area = input.house_area;
  requirement.dec_style = input.dec_style;
  requirement.dec_type = input.dec_type;
  requirement.prefer_sex = input.prefer_sex;
  requirement.work_type = input.work_type;
  requirement.total_price = input.total_price;
  requirement.communication_type = input.communication_type;
  requirement.family_description = input.family_description;
  requirement.package_type = input.package_type || '0';

  return tools.deleteUndefinedAndNullThenFilterXss(requirement);
}

exports.buildShare = function (req) {
  let share = {};
  share.manager = req.body.manager;
  share.province = req.body.province;
  share.city = req.body.city;
  share.district = req.body.district;
  share.cell = req.body.cell;
  share.house_type = req.body.house_type;
  share.house_area = req.body.house_area;
  share.dec_style = req.body.dec_style;
  share.dec_type = req.body.dec_type;
  share.work_type = req.body.work_type;
  share.total_price = req.body.total_price;
  share.description = req.body.description;
  share.process = req.body.process;
  share.start_at = req.body.start_at;
  share.status = req.body.status;
  share.progress = req.body.progress;

  _.forEach(share.process, function (p) {
    p.images = _.map(p.images, function (i) {
      return new ObjectId(i);
    });
  });
  share.cover_imageid = req.body.cover_imageid ? new ObjectId(req.body.cover_imageid) :
    undefined;

  return tools.deleteUndefinedAndNullThenFilterXss(share);
}

exports.buildProcess = function (req) {
  let process = {};
  process.final_designerid = new ObjectId(req.body.final_designerid);
  process.final_planid = new ObjectId(req.body.final_planid);
  process.requirementid = new ObjectId(req.body.requirementid);
  process.province = req.body.province;
  process.city = req.body.city;
  process.district = req.body.district;
  process.cell = req.body.cell;
  process.basic_address = req.body.basic_address;
  process.detail_address = req.body.detail_address;
  process.house_type = req.body.house_type;
  process.house_area = req.body.house_area;
  process.dec_style = req.body.dec_style;
  process.work_type = req.body.work_type;
  process.total_price = req.body.total_price;
  process.start_at = req.body.start_at;
  process.duration = req.body.duration;

  return tools.deleteUndefinedAndNullThenFilterXss(process);
}

exports.buildReschedule = function (req) {
  let reschedule = {};
  reschedule.processid = new ObjectId(tools.trim(req.body.processid));
  reschedule.userid = new ObjectId(tools.trim(req.body.userid));
  reschedule.designerid = new ObjectId(tools.trim(req.body.designerid));
  reschedule.section = req.body.section;
  reschedule.new_date = req.body.new_date;

  return tools.deleteUndefinedAndNullThenFilterXss(reschedule);
}

exports.buildFeedback = function (req) {
  let feedback = {};

  feedback.content = req.body.content;
  feedback.platform = req.body.platform;
  feedback.version = req.body.version;

  return tools.deleteUndefinedAndNullThenFilterXss(feedback);
}

exports.buildTempUser = function (req) {
  let tempUser = {};

  tempUser.name = req.body.name;
  tempUser.phone = req.body.phone;
  tempUser.district = req.body.district;
  tempUser.house_area = req.body.house_area;
  tempUser.total_price = req.body.total_price;

  return tools.deleteUndefinedAndNullThenFilterXss(tempUser);
}

exports.buildComment = function (req) {
  let comment = {};
  comment.topicid = req.body.topicid;
  comment.section = req.body.section;
  comment.item = req.body.item;
  comment.topictype = req.body.topictype;
  comment.content = req.body.content;
  // comment.to = req.body.to ? new ObjectId(req.body.to) : undefined;
  comment.to_userid = tools.convert2ObjectId(req.body.to_userid);
  comment.to_designerid = tools.convert2ObjectId(req.body.to_designerid);

  return tools.deleteUndefinedAndNullThenFilterXss(comment);
}

exports.buildEvaluation = function (req) {
  let evaluation = {};
  evaluation.designerid = req.body.designerid ? new ObjectId(req.body.designerid) :
    undefined;
  evaluation.requirementid = req.body.requirementid ? new ObjectId(req.body.requirementid) :
    undefined;
  evaluation.service_attitude = req.body.service_attitude > 5 ? 0 : req.body.service_attitude;
  evaluation.respond_speed = req.body.respond_speed > 5 ? 0 : req.body.respond_speed;
  evaluation.comment = req.body.comment;
  evaluation.is_anonymous = req.body.is_anonymous;

  return tools.deleteUndefinedAndNullThenFilterXss(evaluation);
}

exports.buildArticle = function (req) {
  let article = {};
  article.title = req.body.title;
  article.keywords = req.body.keywords;
  article.cover_imageid = req.body.cover_imageid ? new ObjectId(req.body.cover_imageid) :
    undefined;
  article.description = req.body.description;
  article.content = req.body.content;
  article.create_at = req.body.create_at || new Date().getTime();
  article.status = req.body.status;
  article.articletype = req.body.articletype;

  return tools.deleteUndefinedAndNull(article);
}

exports.buildBeautifulImage = function (req) {
  let beautifulImage = {};
  beautifulImage.title = req.body.title;
  beautifulImage.description = req.body.description;
  beautifulImage.keywords = req.body.keywords;
  beautifulImage.dec_type = req.body.dec_type;
  beautifulImage.house_type = req.body.house_type;
  beautifulImage.dec_style = req.body.dec_style;
  beautifulImage.section = req.body.section;
  beautifulImage.status = req.body.status;

  if (req.body.images) {
    beautifulImage.images = _.map(req.body.images, function (i) {
      i.imageid = new ObjectId(i.imageid);
      return i;
    });
  }

  return tools.deleteUndefinedAndNullThenFilterXss(beautifulImage);
}

exports.buildAnswers = function (req) {
  return tools.deleteUndefinedAndNullThenFilterXss(req.answers);
}

exports.buildSupervisor = function (req) {
  let supervisor = {};

  supervisor.username = req.body.supervisor.username;
  supervisor.sex = req.body.supervisor.sex;
  supervisor.province = req.body.supervisor.province;
  supervisor.city = req.body.supervisor.city;
  supervisor.district = req.body.supervisor.district;
  supervisor.address = req.body.supervisor.address;
  supervisor.imageid = tools.convert2ObjectId(req.body.supervisor.imageid);

  return tools.deleteUndefinedAndNullThenFilterXss(supervisor);
}
