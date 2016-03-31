'use strict'

const Requirement = require('../../proxy').Requirement;
const Process = require('../../proxy').Process;
const type = require('../../type');
const requirement_util = require('../../common/requirement_util');
const async = require('async');

Requirement.count({}, function (err, count) {
  if (err) {
    return console.log('err = ' + err);
  }

  async.timesSeries(count, function (n, next) {
    Requirement.find({}, null, {
      skip: n,
      limit: 1,
      sort: {
        create_at: 1
      }
    }, function (err, requirements) {
      if (err) {
        next(err);
      } else {
        let requirement = requirements[0];
        if (requirement.dec_type === type.dec_type_home) {
          console.log(requirement_util.merge2BasciAddress(requirement.cell, requirement.cell_phase));
          console.log(requirement_util.merge2DetailAddress(requirement.cell_building, requirement.cell_unit, requirement.cell_detail_number));
          requirement.basic_address = requirement.basic_address || requirement_util.merge2BasciAddress(requirement.cell, requirement.cell_phase);
          requirement.detail_address = requirement.detail_address || requirement_util.merge2DetailAddress(requirement.cell_building,
            requirement.cell_unit, requirement.cell_detail_number);
        } else {
          requirement.basic_address = requirement.basic_address || requirement.cell;
          requirement.detail_address = requirement.detail_address || requirement.street;
        }

        requirement.cell = undefined;
        requirement.cell_phase = undefined;
        requirement.cell_building = undefined;
        requirement.cell_unit = undefined;
        requirement.cell_detail_number = undefined;
        requirement.street = undefined;

        requirement.save(function (err) {
          next(err);
        });
      }
    });
  }, function (err) {
    if (err) {
      console.log('complete requirement wit err =' + err);
      process.exit();
    } else {
      console.log('complete requirement ok');
      updateProcess();
    }
  });
});


function updateProcess() {
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
                process.basic_address = requirement.basic_address;
                process.detail_address = requirement.detail_address;
                process.business_house_type = requirement.business_house_type;
                process.dec_type = requirement.dec_type;

                process.cell = undefined;

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
}
