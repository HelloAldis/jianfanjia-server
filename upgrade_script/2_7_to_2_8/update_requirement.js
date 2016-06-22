'use strict'

const User = require('../../proxy').User;
const Requirement = require('../../proxy').Requirement;
const Plan = require('../../proxy').Plan;
const _ = require('lodash');
const type = require('../../type');
const async = require('async');


const phones = ["13163376625", "15671564048", "15623156065", "13277061710", "13072729591", "13072729611", "13072729539", "13163375667", "15671563848",
  "13247155238", "13071291327", "13277063113", "15671563849", "13277061583", "13072747511", "13163375778", "13163376623", "13163376362",
  "13071291281", "13212727910", "13072730269", "13026372560", "13072732433", "13072747552", "15623155929", "13277062796", "15623155932",
  "13072732248", "13071262639", "18607134710", "13871476161", "13720228257", "15927692184", "17771899284", "13607143733"
];

const create_requirement_times = ["1-10", "1-12", "1-14", "2-19", "2-22", "2-24", "3-1", "3-9", "3-13", "3-15", "3-17", "3-21", "3-24", "3-28",
  "3-20", "3-14", "3-18", "3-31", "4-2", "4-4", "4-9", "4-13", "4-14", "4-15", "4-17", "4-19", "4-20", "4-22", "4-24", "4-1", "4-6", "4-26", "4-27",
  "4-28", "4-29"
];

async.timesSeries(phones.length, function (n, next) {
  User.findOne({
    phone: phones[n],
  }, {
    _id: 1,
  }, function (err, user) {
    if (user) {
      Requirement.find({
        userid: user._id
      }, null, null, function (err, requirements) {
        if (requirements.length == 0 || requirements.length > 1) {
          console.log(phone[n] + ' phone has ' + requirements.length + ' requirement');
          next();
        } else {
          let time = '2016-' + create_requirement_times[n] + ' ' + _.random(8, 23) + ':' + _.random(0, 59) + ':' + _.random(0, 59);
          console.log('create time ' + time);
          let create_at = new Date(time);
          let request_date = new Date(create_at.getTime() + _.random(0, 3600000));
          let house_check_time = new Date(request_date.getTime() + (_.random(1, 5) * 86400000));
          let user_ok_house_check_time = new Date(house_check_time.getTime() + _.random(0, 3600000));
          console.log('create_at = ' + create_at);
          console.log('request_date = ' + request_date);
          console.log('house_check_time = ' + house_check_time);
          console.log('user_ok_house_check_time = ' + user_ok_house_check_time);

          Plan.find({
            userid: user._id
          }, null, null, function (err, plans) {
            if (plans.length == 0 || plans.length > 1) {
              console.log(phone[n] + ' phone has ' + plans.length + ' plan');
              next();
            } else {
              next();
            }
          });
        }
      });
    } else {
      console.log(phone[n] + ' phone is not exist');
      next();
    }
  });
}, function (err) {

});

Designer.count({}, function (err, count) {
  if (err) {
    return console.log('err = ' + err);
  }

  async.timesSeries(count, function (n, next) {
    Designer.find({}, null, {
      skip: n,
      limit: 1,
      sort: {
        create_at: 1
      }
    }, function (err, designers) {
      if (err) {
        next(err);
      } else {
        let designer = designers[0];
        designer.realname = designer.realname || designer.username;

        designer.save(function (err) {
          next(err);
        });
      }
    });
  }, function (err) {
    if (err) {
      console.log('complete wit err =' + err);
      process.exit();
    } else {
      console.log('complete ok');
      process.exit();
    }
  });
});
