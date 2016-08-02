'use strict';

const superagent = require('superagent');
const utility = require('utility');
const crypto = require('crypto');
const http = require('http');
const config = require('../apiconfig');

const apiKey = 'cdtjfj';
// const apiKey = 'cdtfax';
const key = 'Wbg67AB8+LuvZcKKaEew0Q==';
// const key = 'gmamsXUgIlCtBcSCO3IDxg==';
const alg = 'aes-128-ecb';
const loanApplyService_url = config.cdt_api_url + '/service/loanApplyService?apiKey=' + apiKey;
const myOrderService_url = config.cdt_api_url + '/service/myOrderService?apiKey=' + apiKey;
const orderScheduleService_url = config.cdt_api_url + '/service/orderScheduleService?apiKey=' + apiKey;

const aesKey = utility.base64decode(key, false, 'buffer');
console.log(aesKey);

function cdtApi(url, body) {
  let req = beRequest(body);
  console.log(req);
  superagent.post(url).send(req).end(function (err, res) {
    console.log(err);
    console.log(res.text);
    deResponse(res.text);
  });
}

//查看我的订单
exports.myOrderService = function (body) {
  cdtApi(myOrderService_url, body);
}

exports.loanApplyService = function (body) {
  cdtApi(loanApplyService_url, body);
}

exports.orderScheduleService = function (body) {
  cdtApi(orderScheduleService_url, body);
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
  const cipher = crypto.createCipheriv(alg, aesKey, new Buffer(''));
  let req = cipher.update(jsonStr, 'utf8', 'base64');
  req += cipher.final('base64');
  return 'req=' + encodeURIComponent(req);
}

function deResponse(resp) {
  const decipher = crypto.createDecipheriv(alg, aesKey, new Buffer(''));
  let res = decipher.update(resp, 'base64', 'utf8');
  res += decipher.final('utf8');
  console.log('res = ' + res);
  return res;
}

// exports.myOrderService({
//   tel: '18107218595'
// });

// exports.loanApplyService({
//   province: '湖北省',
//   city: '',
//   area: '',
//   userName: '',
//   sex: '',
//   idCard: '',
//   tel: ''
// })
exports.loanApplyService({
  province: '湖北省',
  city: '武汉市',
  area: '江岸区',
  userName: '李凯',
  sex: 0,
  idCard: '420204198908114925',
  amount: 10,
  tel: '18107218595'
})
