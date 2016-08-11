'use strict'

/**
  Release build as command  gulp release (-a|-b|-c)
*/

const gulp = require('gulp');
const minimist = require('minimist')
const runSequence = require('run-sequence');
const bump = require('gulp-bump');
const gutil = require('gulp-util');
const git = require('gulp-git');
const fs = require('fs');
const concat = require('gulp-concat');
const logger = require('../lib/common/logger');

// -------------------------------- Common Function ----------------------------------------
function getPackageJsonVersion() {
  // 这里我们直接解析 json 文件而不是使用 require，这是因为 require 会缓存多次调用，这会导致版本号不会被更新掉
  return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
}

// -------------------------------- End Common Function ----------------------------------------

gulp.task('default', function () {
  logger.info('please use command "gulp release [-a|-b|-c]" or "gulp deploy [-p|-t|-d] [-n]"');
});

gulp.task('code', function () {
  return gulp.src(['api/**/*.js'])
    .pipe(concat('code.txt'))
    .pipe(gulp.dest('./'));
});

// -------------------------------- Release Function ----------------------------------------
gulp.task('bump-version', function () {
  var argv = minimist(process.argv.slice(3));
  var type = {
    type: "patch"
  };
  if (argv.a) {
    type = {
      type: "major"
    };
  } else if (argv.b) {
    type = {
      type: "minor"
    };
  }

  return gulp.src(['./package.json']).pipe(bump(type).on('error', gutil.log)).pipe(gulp.dest('./'));
});

gulp.task('commit-changes', function () {
  return gulp.src('.')
    .pipe(git.commit('[Release] Bumped version number: ' +
      getPackageJsonVersion(), {
        args: '-a'
      }));
});

gulp.task('push-changes', function (cb) {
  git.push('origin', null, cb);
});

gulp.task('create-new-tag', function (cb) {
  var version = getPackageJsonVersion();
  git.tag('build-' + version, 'Created Tag for version: ' + version,
    function (error) {
      if (error) {
        return cb(error);
      }
      git.push('origin', 'build-' + version, cb);
    });
});

gulp.task('release', function (callback) {
  runSequence(
    'bump-version',
    'commit-changes',
    'push-changes',
    'create-new-tag',
    function (error) {
      if (error) {
        logger.info(error.message);
      } else {
        logger.info('RELEASE FINISHED SUCCESSFULLY');
      }
      callback(error);
    });
});
// -------------------------------- End Release Function ----------------------------------------

// -------------------------------- Deploy Function ----------------------------------------
gulp.task('deploy', function (callback) {
  runSequence(
    'cp-config',
    function (error) {
      if (error) {
        logger.info(error.message);
      } else {
        logger.info('Deploy FINISHED SUCCESSFULLY');
      }
      callback(error);
    });
});

gulp.task('cp-config', function () {
  const argv = minimist(process.argv.slice(3));
  logger.info(argv);
  var path = './apiconfig.dev.js';
  if (argv.t) {
    path = './apiconfig.test.js';
  } else if (argv.p) {
    path = './apiconfig.pro.js';
  }

  logger.info('cp ' + path + ' to ./apiconfig.js');
  gulp.src(path).pipe(gulp.dest('./apiconfig.js'));
});

// -------------------------------- End Deploy Function ----------------------------------------
