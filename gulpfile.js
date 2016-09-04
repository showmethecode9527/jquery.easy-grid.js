var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync');

var prefixerOptions = {
    browser: ['last 2 version', 'Android >= 4.0']
};

gulp.task('sass', function () {
    gulp.src('scss/*.scss')
        .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(autoprefixer(prefixerOptions))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('css/'));
});

gulp.task('w', function () {
    gulp.watch('scss/*.scss', ['sass']);
});

gulp.task('bs', function () {
    browserSync({
        files: ['css/**', 'demo/**'],
        server: {
            directory: true,
            baseDir: '.'
        },
        port: 7777,
        browser: 'firefox',
        // 延迟刷新, 默认0
        reloadDelay: 1,
        // 是否载入css修改, 默认为true
        injectChanges: true
    });
});

gulp.task('default', ['w', 'bs']);