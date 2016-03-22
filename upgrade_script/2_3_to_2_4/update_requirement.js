var Requirement = require('../../proxy').Requirement;
var User = require('../../proxy').User;
var async = require('async');

var requirementids = [];
Requirement.count({}, function (err, count) {
  if (err) {
    return console.log('err = ' + err);
  }

  async.timesSeries(count, function (n, next) {
    Requirement.find({}, null, {
      skip: n,
      limit: 1,
    }, function (err, requirements) {
      if (err) {
        next(err);
      } else {
        var requirement = requirements[0];
        User.findOne({
          _id: requirement.userid
        }, null, function (err, user) {
          if (err) {
            next(err);
          } else {
            if (!user.phone) {
              requirementids.push(requirement._id);
            }
            next();
          }
        });
      }
    });
  }, function (err) {
    if (err) {
      console.log('complete requirement wit err =' + err);
      process.exit();
    } else {
      console.log('complete requirement ok');
      console.log('requirements user no phone = ' + requirementids);
      Requirement.removeSome({
        _id: {
          $in: requirementids
        }
      }, function () {
        process.exit();
      });
    }
  });
});
