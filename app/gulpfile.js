/////////////////////////////////////
// Required 
/////////////////////////////////////

var gulp = require('gulp'),
        sass = require('gulp-ruby-sass'),
        autoprefixer = require('gulp-autoprefixer'),
        minifycss = require('gulp-minify-css'),
        rename = require('gulp-rename');
        compass = require('gulp-compass');
        concat = require('gulp-concat');
        uglify = require('gulp-uglify');
        imagemin = require('gulp-imagemin');

gulp.task('express', function() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')({port: 35729}));
  app.use(express.static(__dirname));
  app.listen(4000, '0.0.0.0');
});

var tinylr;
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
    tinylr.listen(35729);
});

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

gulp.task('styles', function() {
  //return sass('sass', { style: 'expanded' })
  return gulp.src(['sass/*.scss'])
    .pipe(compass({
    	config_file: 'config.rb',
      css: 'css',
      sass: 'sass',
      image: 'images',
      js: 'js'
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(gulp.dest('css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'))
    .pipe(gulp.dest('css'))
});

gulp.task('scripts', function() {
  gulp.src(['scripts/*.js'])
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js/'))
    .pipe(gulp.dest('dist/js/'))
});

gulp.task('images', function(){
  return gulp.src('images/**/*.+(png|jpg|gif|svg)')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
  gulp.src(['fonts/**/*.+(eot|woff|ttf|svg|woff2)'])
    .pipe(gulp.dest('dist/fonts/'))
});

gulp.task('htmls', function() {
  gulp.src(['*.html'])
    .pipe(gulp.dest('dist/'))
});

gulp.task('watch', function() {
  gulp.watch('sass/*.scss', ['styles']);
  gulp.watch('*.html', notifyLiveReload);
  gulp.watch('css/*.css', notifyLiveReload);
  gulp.watch('js/*.js', notifyLiveReload);
  gulp.watch('scripts/*.js', ['scripts']);
});

gulp.task('default', ['styles', 'scripts', 'images' , 'express', 'livereload', 'watch', 'fonts', 'htmls'], function() {

});