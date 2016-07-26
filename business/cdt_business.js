'use strict';

const superagent = require('superagent');
const utility = require('utility');
const crypto = require('crypto');
const config = require('../apiconfig');

const apiKey = 'cdtjfj';
const key = 'Wbg67AB8+LuvZcKKaEew0Q==';
const loanApplyService_url = config.cdt_api_url + '/service/loanApplyService?apiKey=' + apiKey;
const myOrderService_url = config.cdt_api_url + '/service/myOrderService?apiKey=' + apiKey;
const orderScheduleService_url = config.cdt_api_url + '/service/orderScheduleService?apiKey=' + apiKey;

const aesKey = utility.base64decode('Wbg67AB8+LuvZcKKaEew0Q==', false, 'buffer');
console.log(aesKey);

//查看我的订单
exports.myOrderService = function (body) {
  superagent.post(myOrderService_url).send();
}

// 先base64解码字符串 然后解密 字符串, 所以发送请求要先加密然后base64编码
function beRequest(body) {
  let request = {
    head: {
      from: "简繁家"
    },
    body: body
  };

  let jsonStr = JSON.stringify(request);
  console.log('jsonStr = ' + jsonStr);
  const cipher = crypto.createCipher('aes128', aesKey);
  let req = cipher.update(jsonStr, 'utf8', 'base64');
  req += cipher.final('base64');
  console.log('req = ' + req);
  return req;
}

function deResponse(resp) {
  // let buffer = utility.base64decode('', false, 'buffer');
  const decipher = crypto.createDecipher('aes128', aesKey);
  let res = decipher.update(resp, 'base64', 'utf8');
  res += decipher.final('utf8');
  console.log('res = ' + res);
  return res;
}

beRequest({
  phone: '18122222222'
});

deResponse('b+3JUyQlk6hwaVCXAax1z0r9ABY6hOUXfSd1CApcdDK3l8fcA12oz11RuidFIhQLV/wJq6dcEfDK9XxXZRZ1oA==');

// request.post(url).send({
//   expire_seconds: 604800,
//   action_name: 'QR_SCENE',
//   action_info: {
//     scene: {
//       scene_id: sceneid
//     }
//   }
// }).end(ep.done(function (wei_res) {
//   if (wei_res.ok && !wei_res.body.errcode) {
//     var url =
//       'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' +
//       wei_res.body.ticket;
//     res.send(wechat_util.get_image_text_msg(msg.FromUserName,
//       msg.ToUserName,
//       '简繁家感谢你为我们推广',
//       '请点击链接并保管好你的二维码', url, url));
//   } else {
//     logger.error(wei_res.text);
//   }
// }));
