var eventproxy = require('eventproxy');
var Favorite = require('../../../proxy').Favorite;
var Product = require('../../../proxy').Product;
var Designer = require('../../../proxy').Designer;
var BeautifulImage = require('../../../proxy').BeautifulImage;
var tools = require('../../../common/tools');
var _ = require('lodash');
var ApiUtil = require('../../../common/api_util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var async = require('async');

exports.list_product = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
  ep.fail(next);

  Favorite.findOne({
    userid: userid
  }, null, ep.done(function (favorite) {
    if (favorite && favorite.favorite_product) {
      var productids = favorite.favorite_product.slice(skip, skip +
        limit);
      async.mapLimit(productids, 3, function (productid, callback) {
        Product.findOne({
          _id: productid
        }, null, function (err, product) {
          if (!product) {
            product = {
              _id: productid,
              is_deleted: true,
            };
            callback(err, product);
          } else {
            Designer.findOne({
              _id: product.designerid
            }, {
              imageid: 1,
            }, function (err, designer) {
              product = product.toObject();
              product.designer = designer;
              callback(err, product);
            });
          }
        });
      }, ep.done(function (results) {
        res.sendData({
          products: results,
          total: favorite.favorite_product.length,
        });
      }));
    } else {
      return res.sendData({
        products: [],
        total: 0,
      });
    }
  }));
}

exports.list_beautiful_image = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
  ep.fail(next);

  Favorite.findOne({
    userid: userid
  }, null, ep.done(function (favorite) {
    if (favorite && favorite.favorite_beautiful_image) {
      var beautiful_imageids = favorite.favorite_beautiful_image.slice(
        skip, skip + limit);
      async.mapLimit(beautiful_imageids, 3, function (beautiful_imageid,
        callback) {
        BeautifulImage.findOne({
          _id: beautiful_imageid
        }, null, function (err, beautiful_image) {
          if (beautiful_image) {
            beautiful_image = beautiful_image.toObject();
          } else {
            beautiful_image = {
              _id: beautiful_imageid,
              is_deleted: true,
            };
          }
          beautiful_image.is_my_favorite = true;
          callback(err, beautiful_image);
        });
      }, ep.done(function (results) {
        res.sendData({
          beautiful_images: results,
          total: favorite.favorite_beautiful_image.length,
        });
      }));
    } else {
      return res.sendData({
        beautiful_images: [],
        total: 0,
      });
    }
  }));
}

exports.list_designer = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var skip = req.body.from || 0;
  var limit = req.body.limit || 10;
  var ep = eventproxy();
  ep.fail(next);

  Favorite.findOne({
    userid: userid
  }, null, ep.done(function (favorite) {
    if (favorite && favorite.favorite_designer) {
      var designerids = favorite.favorite_designer.slice(skip, skip +
        limit);
      async.mapLimit(designerids, 3, function (designerid, callback) {
        Designer.findOne({
          _id: designerid
        }, {
          username: 1,
          imageid: 1,
          province: 1,
          city: 1,
          district: 1,
          authed_product_count: 1,
          order_count: 1,
          deal_done_count: 1,
          auth_type: 1,
          uid_auth_type: 1,
          work_auth_type: 1,
          email_auth_type: 1,
          service_attitude: 1,
          respond_speed: 1,
          tags: 1,
        }, function (err, designer) {
          if (!designer) {
            designer = {
              _id: designerid,
              is_deleted: true,
            };
          }

          callback(err, designer);
        });
      }, ep.done(function (results) {
        res.sendData({
          designers: results,
          total: favorite.favorite_designer.length,
        })
      }));
    } else {
      return res.sendData({
        designers: [],
        total: 0,
      });
    }
  }));
}

exports.add_product = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var productid = new ObjectId(req.body._id);
  var ep = eventproxy();
  ep.fail(next);

  Favorite.findOne({
    userid: userid
  }, null, ep.done(function (favorite) {
    if (favorite) {
      Favorite.addToSet({
        userid: userid
      }, {
        favorite_product: productid
      }, null, ep.done(function () {
        var result = _.find(favorite.favorite_product, function (
          o) {
          return o.toString() === productid.toString();
        });

        if (!result) {
          Product.incOne({
            _id: productid
          }, {
            favorite_count: 1
          });
        }

        res.sendSuccessMsg();
      }));
    } else {
      Favorite.newAndSave({
        userid: userid,
        favorite_product: [productid]
      }, ep.done(function () {
        Product.incOne({
          _id: productid
        }, {
          favorite_count: 1
        });
        res.sendSuccessMsg();
      }));
    }

  }));
};

