/**
 * Project : scanit
 * File : gulpfile
 * Date : 06/20/2015
 * Author : Vincent Loy <vincent.loy1@gmail.com>
 */

/*jslint indent: 4, maxlen: 100, node: true, vars: true, nomen: true */

(function () {
    'use strict';

    var gulp = require('gulp'),
        gutil = require('gulp-util'),
        less = require('gulp-less'),
        minifyCSS = require('gulp-minify-css'),
        plumber = require('gulp-plumber'),
        concat = require('gulp-concat'),
        uglify = require('gulp-uglify'),
        rename = require('gulp-rename'),
        targetCSSDir = 'css',
        targetLESSDir = targetCSSDir + '/less',
        devJSDir = 'dev',
        jsQrCodePath = devJSDir + '/vendor/qrcode.min.js',
        distJSDir = 'dist';


    // Compile Less
    // and save to target CSS directory
    gulp.task('css', function () {
        return gulp.src(targetLESSDir + '/demo.less')
            .pipe(plumber())
            .pipe(less({style: 'compressed'})
                .on('error', gutil.log))
            .pipe(minifyCSS({compatibility: 'ie8'}))
            .pipe(gulp.dest(targetCSSDir));
    });

    gulp.task('compress', function () {
        return gulp.src([jsQrCodePath, devJSDir + '/scanit.js'])
            .pipe(concat('/scanit.js'))
            .pipe(uglify({
                preserveComments: 'some'
            }))
            .pipe(rename({
                extname: '.min.js'
            }))
            .pipe(gulp.dest(distJSDir));
    });

    // Keep an eye on Less
    gulp.task('watch', function () {
        gulp.watch(targetLESSDir + '/**/*.less', ['css']);
    });

    // What tasks does running gulp trigger?
    gulp.task('default', ['css', 'watch']);

    //To uglify the new version of simplyCountdown run : gulp release or gulp compress
    gulp.task('release', ['compress']);
}());
