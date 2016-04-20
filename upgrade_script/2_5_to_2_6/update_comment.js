'use strict'

const Comment = require('../../proxy').Comment;
const type = require('../../type');
const async = require('async');

Comment.count({}, function (err, count) {
  if (err) {
    return console.log('err = ' + err);
  }

  async.timesSeries(count, function (n, next) {
    Comment.find({}, null, {
      skip: n,
      limit: 1,
      sort: {
        date: 1
      }
    }, function (err, comments) {
      if (err) {
        next(err);
      } else {
        let comment = comments[0];
        console.log(comment);
        if (comment.usertype === type.role_user) {
          comment.to_designerid = comment.to_designerid || comment.to;
        } else if (comment.usertype === type.role_designer) {
          comment.to_userid = comment.to_userid || comment.to;
        }
        comment.to = undefined;

        comment.save(function (err) {
          next(err);
        });
      }
    });
  }, function (err) {
    if (err) {
      console.log('complete comment wit err =' + err);
      process.exit();
    } else {
      console.log('complete comment ok');
      process.exit();
    }
  });
});
