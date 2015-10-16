var _ = require('lodash');
var type = require('../type');

exports.designer_match = function (designer, requirement) {
  var price_perm = requirement.total_price * 10000 / requirement.house_area;
  designer.match = 0;

  //匹配区域
  if (_.indexOf(designer.dec_districts, requirement.district) >= 0) {
    designer.match++;
  }

  //匹配钱
  if (requirement.work_type === type.work_type_half) {
    if (designer.dec_fee_half <= price_perm) {
      designer.match++;
    }
  } else if (requirement.work_type === type.work_type_all) {
    if (designer.dec_fee_all <= price_perm) {
      designer.match++;
    }
  }

  //匹配风格
  if (_.indexOf(designer.dec_styles, requirement.dec_style) >= 0) {
    designer.match++;
  }

  //匹配沟通
  if (requirement.communication_type === designer.communication_type) {
    designer.match++;
  }

  //匹配房型
  if (_.indexOf(designer.dec_house_types, requirement.house_type) >=
    0) {
    designer.match++;
  }

  designer.match = 50 + designer.match * 9;
}
