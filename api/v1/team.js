var validator = require('validator');
var eventproxy = require('eventproxy');
var Designer = require('../../proxy').Designer;
var Team = require('../../proxy').Team;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../apiconfig');
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

    Designer.incOne({
      _id: designerid
    }, {
      team_count: 1
    }, {});

    res.sendSuccessMsg();
  });
};

exports.update = function (req, res, next) {
  var team = ApiUtil.buildTeam(req);
  var oid = tools.trim(req.body._id);
  var designerid = ApiUtil.getUserid(req);

  if (oid === '') {
    res.sendErrMsg('信息不完全');
    return;
  }

  Team.setOne({
    _id: new ObjectId(oid),
    designerid: designerid
  }, team, null, function (err) {
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

  Team.removeOne({
    _id: new ObjectId(oid),
    designerid: designerid
  }, null, function (err, team) {
    if (err) {
      return next(err);
    }

    if (team) {
      Designer.incOne({
        _id: designerid
      }, {
        team_count: -1
      }, {});
    }

    res.sendSuccessMsg();
  });
}

exports.list = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);

  Team.find({
    designerid: designerid
  }, null, null, function (err, teams) {
    if (err) {
      return next(err);
    }

    res.sendData(teams);
  });
}
