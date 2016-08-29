'use strict'

const express = require('express');
const response_util = require('lib/middlewares/response_util');

const dec_strategy = require('lib/controllers/dec_strategy');
const wechat = require('lib/controllers/wechat');

const share = require('lib/controllers/mobile/share');
const diary_book = require('lib/controllers/mobile/diary_book');
const quotation = require('lib/controllers/mobile/quotation');

const router = express.Router();

// home page
// router.get('/', site.index);
router.get('/tpl/article/strategy/:_id', response_util, dec_strategy.dec_strategy_homepage);
router.get('/view/share/process.html', response_util, share.share_process_homepage);
router.get('/tpl/diary/book/:diarySetid', response_util, diary_book.diary_book_page);
router.get('/wechat_index', response_util, wechat.wechat_index);
router.get('/quotation/:quotationid', response_util, quotation.quotation);

module.exports = router;
