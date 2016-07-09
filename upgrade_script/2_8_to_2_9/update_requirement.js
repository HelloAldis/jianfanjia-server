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

const start_at_times = ["3-28", "3-20", "4-16", "3-17", "3-28", "3-28", "4-2", "4-4", "4-18", "4-7", "4-16", "4-23", "4-26", "4-20", "5-3", "6-20",
  "5-20", "6-6", "6-6", "5-10", "6-10", "6-18", "5-18", "5-18", "6-1", "6-6", "6-8", "5-18", "6-10", "5-8", "6-2", "6-5", "5-20", "6-16", "6-6"
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
          console.log(phones[n] + ' Error phone has ' + requirements.length + ' requirement');
          next();
        } else {
          let time = '2016-' + start_at_times[n] + ' 08:00:00';
          console.log(' time ' + time);
          let start_at = new Date(time);
          console.log('phone = ' + phones[n]);
          console.log('start_at = ' + start_at);
          requirements[0].start_at = start_at.getTime();
          requirements[0].save(function (err) {
            if (err) {
              console.log('save requirement err');
            } else {
              next();
            }
          });
        }
      });
    } else {
      console.log(phones[n] + ' Error phone is not exist');
      next();
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
