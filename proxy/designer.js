var models = require('../models');
var Designer = models.Designer;
var uuid = require('node-uuid');
var type = require('../type');

exports.getDesignerById = function (id, callback) {
  Designer.findOne({
    _id: id
  }, callback);
};

exports.getDesignerByPhone = function (phone, callback) {
  Designer.findOne({
    'phone': phone
  }, callback);
};

exports.newAndSave = function (json, callback) {
  var designer = new Designer(json);
  designer.accessToken = uuid.v4();
  designer.create_at = new Date().getTime();

  designer.save(callback);
};

exports.updateByQuery = function (query, json, callback) {
  Designer.update(query, {
    $set: json
  }, callback);
};

exports.addViewCountForDesigner = function (desingerid, num) {
  Designer.update({
    _id: desingerid
  }, {
    '$inc': {
      'view_count': num
    }
  }, function (err) {});
};

exports.addOrderCountForDesigner = function (desingerid, num) {
  Designer.update({
    _id: desingerid
  }, {
    '$inc': {
      'order_count': num
    }
  }, function (err) {});
};

exports.addProductCountForDesigner = function (desingerid, num) {
  Designer.update({
    _id: desingerid
  }, {
    '$inc': {
      'product_count': num
    }
  }, function (err) {});
};

exports.addTeamCountForDesigner = function (desingerid, num) {
  Designer.update({
    _id: desingerid
  }, {
    '$inc': {
      'team_count': num
    }
  }, function (err) {});
};

exports.getTopDesigners = function (limit, callback) {
  Designer.find({
      auth_type: type.designer_auth_type_done
    }, {
      pass: 0,
      accessToken: 0,
    }, {
      sort: {
        auth_date: -1
      },
      limit: limit
    },
    callback
  );
};

exports.findDesignersByQuery = function (query, sort, callback) {
  Designer.find(query, {
    pass: 0,
    accessToken: 0
  }, {
    sort: sort
  }, callback);
}

exports.getSByQueryAndProject = function (query, project, callback) {
  Designer.find(query, project, callback);
}

exports.getOneByQueryAndProject = function (query, project, callback) {
  Designer.findOne(query, project, callback);
}

exports.findOne = function (query, project, callback) {
  Designer.findOne(query, project, callback);
}

exports.find = function (query, project, option, callback) {
  Designer.find(query, project, option, callback);
}

exports.updateOne = function (query, update, option, callback) {
  Designer.findOneAndUpdate(query, update, option, callback)
}

exports.update = function (query, option, callback) {
  Designer.findOne(query, option, callback);
}

exports.removeOne = function (query, option, callback) {
  Designer.findOneAndRemove(query, option, callback);
}
