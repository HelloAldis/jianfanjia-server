'use strict'
/**

gulp dev -p  启动代理pc网站 http://localhost:9000
gulp dev -a  启动代理admin网站 http://localhost:9001
gulp dev -m  启动代理移动端网站 http://localhost:9002

*/

const gulp = require('gulp');
const connect = require('gulp-connect');
const url = require('url');
const watch = require('gulp-watch');
const proxy = require('proxy-middleware');
const minimist = require('minimist');
const sftp = require('gulp-sftp');

const pc_web_port = 9000;
const pc_web_root = './web/user/res';
const pc_ejs_root = './web/user/template';
const admin_web_port = 9001;
const admin_web_root = './web/admin-new/res';
const admin_ejs_root = './web/admin-new/template';
const mobile_web_port = 9002;
const mobile_web_root = './web/mobile/res';
const mobile_ejs_root = './web/mobile/template';

function getRoot(argv) {
  if (argv.m) {
    return mobile_web_root;
  } else if (argv.a) {
    return admin_web_root;
  } else {
    return pc_web_root;
  }
}

function getEjsRoot(argv) {
  if (argv.m) {
    return mobile_ejs_root;
  } else if (argv.a) {
    return admin_ejs_root;
  } else {
    return pc_ejs_root;
  }
}

function getPort(argv) {
  if (argv.m) {
    return mobile_web_port;
  } else if (argv.a) {
    return admin_web_port;
  } else {
    return pc_web_port;
  }
}

gulp.task('connect', function () { //配置代理
  const argv = minimist(process.argv.slice(3));
  const port = getPort(argv);
  const root = getRoot(argv);
  connect.server({
    root: root,
    host: 'localhost',
    port: port,
    livereload: true,
    middleware: function () {
      return [
        ['/api', (function () {
          var options = url.parse('http://dev.jianfanjia.com/api');
          // options.route = '/api';
          options.cookieRewrite = 'dev.jianfanjia.com';
          return proxy(options);
        })()]
      ];
    }
  });
});

gulp.task('reload', function () { //监听变化
  const argv = minimist(process.argv.slice(3));
  const root = getRoot(argv);
  const html = root + '/**/*.html';
  const css = root + '/**/*.css';
  const js = root + '/**/*.js';

  return gulp.src([html, css, js])
    .pipe(watch([html, css, js]))
    .pipe(connect.reload());
});

gulp.task('ejs-sftp', function () {
  const ejsRoot = getEjsRoot(argv);
  const ejs = ejsRoot + '/**/*.ejs';

  return gulp.src([ejs])
    .pipe(watch([ejs]))
    .pipe(sftp({
      host: '101.200.191.159',
      user: 'root',
      pass: 'JfJ2015+|0608~',
      remotePath: '/xvdb/jianfanjia-server/' + ejsRoot
    }));
});

gulp.task('dev', ['connect', 'reload', 'ejs-sftp', 'css', 'watch-css']);
