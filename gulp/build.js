'use strict'

const gulp = require('gulp');
// const useref = require('gulp-useref');

gulp.task('mobile-build', function () {
  return gulp.src(['./web/mobile-new/res/**/*'])
    .pipe()
});
// gulp.task('mobile-build', ['connect', 'watch-proxy', 'css', 'watch-css']);
