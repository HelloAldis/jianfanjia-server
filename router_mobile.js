var express = require('express');
var config = require('./apiconfig');
var dec_strategy = require('./controllers/dec_strategy');

var router = express.Router();

// home page
// router.get('/', site.index);
router.get('/view/article/detail.html', dec_strategy.dec_strategy_homepage);

module.exports = router;
