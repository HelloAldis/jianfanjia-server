var _ = require('lodash');
var type = require('../type');
var config = require('../apiconfig');

exports.designer_match = function (designer, requirement) {
  var price_perm = requirement.total_price * 10000 / requirement.house_area;
  designer.match = 0;

  //匹配区域
  if (_.indexOf(designer.dec_districts, requirement.district) >= 0) {
    designer.match++;
  }

  //匹配钱
  if (requirement.work_type === type.work_type_half) {
    if (Math.abs(designer.dec_fee_half - price_perm) < 100) {
      designer.match++;
    }
  } else if (requirement.work_type === type.work_type_all) {
    if (Math.abs(designer.dec_fee_all <= price_perm) < 100) {
      designer.match++;
    }
  } else if (requirement.work_type === type.work_type_design_only) {

  }

  //匹配风格
  if (_.indexOf(designer.dec_styles, requirement.dec_style) >= 0) {
    designer.match++;
  }

  //匹配沟通
  if ((requirement.communication_type === designer.communication_type) || (
      requirement.communication_type === type.communication_type_free) || (
      designer.communication_type === type.communication_type_free)) {
    designer.match++;
  }

  //匹配房型
  if (_.indexOf(designer.dec_house_types, requirement.house_type) >=
    0) {
    designer.match++;
  }

  //匹配装修类型
  if (_.indexOf(designer.dec_types, requirement.dec_type) >= 0) {
    designer.match++;
  }

  //匹配性别
  if ((designer.sex === requirement.prefer_sex) || requirement.prefer_sex ==
    type.sex_no_limit) {
    designer.match++;
  }

  designer.match = 50 + designer.match * 7;
}

exports.top_designers = function (designers, requirement) {
  //计算设计师的匹配度
  _.forEach(designers, function (designer) {
    exports.designer_match(designer, requirement);
  });

  //找到3个最高匹配的设计师
  var tops = [];
  for (var i = 0; i < config.recommend_designer_count; i++) {
    var topIndex = 0;
    for (var j = 1; j < designers.length; j++) {
      if (designers[j].match > designers[topIndex].match) {
        topIndex = j;
      }
    }

    if (designers.length > 0) {
      tops.push(designers[topIndex]);
      designers.splice(topIndex, 1);
    }
  }

  return tops.reverse();
}
