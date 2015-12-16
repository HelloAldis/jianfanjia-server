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

exports.getAgreeeLicense = function (req) {
  if (req.session) {
    return req.session.agreee_license;
  }
}

exports.buildUser = function (req) {
  var user = {};
  user.username = req.body.username;
  user.sex = req.body.sex;
  user.province = req.body.province;
  user.city = req.body.city;
  user.district = req.body.district;
  user.address = req.body.address;
  user.email = req.body.email;
  user.dec_progress = req.body.dec_progress;
  user.dec_styles = req.body.dec_styles;
  user.family_description = req.body.family_description;

  if (req.body.imageid) {
    user.imageid = new ObjectId(req.body.imageid);
  }

  return user;
}

exports.buildDesinger = function (req) {
  var designer = {};
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

  designer.award_details = _.map(req.body.award_details, function (i) {
    i.award_imageid = new ObjectId(i.award_imageid);
    return i;
  });


  return designer;
}

exports.buildDesignerBusinessInfo = function (req) {
  var designer = {};
  designer.dec_types = req.body.dec_types;
  designer.work_types = req.body.work_types;
  designer.dec_styles = req.body.dec_styles;
  designer.dec_districts = req.body.dec_districts;
  designer.dec_house_types = req.body.dec_house_types;
  designer.design_fee_range = req.body.design_fee_range;
  designer.dec_fee_half = req.body.dec_fee_half;
  designer.dec_fee_all = req.body.dec_fee_all;
  designer.communication_type = req.body.communication_type;

  return designer;
}

exports.buildUidBank = function (req) {
  var designer = {};
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

  return designer;
}

exports.buildTeam = function (req) {
  var team = {};
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

  return team;
}

exports.buildProduct = function (req) {
  var product = {};
  product.province = req.body.province;
  product.city = req.body.city;
  product.district = req.body.district;
  product.cell = req.body.cell;
  product.house_type = req.body.house_type;
  product.house_area = req.body.house_area;
  product.dec_style = req.body.dec_style;
  product.dec_type = req.body.dec_type;
  product.work_type = req.body.work_type;
  product.total_price = req.body.total_price;
  product.description = req.body.description;
  product.images = _.map(req.body.images, function (i) {
    i.imageid = new ObjectId(i.imageid);
    return i;
  });

  return product;
}

exports.buildPlan = function (req) {
  var plan = {};
  plan.duration = req.body.duration;
  plan.total_price = req.body.total_price;
  plan.description = req.body.description;
  plan.manager = req.body.manager;
  plan.price_detail = req.body.price_detail;
  plan.project_price_after_discount = req.body.project_price_after_discount;
  plan.total_design_fee = req.body.total_design_fee;
  plan.project_price_before_discount = req.body.project_price_before_discount;

  plan.images = _.map(req.body.images, function (i) {
    return new ObjectId(i);
  });

  return plan;
}

exports.buildRequirement = function (req) {
  var requirement = {};
  requirement.province = req.body.province;
  requirement.city = req.body.city;
  requirement.district = req.body.district;
  requirement.cell = req.body.cell;
  requirement.street = req.body.street;
  requirement.address = req.body.address;
  requirement.cell_phase = req.body.cell_phase;
  requirement.cell_building = req.body.cell_building;
  requirement.cell_unit = req.body.cell_unit;
  requirement.cell_detail_number = req.body.cell_detail_number;
  requirement.house_type = req.body.house_type;
  requirement.business_house_type = req.body.business_house_type;
  requirement.house_area = req.body.house_area;
  requirement.dec_style = req.body.dec_style;
  requirement.dec_type = req.body.dec_type;
  requirement.prefer_sex = req.body.prefer_sex;
  requirement.work_type = req.body.work_type;
  requirement.total_price = req.body.total_price;
  requirement.communication_type = req.body.communication_type;
  requirement.family_description = req.body.family_description;

  return requirement;
}

