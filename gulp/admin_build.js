'use strict'

const gulp = require('gulp');
const useref = require('gulp-useref');
const del = require('del');
const runSequence = require('run-sequence');
const inject = require('gulp-inject');
const templateCache = require('gulp-angular-templatecache');
const flatten = require('gulp-flatten');
const mainBowerFiles = require('main-bower-files');
const filter = require('gulp-filter');

const admin_res = 'web/admin-new/res';
const admin_dist = 'web/admin-new/dist';

gulp.task('admin-build', ['admin-clean'], function (callback) {
  runSequence('admin-template', ['admin-html', 'admin-assets', 'admin-fonts'], callback);
});

gulp.task('admin-clean', function () {
  return del(admin_dist);
})

gulp.task('admin-html', function () {
  var injectFile = gulp.src(admin_res + '/app/templates.js', {
    read: false
  });
  var injectOption = {
    name: 'templates',
    relative: 'true'
  };

  return gulp.src(admin_res + '/*.html')
    .pipe(inject(injectFile, injectOption))
    .pipe(useref())
    .pipe(gulp.dest(admin_dist));
});

gulp.task('admin-template', function () {
  return gulp.src(admin_res + '/app/**/*.html')
    .pipe(templateCache({
      module: 'JfjAdmin',
      root: 'app'
    }))
    .pipe(gulp.dest(admin_res + '/app'));
});

gulp.task('admin-assets', function () {
  return gulp.src([admin_res + '/assets/**/*'])
    .pipe(gulp.dest(admin_dist + '/assets'));
});

gulp.task('admin-fonts', function () {
  return gulp.src(mainBowerFiles({
      paths: admin_res
    }))
    .pipe(filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe(flatten())
    .pipe(gulp.dest(admin_dist + '/fonts/'));
});
