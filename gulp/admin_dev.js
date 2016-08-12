'use strict'
/**

gulp devu  启动pc开发网站 http://localhost:9000
gulp deva  启动admin开发网站 http://localhost:9001
gulp devm  启动移动端开发网站 http://localhost:9002

*/

const gulp = require('gulp');
const util = require('./util');

const admin_web_port = 9001;
const admin_web_root = './web/admin-new/res';

gulp.task('admin-connect', function () { //配置代理
  util.proxy(admin_web_root, admin_web_port);
});

gulp.task('admin-reload', function () { //监听变化
  return util.reload(admin_web_root);
});

gulp.task('deva', ['admin-connect', 'admin-reload', 'css', 'watch-css']);
