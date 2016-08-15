'use strict'
/**

gulp devu  启动pc开发网站 http://localhost:9000
gulp deva  启动admin开发网站 http://localhost:9001
gulp devm  启动移动端开发网站 http://localhost:9002

*/

const gulp = require('gulp');
const util = require('./util');
const inject = require('gulp-inject');
const mainBowerFiles = require('main-bower-files');

const admin_web_port = 9001;
const admin_res = './web/admin-new/res';

gulp.task('admin-connect', function () { //配置代理
  util.proxy(admin_res, admin_web_port);
});

gulp.task('admin-reload', function () { //监听变化
  return util.reload(admin_res);
});

gulp.task('admin-inject', function () {
  var injectApp = gulp.src([admin_res + '/app/**/*.module.js', admin_res + '/app/**/*.js', '!' + admin_res + '/app/**/templates.js'], {
    read: false
  });
  var injectAppOption = {
    name: 'app',
    relative: 'true'
  };

  var injectVender = gulp.src(mainBowerFiles({
    paths: admin_res
  }), {
    read: false
  });
  var injectVenderOption = {
    name: 'vender',
    relative: 'true'
  };

  return gulp.src(admin_res + '/*.html')
    .pipe(inject(injectApp, injectAppOption))
    .pipe(inject(injectVender, injectVenderOption))
    .pipe(gulp.dest(admin_res));
});

gulp.task('deva', ['admin-connect', 'admin-reload', 'css', 'watch-css']);
