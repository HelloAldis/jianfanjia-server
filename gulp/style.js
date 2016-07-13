'use strict';

var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');

var CSS_PATH = './web/admin-new/res/app/**/*.css';

gulp.task('css', function() {
	gulp.src(CSS_PATH)
		.pipe(concat('app.css'))
		.pipe(gulp.dest('./web/admin-new/res/css'))
});

gulp.task('watch-css', function() {
	gulp.watch(CSS_PATH, ['css']);
});
