var express = require('express');
var config = require('../apiconfig');
var dec_strategy = require('../controllers/dec_strategy');
var share = require('../controllers/share');
var response_util = require('../middlewares/response_util');

var router = express.Router();

// home page
// router.get('/', site.index);
router.get('/tpl/article/strategy/:_id', response_util, dec_strategy.dec_strategy_homepage);
router.get('/view/share/process.html', response_util, share.share_process_homepage);

module.exports = router;
