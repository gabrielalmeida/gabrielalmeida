var gulp          = require('gulp');
var gutil         = require('gulp-util');
var less          = require('gulp-less');
var autoprefixer  = require('gulp-autoprefixer');
var minifyHTML    = require('gulp-minify-html');
var jade          = require('gulp-jade');
var concat        = require('gulp-concat');
var path          = require('path');
var uglifyJS      = require('gulp-uglify');
var livereload    = require('gulp-livereload');
var tinylr        = require('tiny-lr');
var server        = tinylr();
var nodemon       = require('gulp-nodemon');
var jshint        = require('jshint');
var bower         = require('gulp-bower');
var express       = require('express');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var app           = express();

gulp.task('imagemin', function () {
    return gulp.src('./images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('build/images'));
});
 
gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest('./build/lib/'))
});

gulp.task('jade', function() {

  gulp.src('./*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./build/'))
    .pipe(livereload(server));
});

gulp.task('uglifyJS', function() {

  gulp.src('./js/*.js')
  .pipe(concat('app.js'))
  .pipe(uglifyJS())
  .pipe(gulp.dest('./build/js'))
  .pipe(livereload(server));
});

gulp.task('less', function() {
  gulp.src('./stylesheets/*.less')
  .pipe(less({ compress: true }).on('error', gutil.log))
  .pipe(concat('style.min.css'))
  .pipe(autoprefixer()) 
  .pipe(gulp.dest('./build/stylesheets/'))
  .pipe(livereload(server));
});

gulp.task('minifyHTML', function() {

});

gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint());
});

gulp.task('express', function() {
  nodemon({ 
    script: 'server.js', 
    ext: 'html js', 
    ignore: ['ignored.js'] 
  })
  .on('change', ['lint'])
  .on('restart', function () {
    console.log('Server Restarted!');
  });

});


gulp.task('watch', function() {
  server.listen(35729, function(err) {
    if(err)
      return  console.log(err);

    gulp.watch('./*.jade', ['jade']);
    gulp.watch('./stylesheets/**/*.less', ['less']);
    gulp.watch('./js/*.js', ['uglifyJS']);
  });
});


gulp.task('default', ['imagemin', 'bower', 'jade', 'less', 'uglifyJS', 'minifyHTML', 'express', 'watch']); 
