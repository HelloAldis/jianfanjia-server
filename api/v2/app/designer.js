var validator = require('validator');
var eventproxy = require('eventproxy');
var Designer = require('../../../proxy').Designer;
var Product = require('../../../proxy').Product;
var Plan = require('../../../proxy').Plan;
var User = require('../../../proxy').User;
var Requirement = require('../../../proxy').Requirement;
var Favorite = require('../../../proxy').Favorite;
var tools = require('../../../common/tools');
var _ = require('lodash');
var config = require('../../../apiconfig');
var async = require('async');
var ApiUtil = require('../../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var type = require('../../../type');
var limit = require('../../../middlewares/limit')

exports.home_page_designers = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
  ep.fail(next);

  var tasks = {};
  if (skip === 0) {
    tasks.requirement = function (callback) {
      Requirement.find({
        userid: userid,
      }, {
        rec_designerids: 1,
        status: 1,
      }, {
        sort: {
          create_at: -1
        },
        skip: 0,
        limit: 1,
        lean: true,
      }, ep.done(function (requirements) {
        if (requirements.length > 0) {
          var requirement = requirements[0];
          if (requirement.status === type.requirement_status_new) {
            Designer.find({
              _id: {
                $in: requirement.rec_designerids
              },
            }, {
              username: 1,
              imageid: 1,
              service_attitude: 1,
              respond_speed: 1,
              auth_type: 1,
            }, function (err, designers) {
              if (designers) {
                requirement.designers = designers;
              } else {
                requirement.designers = [];
              }

              callback(err, requirement);
            });
          } else {
            callback(null, requirement);
          }
        } else {
          callback(null, undefined);
        }
      }));
    }
  }

  tasks.designers = function (callback) {
    Designer.find({
      auth_type: type.designer_auth_type_done,
      // uid_auth_type: type.designer_auth_type_done,
      authed_product_count: {
        $gte: 1
      },
    }, {
      username: 1,
      imageid: 1,
      auth_type: 1,
    }, {
      sort: {
        authed_product_count: -1
      },
      skip: skip,
      limit: limit,
      lean: true,
    }, ep.done(function (designers) {
      async.mapLimit(designers, 3, function (designer, callback) {
        Product.find({
          designerid: designer._id,
          auth_type: type.product_auth_type_done,
        }, {
          cell: 1,
          images: 1,
          house_area: 1,
          house_type: 1,
          dec_style: 1,
        }, {
          sort: {
            view_count: -1
          },
          skip: 0,
          limit: 1,
          lean: true,
        }, function (err, products) {
          designer.product = products[0];
          callback(err, designer);
        });
      }, ep.done(function (designers) {
        callback(null, designers);
      }));
    }));
  }

  async.parallel(tasks, ep.done(function (result) {
    res.sendData(result);
  }));
}
