'use strict';

const superagent = require('superagent');
const utility = require('utility');
const crypto = require('crypto');
const config = require('lib/config/apiconfig');
const logger = require('lib/common/logger');

const apiKey = 'cdtjfj';
const key = 'Wbg67AB8+LuvZcKKaEew0Q==';
const alg = 'aes-128-ecb';
const loanApplyService_url = config.cdt_api_url + '/service/loanApplyService?apiKey=' + apiKey;
const myOrderService_url = config.cdt_api_url + '/service/myOrderService?apiKey=' + apiKey;
const orderScheduleService_url = config.cdt_api_url + '/service/orderScheduleService?apiKey=' + apiKey;
const aesKey = utility.base64decode(key, false, 'buffer');

function cdtApi(url, body, callback) {
  let req = beRequest(body);
  superagent.post(url).send(req).end(function (err, res) {
    err && logger.error(err);
    callback(err, deResponse(res.text));
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
  logger.debug('cdt request = ' + jsonStr);
  const cipher = crypto.createCipheriv(alg, aesKey, new Buffer(''));
  let req = cipher.update(jsonStr, 'utf8', 'base64');
  req += cipher.final('base64');
  return 'req=' + encodeURIComponent(req);
}

function deResponse(resp) {
  const decipher = crypto.createDecipheriv(alg, aesKey, new Buffer(''));
  let res = decipher.update(resp, 'base64', 'utf8');
  res += decipher.final('utf8');
  logger.debug('cdt response = ' + res);
  return JSON.stringify(res);
}

// exports.myOrderService({
//   tel: '18107218595'
// });

// exports.loanApplyService({
//     province: '湖北省',
//     city: '武汉市',
//     area: '江岸区',
//     userName: '李凯',
//     sex: 0,
//     idCard: '420204198908114925',
//     amount: 100000,
//     tel: '18107218595'
//   })
// {"head":{"flag":200},"body":{"code":"CDT2016080200002332"}}

exports.orderScheduleService({
  code: 'CDT2016080200002332'
});

// {
//   "head": {
//     "flag": 200
//   },
//   "body": {
//     "orders": [{
//       "amount": 100000,
//       "area": "江岸区",
//       "city": "武汉市",
//       "code": "CDT2016080200002332",
//       "createTime": 1470128217000,
//       "idcard": "420204198908114925",
//       "productName": "中银消费金融--装修贷",
//       "province": "湖北省",
//       "sex": 0,
//       "status": 70,
//       "userName": "李凯"
//     }]
//   }
// }

// {
//   "head": {
//     "flag": 200
//   },
//   "body": {
//     "schedules": [{
//       "createTime": 1470186745000,
//       "status": 70
//     }, {
//       "createTime": 1470186725000,
//       "status": 90
//     }, {
//       "createTime": 1470186694000,
//       "status": 80
//     }, {
//       "createTime": 1470186650000,
//       "status": 60
//     }, {
//       "createTime": 1470186634000,
//       "status": 50
//     }, {
//       "createTime": 1470186604000,
//       "status": 40
//     }, {
//       "createTime": 1470186555000,
//       "status": 30
//     }, {
//       "createTime": 1470186314000,
//       "status": 20
//     }, {
//       "createTime": 1470128217000,
//       "status": 10
//     }]
//   }
// }

// 0 初始状态
// 10 客服审核 11 客服审核不通过 15 客服审核挂起
// 20 客户经理审核 21 客户经理审核不通过 25 客户经理审核挂起
// 30 风控初审 31 风控初审否单 32 风控初审退单 35 风控初审挂起
// 40 资信调查 41 资信调查不通过 45 资信调查挂起
// 50 审贷会评审 51 审贷会评审否单 52 客户退单 55 审贷会评审挂起
// 60 银行会签 61 银行会签不通过 65 银行会签挂起
// 70 已放款 71 放款失败
// require\('(../)+
