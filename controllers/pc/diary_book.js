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
    header_info: function (callback) {
      pc_web_header.statistic_info(userid, usertype, callback);
    },
    diarySet: function (callback) {
      DiarySet.findOne({
        _id: diarySetid
      }, null, callback);
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
    },
    top_diary_set: function (callback) {
      DiarySet.find({
        _id: {
          $ne: diarySetid
        },
        cover_imageid: {
          $exists: true
        },
        latest_section_label: {
          $exists: true
        }
      }, null, {
        sort: {
          view_count: -1,
        },
        skip: 0,
        limit: 30,
      }, function (err, diarySets) {
        callback(err, _.sample(diarySets, 5));
      });
    }
  }, ep.done(function (result) {
    if (result.diarySet) {
      async.mapLimit(result.diaries, 3, function (diary, callback) {
        favorite_business.is_favorite_diary(userid, usertype, diary._id, function (err, is_my_favorite) {
          diary.is_my_favorite = is_my_favorite;
          callback(err, diary);
        });
      }, ep.done(function (diaries) {
        res.ejs('page/diary_book', result, req);
      }));

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

exports.go_diary = function (req, res, next) {
  let diaryid = req.params.diaryid

  const ep = eventproxy();
  ep.fail(next);

  if (!tools.isValidObjectId(diaryid)) {
    return next();
  }

  Diary.findOne({
    _id: diaryid
  }, {
    diarySetid: 1,
  }, ep.done(function (diary) {
    if (diary) {
      res.redirect(301, '/tpl/diary/book/' + diary.diarySetid);
    } else {
      next();
    }
  }));
}
