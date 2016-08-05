'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var autoprefixer = require('autoprefixer');
var mqpacker = require('css-mqpacker');
var csswring = require('csswring');
var concat = require('gulp-concat');

var CSS_PATH = './web/admin-new/res/app/**/*.css';

gulp.task('css', function() {
	var processors = [
		autoprefixer({browsers: '> 5%'}),
    mqpacker,
    csswring
	];
	return gulp.src(CSS_PATH)
		.pipe(concat('app.css'))
		.pipe($.postcss(processors))
		.pipe(gulp.dest('./web/admin-new/res/css'))
});

gulp.task('watch-css', function() {
	gulp.watch(CSS_PATH, ['css']);
});