exports.add_beautiful_image = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var beautiful_id = new ObjectId(req.body._id);
  var ep = eventproxy();
  ep.fail(next);

  Favorite.findOne({
    userid: userid
  }, null, ep.done(function (favorite) {
    if (favorite) {
      Favorite.addToSet({
        userid: userid
      }, {
        favorite_beautiful_image: beautiful_id
      }, null, ep.done(function () {
        res.sendSuccessMsg();
        var result = _.find(favorite.favorite_beautiful_image,
          function (o) {
            return o.toString() === beautiful_id.toString();
          });

        if (!result) {
          BeautifulImage.incOne({
            _id: beautiful_id
          }, {
            favorite_count: 1
          });
        }
      }));
    } else {
      Favorite.newAndSave({
        userid: userid,
        favorite_beautiful_image: [beautiful_id]
      }, ep.done(function () {
        BeautifulImage.incOne({
          _id: beautiful_id
        }, {
          favorite_count: 1
        });
        res.sendSuccessMsg();
      }));
    }
  }));
};

exports.add_designer = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var designerid = new ObjectId(req.body._id);
  var ep = eventproxy();
  ep.fail(next);

  Favorite.findOne({
    userid: userid
  }, null, ep.done(function (favorite) {
    if (favorite) {
      Favorite.addToSet({
        userid: userid
      }, {
        favorite_designer: designerid
      }, null, ep.done(function () {
        var result = _.find(favorite.favorite_designer, function (o) {
          return o.toString() === designerid.toString();
        });

        if (!result) {
          Designer.incOne({
            _id: designerid
          }, {
            favorite_count: 1
          }, null);
        }

        res.sendSuccessMsg();
      }));
    } else {
      Favorite.newAndSave({
        userid: userid,
        favorite_designer: [designerid]
      }, ep.done(function () {
        Designer.incOne({
          _id: designerid
        }, {
          favorite_count: 1
        }, null);
        res.sendSuccessMsg();
      }));
    }
  }));
};

exports.delete_product = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var productid = new ObjectId(req.body._id);
  var ep = eventproxy();
  ep.fail(next);

  Favorite.pull({
    userid: userid
  }, {
    favorite_product: productid
  }, null, ep.done(function (favorite) {
    if (favorite) {
      var result = _.find(favorite.favorite_product, function (o) {
        return o.toString() === productid.toString();
      });

      if (result) {
        Product.incOne({
          _id: productid
        }, {
          favorite_count: -1
        });
      }
    }

    res.sendSuccessMsg();
  }));
};

exports.delete_beautiful_image = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var beautiful_imageid = new ObjectId(req.body._id);
  var ep = eventproxy();
  ep.fail(next);

  Favorite.pull({
    userid: userid
  }, {
    favorite_beautiful_image: beautiful_imageid
  }, null, ep.done(function (favorite) {
    res.sendSuccessMsg();
    if (favorite) {
      var result = _.find(favorite.favorite_beautiful_image, function (
        o) {
        return o.toString() === beautiful_imageid.toString();
      });

      if (result) {
        BeautifulImage.incOne({
          _id: beautiful_imageid
        }, {
          favorite_count: -1
        });
      }
    }
  }));
};

exports.delete_designer = function (req, res, next) {
  var userid = ApiUtil.getUserid(req);
  var designerid = tools.trim(req.body._id);
  var ep = eventproxy();
  ep.fail(next);

  Favorite.pull({
    userid: userid
  }, {
    favorite_designer: designerid
  }, null, ep.done(function (favorite) {
    if (favorite) {
      var result = _.find(favorite.favorite_designer, function (o) {
        return o.toString() === designerid.toString();
      });

      if (result) {
        Designer.incOne({
          _id: designerid
        }, {
          favorite_count: -1
        }, null);
      }
    }

    res.sendSuccessMsg();
  }));
};
