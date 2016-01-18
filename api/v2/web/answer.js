var _ = require('lodash');
var eventproxy = require('eventproxy');
var utility = require('utility');
var type = require('../../../type');
var util = require('util');
var Answer = require('../../../proxy').Answer;
var User = require('../../../proxy').User;
var Designer = require('../../../proxy').Designer;
var ApiUtil = require('../../../common/api_util');
var async = require('async');

exports.upload_wenjuan_answer = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var usertype = ApiUtil.getUsertype(req);
  var ep = eventproxy();
  ep.fail(next);

  async.times(req.body.answers.length, function (n, next) {
    var answer = req.body.answers[n];
    answer.userid = userid;
    answer.usertype = usertype;
    Answer.newAndSave(answer, function (err) {
      next(err);
    });
  }, ep.done(function () {
    res.sendSuccessMsg();
    // if (usertype === type.role_user) {
    //   User.findOne({
    //     _id: userid,
    //   }, {
    //     imageid: 1,
    //     username: 1,
    //   }, ep.done(function (user) {
    //     res.sendData(user);
    //   }));
    // } else(usertype === type.role_designer) {
    //   Designer.findOne({
    //     _id: userid,
    //   }, {
    //     imageid: 1,
    //     username: 1,
    //   }, ep.done(function (designer) {
    //     res.sendData(designer);
    //   }));
    // } else {
    //   res.sendData({
    //     username: 'Admin',
    //   });
    // }
  }));
}

exports.check_wenjuan_answer = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var usertype = ApiUtil.getUsertype(req);
  var wenjuanid = req.body.wenjuanid;
  var ep = eventproxy();
  ep.fail(next);

  if (usertype === type.role_user) {
    User.findOne({
      _id: userid,
    }, {
      imageid: 1,
      username: 1,
    }, ep.done(function (user) {
      Answer.findOne({
        userid: userid,
        usertype: usertype,
        wenjuanid: wenjuanid,
      }, {
        _id: 1
      }, ep.done(function (answer) {
        if (answer) {
          res.sendData({
            username: user.username,
            imageid: user.imageid,
            is_finish: true,
          });
        } else {
          res.sendData({
            username: user.username,
            imageid: user.imageid,
            is_finish: false,
          });
        }
      }));
    }));
  } else if (usertype === type.role_designer) {
    Designer.findOne({
      _id: userid,
    }, {
      imageid: 1,
      username: 1,
    }, ep.done(function (designer) {
      Answer.findOne({
        userid: userid,
        usertype: usertype,
        wenjuanid: wenjuanid,
      }, {
        _id: 1
      }, ep.done(function (answer) {
        if (answer) {
          res.sendData({
            username: designer.username,
            imageid: designer.imageid,
            is_finish: true,
          });
        } else {
          res.sendData({
            username: designer.username,
            imageid: designer.imageid,
            is_finish: false,
          });
        }
      }));
    }));
  } else {
    res.sendData({
      username: 'Admin',
      is_finish: false,
    });
  }
}
