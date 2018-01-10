const gulp = require('gulp');
const shell = require('gulp-shell');
const zip = require('gulp-zip');

gulp.task('build-browser',  shell.task('ionic cordova build browser'));

gulp.task('zip-www',['build-browser'], function () {
    console.log('zip');
    return gulp.src('./platforms/browser/www/**')
        .pipe(zip('www.zip'))
        .pipe(gulp.dest('dist'));

});


   
  
   
