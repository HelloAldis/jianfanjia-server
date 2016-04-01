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

        for (let i = 0; i < process.sections.length; i++) {
          if (i < 7) {
            process.sections[i].label = process_business.home_process_workflow[i].section[1];
            for (var j = 0; j < process.sections[i].items.length; j++) {
              process.sections[i].items[j].label = process_business.home_process_workflow[i].items[j][1];
            }
          } else {
            process.sections[i] = undefined;
          }
        }

        process.save(function (err) {
          next(err);
        });
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
