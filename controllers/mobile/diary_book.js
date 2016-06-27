'use strict'

const eventproxy = require('eventproxy');
const pc_web_header = require('../../business/pc_web_header');
const favorite_business = require('../../business/favorite_business');
const _ = require('lodash');
const async = require('async');
const type = require('../../type');
const ApiUtil = require('../../common/api_util');
const Diary = require('../../proxy').Diary;
const DiarySet = require('../../proxy').DiarySet;
const User = require('../../proxy').User;
const user_habit_collect = require('../../business/user_habit_collect');
const tools = require('../../common/tools');

exports.diary_book_page = function (req, res, next) {
  const userid = ApiUtil.getUserid(req);
  const usertype = ApiUtil.getUsertype(req);
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
