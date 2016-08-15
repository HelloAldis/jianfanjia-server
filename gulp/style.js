'use strict';

const gulp = require('gulp');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const csswring = require('csswring');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');

var CSS_PATH = './web/admin-new/res/app/**/*.css';

gulp.task('css', function () {
  var processors = [
    autoprefixer({
      browsers: '> 5%'
    }), mqpacker, csswring
  ];

  return gulp.src(CSS_PATH)
    .pipe(concat('app.css'))
    .pipe(postcss(processors))
    .pipe(gulp.dest('./web/admin-new/res/css'))
});

gulp.task('watch-css', function () {
  gulp.watch(CSS_PATH, ['css']);
});
