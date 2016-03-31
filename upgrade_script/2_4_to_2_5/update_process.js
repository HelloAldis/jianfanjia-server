'use strict'

const Process = require('../../proxy').Process;
const type = require('../../type');
const requirement_util = require('../../common/requirement_util');
const async = require('async');
const process_business = require('../../business/process_business');

Process.count({}, function (err, count) {
  if (err) {
    return console.log('err = ' + err);
  }

  async.timesSeries(count, function (n, next) {
    Process.find({}, null, {
      skip: n,
      limit: 1,
      sort: {
        create_at: 1
      }
    }, function (err, processes) {
      if (err) {
        next(err);
      } else {
        let process = processes[0];
        if (process.requirementid) {
          Requirement.findOne({
            _id: process.requirementid,
          }, null, function (err, requirement) {
            if (requirement) {
              for (let i = 0; i < requirement.sections.length; i++) {
                requirement.sections[i].label = process_business.home_process_workflow[i].section[1];
                for (var j = 0; j < requirement.sections[i].items.length; j++) {
                  requirement.section[i].items[j].label = process_business.home_process_workflow[i].items[j][1];
                }
              }

              process.save(function (err) {
                next(err);
              });
            } else {
              next(err);
            }
          });
        }
      }
    });
  }, function (err) {
    if (err) {
      console.log('complete process wit err =' + err);
      process.exit();
    } else {
      console.log('complete process ok');
      process.exit();
    }
  });
});
