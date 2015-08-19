var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../../proxy').User;
var Team = require('../../proxy').Team;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../config');
var async = require('async');
var ApiUtil = require('../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports.add = function (req, res, next) {
  var team = ApiUtil.buildTeam(req);
  var designerid = ApiUtil.getUserid(req);
  team.designerid = designerid;

  Team.newAndSave(team, function (err) {
    if (err) {
      return next(err);
    }

    ApiUtil.sendSuccessMsg(res);
  });
};

exports.update = function (req, res, next) {
  var team = ApiUtil.buildTeam(req);
  var oid = tools.trim(req.body._id);

  if (oid === '') {
    res.send({msg: '信息不完全'});
    return;
  }

  Team.updateByQuery({_id: new ObjectId(oid)}, team, function (err) {
    if (err) {
      return next(err);
    }

    ApiUtil.sendSuccessMsg(res);
  });
}

exports.delete = function (req, res, next) {
  var oid = tools.trim(req.body._id);

  if (oid === '') {
    res.send({msg: '信息不完全'});
    return;
  }

  Team.removeOneByQuery({_id: new ObjectId(oid)}, function (err) {
    if (err) {
      return next(err);
    }

    ApiUtil.sendSuccessMsg(res);
  });
}

exports.list = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);

  Team.getTeamsByDesignerid(designerid, function (err, teams) {
    if (err) {
      return next(err);
    }

    ApiUtil.sendData(res, teams);
  });
}
