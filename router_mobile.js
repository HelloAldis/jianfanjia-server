var express = require('express');
var config = require('./apiconfig');
var dec_strategy = require('./controllers/dec_strategy');
var share = require('./controllers/share');

var router = express.Router();

// home page
// router.get('/', site.index);
router.get('/view/article/detail.html', dec_strategy.dec_strategy_homepage);
router.get('/view/share/process.html', share.share_process_homepage);

module.exports = router;
