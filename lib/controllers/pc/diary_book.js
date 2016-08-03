'use strict'

const eventproxy = require('eventproxy');
const pc_web_header = require('lib/business/pc_web_header');
const favorite_business = require('lib/business/favorite_business');
const _ = require('lodash');
const async = require('async');
const ApiUtil = require('lib/common/api_util');
const Diary = require('lib/proxy').Diary;
const DiarySet = require('lib/proxy').DiarySet;
const tools = require('lib/common/tools');
const url = require('url')

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
      }, ep.done(function () {
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
      let para = url.parse(req.url);
      if (para.search) {
        res.redirect(301, '/tpl/diary/book/' + diary.diarySetid + para.search + '&diaryid=' + diary._id);
      } else {
        res.redirect(301, '/tpl/diary/book/' + diary.diarySetid + '?diaryid=' + diary._id);
      }
    } else {
      next();
    }
  }));
}
