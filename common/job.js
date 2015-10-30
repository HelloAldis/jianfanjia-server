var config = require('../apiconfig');
var Agenda = require('agenda');
var Plan = require('../proxy').Plan;
var type = require('../type');

var agenda = new Agenda({
  db: {
    address: config.db
  },
  processEvery: '1 minute',
  defaultConcurrency: 1,
  maxConcurrency: 1,
});

agenda.define('expire_designer_respond', function (job, done) {
  var now = new Date().getTime()
  var time = now - (config.designer_respond_user_order_expired * 60 * 1000);

  Plan.update({
    status: type.plan_status_not_respond,
    request_date: {
      $lt: time
    },
  }, {
    status: type.plan_status_designer_no_respond_expired,
    last_status_update_time: now,
  }, function (err, count) {
    console.log('expire designer respond err: ' + err + ' count: ' +
      JSON.stringify(count));
    done();
  });
});

agenda.define('expire_designer_upload_plan', function (job, done) {
  var now = new Date().getTime()
  var time = now - (config.designer_upload_plan_expired * 60 * 1000);

  Plan.update({
    status: type.plan_status_designer_housecheck_no_plan,
    last_status_update_time: {
      $lt: time
    },
  }, {
    status: type.plan_status_designer_no_plan_expired,
    last_status_update_time: now,
  }, function (err, count) {
    console.log('expire designer upload plan err: ' + err +
      ' count: ' + JSON.stringify(count));
    done();
  });
});

agenda.on('ready', function () {
  agenda.every(config.interval_scan_expired_respond + ' minutes',
    'expire_designer_respond');
  agenda.every(config.interval_scan_expired_upload_plan + ' minutes',
    'expire_designer_upload_plan');

  agenda.start();
});

// exports.module = agenda;
