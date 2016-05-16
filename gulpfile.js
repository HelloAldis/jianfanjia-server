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
const through2 = require('through2')


// -------------------------------- Common Function ----------------------------------------
function getPackageJsonVersion() {
  // 这里我们直接解析 json 文件而不是使用 require，这是因为 require 会缓存多次调用，这会导致版本号不会被更新掉
  return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
};

function getUpgradeDir(version) {
  let arr = version.split('.');
  arr.pop();
  let end = arr.join('_');

  let b = arr.pop();
  b = parseInt(b) - 1;
  arr.push(b);
  let start = arr.join('_');

  return start + '_to_' + end;
}
// -------------------------------- End Common Function ----------------------------------------

gulp.task('default', function () {
  console.log('please use command "gulp release [-a|-b|-c]" or "gulp deploy [-p|-t|-d] [-n]"');
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
  git.push('origin', 'phase2', cb);
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
        console.log(error.message);
      } else {
        console.log('RELEASE FINISHED SUCCESSFULLY');
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
        console.log(error.message);
      } else {
        console.log('Deploy FINISHED SUCCESSFULLY');
      }
      callback(error);
    });
});

gulp.task('cp-config', function () {
  const argv = minimist(process.argv.slice(3));
  console.log(argv);
  var path = './apiconfig.dev.js';
  if (argv.t) {
    path = './apiconfig.test.js';
  } else if (argv.p) {
    path = './apiconfig.pro.js';
  }

  console.log('cp ' + path + ' to ./apiconfig.js');
  gulp.src(path).pipe(gulp.dest('./apiconfig.js'));
});

gulp.task('upgrade', function () {
  const argv = minimist(process.argv.slice(3));
  const v = getUpgradeDir(getPackageJsonVersion());

  if (!argv.noupgrade) {
    gulp.src('./upgrade_script/' + v + '/*.js').pipe(through2.obj(function (file, enc, cb) {
      console.log('runing script ' + file.path);
      require(file.path)
    }));
  }

});
// -------------------------------- End Deploy Function ----------------------------------------
