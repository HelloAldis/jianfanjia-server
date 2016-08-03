'use strict'

const type = require('lib/type/type');

const androidUserAppAgent = 'jua';
const androidDesignerAppAgent = 'jpa';
const iosUserAppAgent = 'jianfanjia';
const iosDesignerAgent = 'jianfanjia-designer';

module.exports = function (req, res, next) {
  let agent = req.get('User-Agent');
  if (agent && (agent.indexOf(androidUserAppAgent) >= 0 || agent.indexOf(androidDesignerAppAgent) >= 0)) {
    req.platform_type = type.platform_android;
  } else if (agent && (agent.indexOf(iosUserAppAgent) >= 0 || agent.indexOf(iosDesignerAgent) >= 0)) {
    req.platform_type = type.platform_ios;
  } else {
    req.platform_type = type.platform_pc;
  }

  next();
};

// jpa
// jua
// HTTP/1.1/jianfanjia/2.9.0 (iPhone; iOS 9.3.2; Scale/2.00)
// HTTP/1.1/Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13F69 Safari/601.1 200 - - 14.576 ms
// HTTP/1.1/jianfanjia-designer/2.8.5 (iPhone; iOS 9.1; Scale/2.00) 200 17 - 27.126 ms
