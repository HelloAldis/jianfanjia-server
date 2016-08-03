'use strict'

const eventproxy = require('eventproxy');
const async = require('async');
const Diary = require('lib/proxy').Diary;
const DiarySet = require('lib/proxy').DiarySet;
const User = require('lib/proxy').User;
const tools = require('lib/common/tools');

exports.diary_book_page = function (req, res, next) {
  const diarySetid = req.params.diarySetid;
  const ep = eventproxy();
  ep.fail(next);

  if (!tools.isValidObjectId(diarySetid)) {
    return next();
  }

  async.parallel({
    diarySet: function (callback) {
      DiarySet.findOne({
        _id: diarySetid
      }, null, function (err, diarySet) {
        if (diarySet) {
          User.findOne({
            _id: diarySet.authorid
          }, {
            username: 1,
            imageid: 1,
          }, function (err, user) {
            if (user) {
              diarySet = diarySet.toObject();
              diarySet.author = user;
              callback(err, diarySet)
            } else {
              callback(err, diarySet)
            }
          });
        } else {
          callback(err, diarySet);
        }
      });
    },
    diaries: function (callback) {
      Diary.find({
        diarySetid: diarySetid
      }, null, {
        sort: {
          create_at: -1
        },
        lean: true
      }, callback);
    }
  }, ep.done(function (result) {
    if (result.diarySet) {
      res.ejs('page/diary_book', result, req);

      DiarySet.incOne({
        _id: diarySetid
      }, {
        view_count: 1
      });
    } else {
      next();
    }
  }));
}
