'use strict'

const eventproxy = require('eventproxy');
const Supervisor = require('../../../proxy').Supervisor;
const ApiUtil = require('../../../common/api_util');

exports.supervisor_my_info = function (req, res, next) {
  let _id = req.body._id || ApiUtil.getUserid(req);
  let ep = eventproxy();
  ep.fail(next);

  Supervisor.findOne({
    _id: _id
  }, {
    pass: 0,
  }, ep.done(function (supervisor) {
    res.sendData(supervisor);
  }));
}

exports.supervisor_update_info = function (req, res, next) {
  let _id = ApiUtil.getUserid(req);
  let supervisor = ApiUtil.buildSupervisor(req);
  let ep = eventproxy();
  ep.fail(next);

  Supervisor.setOne({
    _id: _id
  }, supervisor, {
    new: true
  }, ep.done(function (user) {
    res.sendSuccessMsg();
  }));
};
