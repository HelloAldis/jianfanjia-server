var mongoose = require('mongoose');
var config = require('lib/config/apiconfig');
const logger = require('lib/common/logger');

mongoose.connect(config.db, function (err) {
  if (err) {
    logger.info('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
});

// models
require('./user');
require('./designer');
require('./temp_user');
require('./image');
require('./plan');
require('./product');
require('./verify_code');
require('./team');
require('./share');
require('./requirement');
require('./favorite');
require('./process');
require('./reschedule');
require('./api_statistic');
require('./feedback');
require('./comment');
require('./evaluation');
require('./kpi');
require('./dec_strategy');
require('./beautiful_image');
require('./answer');
require('./designer_message');
require('./user_message');
require('./supervisor');
require('./diary');
require('./diary_set');

exports.User = mongoose.model('User');
exports.Designer = mongoose.model('Designer');
exports.TempUser = mongoose.model('TempUser');
exports.Image = mongoose.model('Image');
exports.Plan = mongoose.model('Plan');
exports.Product = mongoose.model('Product');
exports.VerifyCode = mongoose.model('VerifyCode');
exports.Team = mongoose.model('Team');
exports.Requirement = mongoose.model('Requirement');
exports.Share = mongoose.model('Share');
exports.Favorite = mongoose.model('Favorite');
exports.Process = mongoose.model('Process');
exports.Reschedule = mongoose.model('Reschedule');
exports.ApiStatistic = mongoose.model('ApiStatistic');
exports.Feedback = mongoose.model('Feedback');
exports.Comment = mongoose.model('Comment');
exports.Evaluation = mongoose.model('Evaluation');
exports.Kpi = mongoose.model('Kpi');
exports.DecStrategy = mongoose.model('DecStrategy');
exports.BeautifulImage = mongoose.model('BeautifulImage');
exports.Answer = mongoose.model('Answer');
exports.UserMessage = mongoose.model('UserMessage');
exports.DesignerMessage = mongoose.model('DesignerMessage');
exports.Supervisor = mongoose.model('Supervisor');
exports.Diary = mongoose.model('Diary');
exports.DiarySet = mongoose.model('DiarySet');
