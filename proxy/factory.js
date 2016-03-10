exports.create_proxy = function create_proxy(model) {
  return new DaoProxy(model);
}

/**
 * Initialize Proxy with the given mongoose model,
 *
 * @param {model} path
 */
function DaoProxy(model) {
  this.model = model;
}


/**
  save bson to mongodb
*/
DaoProxy.prototype.newAndSave = function (json, callback) {
  var o = new this.model(json);
  o.create_at = new Date().getTime();

  o.save(callback);
}

/**
  find bson from mongodb
*/
DaoProxy.prototype.find = function (query, project, option, callback) {
  this.model.find(query, project, option, callback);
}

DaoProxy.prototype.findOne = function (query, project, callback) {
  this.model.findOne(query, project, callback);
}

DaoProxy.prototype.paginate = function (query, project, option, callback) {
  this.model.count(query, function (err, count) {
    if (err) {
      return callback(err, null);
    }

    this.model.find(query, project, option, function (err, products) {
      callback(err, products, count);
    });
  });
}

DaoProxy.prototype.count = function (query, callback) {
  this.model.count(query, callback);
}

/**
  update bason to mongodb
*/

DaoProxy.prototype.setOne = function (query, update, option, callback) {
  update.lastupdate = new Date().getTime();
  this.model.findOneAndUpdate(query, {
    $set: update
  }, option, callback);
}

DaoProxy.prototype.setSome = function (query, update, option, callback) {
  option = option || {};
  option.multi = true;
  update.lastupdate = new Date().getTime();
  this.model.update(query, {
    $set: update
  }, option, callback);
}

DaoProxy.prototype.incOne = function (query, update, option, callback) {
  var set = {
    lastupdate: Date().getTime(),
  };

  this.model.findOneAndUpdate(query, {
    $inc: update,
    $set: set
  }, option, function (err) {});
}

DaoProxy.prototype.removeOne = function (query, option, callback) {
  this.model.findOneAndRemove(query, option, callback);
}
