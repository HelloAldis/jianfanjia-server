var gulp = require('gulp');
var minimist = require('minimist')
var runSequence = require('run-sequence');
var bump = require('gulp-bump');
var gutil = require('gulp-util');
var git = require('gulp-git');
var fs = require('fs');

gulp.task('default', function () {
  console.log('hello gulp');
});

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

  return gulp.src(['./package.json'])
    .pipe(bump(type).on('error', gutil.log)).pipe(gulp.dest('./'));
});

function getPackageJsonVersion() {
  // 这里我们直接解析 json 文件而不是使用 require，这是因为 require 会缓存多次调用，这会导致版本号不会被更新掉
  return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
};

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
  git.tag(version, 'Created Tag for version: ' + version, function (error) {
    if (error) {
      return cb(error);
    }
    git.push('origin', 'master', {
      args: '--tags'
    }, cb);
  });
});


gulp.task('release', function (callback) {
  runSequence(
    'bump-version',
    'commit-changes',
    // 'push-changes',
    // 'create-new-tag',
    function (error) {
      if (error) {
        console.log(error.message);
      } else {
        console.log('RELEASE FINISHED SUCCESSFULLY');
      }
      callback(error);
    });
});
