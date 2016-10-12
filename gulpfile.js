var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();



gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    },
  })
});

gulp.task('sass', function(){
  return gulp.src('build/**/*.css')
    .pipe(sass()) 
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


gulp.task('watch', ['browserSync'], function (){
  gulp.watch('build/**/*.css', ['sass']); 
  gulp.watch('build/**/*.html', browserSync.reload); 
  gulp.watch('js/**/*.js', browserSync.reload); 
});