exports.buildShare = function (req) {
  var share = {};
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

  _.forEach(share.process, function (p) {
    p.images = _.map(p.images, function (i) {
      return new ObjectId(i);
    });
  });
  share.cover_imageid = req.body.cover_imageid ? new ObjectId(req.body.cover_imageid) :
    undefined;

  return share;
}

exports.buildProcess = function (req) {
  var process = {};
  process.final_designerid = new ObjectId(req.body.final_designerid);
  process.final_planid = new ObjectId(req.body.final_planid);
  process.requirementid = new ObjectId(req.body.requirementid);
  process.province = req.body.province;
  process.city = req.body.city;
  process.district = req.body.district;
  process.cell = req.body.cell;
  process.house_type = req.body.house_type;
  process.house_area = req.body.house_area;
  process.dec_style = req.body.dec_style;
  process.work_type = req.body.work_type;
  process.total_price = req.body.total_price;
  process.start_at = req.body.start_at;
  process.duration = req.body.duration;

  return process;
}

exports.buildReschedule = function (req) {
  var reschedule = {};
  reschedule.processid = new ObjectId(tools.trim(req.body.processid));
  reschedule.userid = new ObjectId(tools.trim(req.body.userid));
  reschedule.designerid = new ObjectId(tools.trim(req.body.designerid));
  reschedule.section = req.body.section;
  reschedule.new_date = req.body.new_date;

  return reschedule;
}

exports.buildFeedback = function (req) {
  var feedback = {};

  feedback.content = req.body.content;
  feedback.platform = req.body.platform;
  feedback.version = req.body.version;
  return feedback;
}

exports.buildTempUser = function (req) {
  var tempUser = {};

  tempUser.name = req.body.name;
  tempUser.phone = req.body.phone;
  tempUser.district = req.body.district;
  tempUser.house_area = req.body.house_area;
  tempUser.total_price = req.body.total_price;

  return tempUser;
}

exports.buildComment = function (req) {
  var comment = {};
  comment.topicid = req.body.topicid;
  comment.section = req.body.section;
  comment.item = req.body.item;
  comment.topictype = req.body.topictype;
  comment.content = req.body.content;
  comment.to = req.body.to ? new ObjectId(req.body.to) : undefined;

  return comment;
}

exports.buildEvaluation = function (req) {
  var evaluation = {};
  evaluation.designerid = req.body.designerid ? new ObjectId(req.body.designerid) :
    undefined;
  evaluation.requirementid = req.body.requirementid ? new ObjectId(req.body.requirementid) :
    undefined;
  evaluation.service_attitude = req.body.service_attitude > 5 ? 0 : req.body.service_attitude;
  evaluation.respond_speed = req.body.respond_speed > 5 ? 0 : req.body.respond_speed;
  evaluation.comment = req.body.comment;
  evaluation.is_anonymous = req.body.is_anonymous;

  return evaluation;
}

exports.buildArticle = function (req) {
  var article = {};
  article.title = req.body.title;
  article.keywords = req.body.keywords;
  article.cover_imageid = req.body.cover_imageid ? new ObjectId(req.body.cover_imageid) :
    undefined;
  article.description = req.body.description;
  article.content = req.body.content;
  article.create_at = req.body.create_at || new Date().getTime();
  article.status = req.body.status;

  return article;
}

exports.buildBeautifulImage = function (req) {
  var beautifulImage = {};
  beautifulImage.title = req.body.title;
  beautifulImage.description = req.body.description;
  beautifulImage.keywords = req.body.keywords;
  beautifulImage.dec_type = req.body.dec_type;
  beautifulImage.house_type = req.body.house_type;
  beautifulImage.dec_style = req.body.dec_style;
  beautifulImage.section = req.body.section;
  beautifulImage.status = req.body.status;

  beautifulImage.images = _.map(req.body.images, function (i) {
    i.imageid = new ObjectId(i.imageid);
    return i;
  });

  return beautifulImage;
}
