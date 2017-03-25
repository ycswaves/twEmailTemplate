var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var inlineCss   = require('gulp-inline-css');
var mustache    = require('gulp-mustache');
var scsslint = require('gulp-scss-lint');
//var templData   = require('./data/staffing.json');
var fs = require('fs');


// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'mustache'], function() {

    browserSync.init({
      server: {
        baseDir: 'output',
        index: 'staffingUpdate.html'
      }
    });

    gulp.watch('templates/*.scss', ['sass','inlineCss']);
    gulp.watch('data/*.json', ['mustache','inlineCss']);
    gulp.watch('templates/*.mustache', ['mustache','inlineCss']);
    gulp.watch('output/*.html').on('change', browserSync.reload);
});

gulp.task('inlineCss', ['sass', 'mustache'], function() {
  return gulp.src('output/*.html')
        .pipe(inlineCss({
          applyLinkTags: true,
          //applyTableAttributes: true,
          removeLinkTags: true,
          removeHtmlSelectors: true
        }))
        .pipe(gulp.dest('output/'));
});


// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src('templates/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('output'));
});

gulp.task('mustache', function() {
  var content = fs.readFileSync('data/staffing.json');
  var templData = JSON.parse(content);
  return gulp.src('templates/*.mustache')
        .pipe(mustache(templData, {extension: '.html'}))
        .pipe(gulp.dest('output/'));
});


gulp.task('scss-lint', function() {
  return gulp.src('./templates/*.scss')
    .pipe(scsslint({
      'config': '.scss-lint.yml',
      //'reporterOutput': 'scssReport.json'
    }));
});

gulp.task('default', ['serve']);
