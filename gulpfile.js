var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
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
            .pipe(rename({suffix: '.min'}))
            .pipe(cssmin())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('css/'));
});

gulp.task('w-sass', function () {
    gulp.watch('scss/*.scss', ['sass']);
});

gulp.task('js', function () {
    gulp.src('jquery.easy-grid.js')
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('.'));
});

gulp.task('w-js', function () {
    gulp.watch('jquery.easy-grid.js', ['js']);
});

gulp.task('bs', function () {
    browserSync({
        files: ['css/**', 'demo/**', 'jquery.easy-grid.js'],
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

gulp.task('default', ['bs', 'w-sass', 'w-js']);