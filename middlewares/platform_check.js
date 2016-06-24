'use strict'

const type = require('../type.js');

const androidUserAppAgent = 'jua';
const androidDesignerAppAgent = 'jpa';
const iosUserAppAgent = 'jianfanjia';
const iosDesignerAgent = 'jianfanjia-designer';

module.exports = function (req, res, next) {
  let agent = req.get('User-Agent');
  if (agent.indexOf(androidUserAppAgent) >= 0 || agent.indexOf(androidDesignerAppAgent) >= 0) {
    req.platform_type = type.platform_android;
  } else if (agent.indexOf(iosUserAppAgent) >= 0 || agent.indexOf(iosDesignerAgent) >= 0) {
    req.platform_type = type.platform_ios;
  } else {
    req.platform_type = type.platform_pc;
  }

  next();
};
