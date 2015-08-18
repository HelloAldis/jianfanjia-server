var TempUser = require('../../proxy').TempUser;
var eventproxy = require('eventproxy');
var validator = require('validator');
var _ = require('lodash');

exports.add = function (req, res, next) {
  // var name = validator.trim(req.body.name);
  // var phone = validator.trim(req.body.phone);
  var json = {};
  json.name = validator.trim(req.body.name);
  json.phone = validator.trim(req.body.phone);

  var ep = new eventproxy();
  ep.fail(next);
  ep.on('user_err', function (msg) {
    res.status(200);
    res.send({error_msg: msg});
  });

  if ([json.name, json.phone].some(function (item) { return item === ''; })) {
    ep.emit('user_err', '信息不完整。');
    return;
  }

  TempUser.getOneByNamePhone(json.name, json.phone, function (err, tempUsers) {
    if (err) {
      return next(err);
    }

    if (tempUsers) {
      res.send({msg: '添加成功'});
      return;
    }

    TempUser.newAndSave(json, function (err) {
      if (err) {
        return next(err);
      }

      res.send({msg: '添加成功'});
    });
  });
};

exports.show = function (req, res, next) {
  TempUser.getAll(function (err, tempUsers) {
    var html = '<table border="1">';
    console.log(tempUsers);
    _.forEach(tempUsers, function (n) {
      console.log(n);
      html = html + '<tr><td>' + n.name + '</td><td>' + n.phone + '</td></tr>';
    });
    html = html + '<tr><td>' + JSON.stringify(tempUsers) + '</td></tr>'
    html = html + '</table>';

    res.send(html);
  });
};
