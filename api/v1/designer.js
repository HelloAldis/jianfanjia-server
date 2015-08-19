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
var type = require('../../type');

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

    ApiUtil.sendData(res, designer);
  })
}

exports.search = function (req, res, next) {
  var query = req.body.query;
  var sort = req.body.sort;
  query.auth_type = type.designer_auth_type.done;
  
  console.log(query);

  Designer.findDesignersByQuery(query, sort, function (err, designers) {
    if (err) {
      return next(err);
    }

    ApiUtil.sendData(res, designers);
  })
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
  var designerid = ApiUtil.getUserid(req);
  var planid = tools.trim(req.body.planid);
  var house_check_time = req.body.house_check_time;

  Plan.updateByQuery({_id: planid}, {house_check_time:house_check_time, status: type.plan_status.designer_respond},
    function (err) {
      if (err) {
        return next(err);
      }

      ApiUtil.sendSuccessMsg(res);
    });
}

exports.rejectUser = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);
  var planid = tools.trim(req.body.planid);

  Plan.updateByQuery({_id: planid}, {status: type.plan_status.designer_reject},
    function (err) {
      if (err) {
        return next(err);
      }

      ApiUtil.sendSuccessMsg(res);
    });
}

exports.auth = function (req, res, next) {
  var designerid = ApiUtil.getUserid(req);

  Designer.updateByQuery({_id:designerid}, {auth_type: '1', auth_date: new Date()},
  function (err) {
    if (err) {
      return next(err);
    }

    res.send({msg:'申请成功'});
  });
}
