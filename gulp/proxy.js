'use strict'
/**

gulp proxy -p  启动代理pc网站 http://localhost:9000
gulp proxy -a  启动代理admin网站 http://localhost:9001
gulp proxy -m  启动代理移动端网站 http://localhost:9002

*/

const gulp = require('gulp');
const connect = require('gulp-connect');
const url = require('url');
const watch = require('gulp-watch');
const proxy = require('proxy-middleware');
const modRewrite = require('connect-modrewrite');
const minimist = require('minimist');

//替换js
//<!-- build:js scripts/scripts.js -->
//<script src="scripts/app.js"></script>
//<script src="scripts/controllers/main.js"></script>
//<!-- endbuild -->
const jsRegExp = /(<!--\s*build\:js)([\s\S]*)(endbuild\s*-->)/g;

//替换css
//<!-- build:css css/css.js -->
//<link href="css/css.js"></link>
//<link href="css/controllers/css.js"></link>
//<!-- endbuild -->
const cssRegExp = /(<!--\s*build\:css)([\s\S]*)(endbuild\s*-->)/g


const pc_web_port = 9000;
const pc_web_root = './web/pc/res'
const admin_web_port = 9001;
const admin_web_root = './web/admin-new/res'
const mobile_web_port = 9002;
const mobile_web_root = './web/mobile/res'


function getRoot(argv) {
  if (argv.m) {
    return mobile_web_root;
  } else if (argv.a) {
    return admin_web_root;
  } else {
    return pc_web_root;
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
    middleware: function (connect, opt) {
      return [
        (function () {
          var options = url.parse('http://dev.jianfanjia.com/api');
          options.route = '/api';
          options.cookieRewrite = 'dev.jianfanjia.com';
          return proxy(options);
        })(),
        modRewrite([
          '^/api(.*)$ http://dev.jianfanjia.com/api$1 [P]'
        ])
      ];
    }
  });
});
gulp.task('watch-proxy', function () { //监听变化
  const argv = minimist(process.argv.slice(3));
  const root = getRoot(argv);
  const html = root + '/**/*.html';
  const css = root + '/**/*.css';
  const js = root + '/**/*.js';
  const jpeg = root + '/**/*.jpeg';
  const jpg = root + '/**/*.jpg';
  const png = root + '/**/*.png';

  gulp.src([html, css, js])
    .pipe(watch([html, css, js]))
    .pipe(connect.reload());
});
gulp.task('proxy', ['connect', 'watch-proxy', 'css', 'watch-css']);
