var validator = require('validator');
var eventproxy = require('eventproxy');
var Designer = require('../../proxy').Designer;
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

    Designer.addTeamCountForDesigner(designerid, 1);
    res.sendSuccessMsg();
  });
};

exports.update = function (req, res, next) {
  var team = ApiUtil.buildTeam(req);
  var oid = tools.trim(req.body._id);
  var designerid = ApiUtil.getUserid(designerid);

  if (oid === '') {
    res.sendErrMsg('信息不完全');
    return;
  }

  Team.updateByQuery({
    _id: new ObjectId(oid),
    designerid: designerid
  }, team, function (err) {
    if (err) {
      return next(err);
    }

    res.sendSuccessMsg();
  });
}

exports.delete = function (req, res, next) {
  var oid = tools.trim(req.body._id);
  var designerid = ApiUtil.getUserid(req);

  if (oid === '') {
    res.sendErrMsg('信息不完全');
    return;
  }

  Team.removeOneByQuery({
    _id: new ObjectId(oid),
    designerid: designerid
  }, function (err, team) {
    if (err) {
      return next(err);
    }

    if (team) {
      Designer.addTeamCountForDesigner(designerid, -1);
    }

    res.sendSuccessMsg();
  });
}

exports.list = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);

  Team.getTeamsByDesignerid(designerid, function (err, teams) {
    if (err) {
      return next(err);
    }

    res.sendData(teams);
  });
}
