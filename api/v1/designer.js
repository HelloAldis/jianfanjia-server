var validator = require('validator');
var eventproxy = require('eventproxy');
var Designer = require('../../proxy').Designer;
var Product = require('../../proxy').Product;
var Plan = require('../../proxy').Plan;
var tools = require('../../common/tools');
var _ = require('lodash');
var config = require('../../config');
var async = require('async');
var ApiUtil = require('../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports.getInfo = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  Designer.getUserById(userid, function (err, designer) {
    if (err) {
      return next(err);
    }

    designer.pass = '';
    designer.accessToken = '';
    res.send({data:designer});
  });
};

exports.updateInfo = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var designer = ApiUtil.buildDesinger(req);

  Designer.updateByQuery({_id: userid}, designer, function (err) {
    if (err) {
      return next(err);
    }

    res.send({msg:'更新成功'});
  });
};

exports.getOne = function (req, res, next) {
  var designerid = req.params._id;

  Designer.getUserById(designerid, function (err, designer) {
    if (err) {
      return next(err);
    }


    designer.pass = '';
    designer.accessToken = '';
    Designer.addViewCountForDesigner(designerid);
    res.send({data:designer});
    // Product.getProductsByDesignerid(designerid, function (err, products) {
    //   if (err) {
    //     return next(err);
    //   }
    //
    //   designer.products = products;
    //
    // });

  });
}

exports.listtop = function (req, res, next) {
  Designer.findDesignersOrderByScore(config.index_top_designer_count, function (err, designer) {
    if (err) {
      return next(err);
    }

    res.send({data:designer});
  })
}

exports.search = function (req, res, next) {

}

exports.myUser = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var ep = eventproxy();

  ep.fail(next);
  ep.on('user', function (user) {
    res.send({data: user});
  });

  Plan.getPlansByDesignerid(designerid, function (err, plans) {
    if (err) {
      return next(err);
    }

    ep.emit('user', plans);
  });
}

exports.okUser = function (req, res, next) {

}

exports.rejectUser = function (req, res, next) {

}

exports.auth = function (req, res, next) {

}
