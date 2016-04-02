var gt = require('../getui/gt.js');

var ids = ['56fa834237d0f4120e53e27c', '55ece905a2eb86ee4168aaab', '56fd49f137d0f4120e53e2f5', '56f7bc6a37d0f4120e53e1e6']

for (var id of ids) {
  gt.pushMessageToUser(id, {
    content:'温馨提示:由于您的装修需求还没有预约设计师，简繁家无法为您提供更好的服务，请您及时在需求列表预约设计师！'
  });
}

process.exit();
