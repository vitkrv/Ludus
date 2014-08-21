var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var watch = require('gulp-watch');
var rimraf = require('gulp-rimraf');
var cleanhtml = require('gulp-cleanhtml');
var replace = require('gulp-replace');

var exec = require('child_process').exec;


var paths = {
    scripts: ['js/**/*.js', 'lib/ng-breadcrumbs/dist/ng-breadcrumbs.min.js'],
    index: ['index.html'],
    partials: ['partials/**/*.html'],
    fonts: ['fonts/**/*.*'],
    img: ['img/**/*.*'],
    template: ['template/**/*.html'],
    css: ['css/**/*.css', 'css/**/*.map'],
    angular: ['lib/angular/angular.min.js'],
    jquery: ['lib/jquery/dist/jquery.min.js'],
    bootstrap: ['lib/bootstrap/dist/js/bootstrap.min.js'],
    angular_route: ['lib/angular-route/angular-route.min.js']
};

// with watchers
gulp.task('scriptsWatch', function () {
    watch({ glob: paths.scripts }, function () {
        return gulp.src(paths.scripts)
            .pipe(concat('app.js'))
            .pipe(gulp.dest('dist/js'));
    });
});
gulp.task('IndexWatch', function () {
    watch({ glob: paths.index }, function () {
        return gulp.src(paths.index)
            .pipe(gulp.dest('dist/'));
    });
});

gulp.task('partialsWatch', function () {
    watch({glob: paths.partials}, function (files) {
        return files.pipe(gulp.dest('dist/partials'));
    });
});

gulp.task('cssWatch', function () {
    watch({glob: paths.css}, function (files) {
        return files.pipe(gulp.dest('dist/css'));
    });
});


// for build
gulp.task('clean-dist', function (cb) {
    rimraf('./dist', cb);
});

gulp.task('scripts', function () {
    return gulp.src(paths.scripts)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/js'));
});
gulp.task('partials', function () {
    return gulp.src(paths.partials)
        .pipe(cleanhtml())
        .pipe(gulp.dest('dist/partials'));
});
gulp.task('index', function () {
    return gulp.src(paths.index)
        .pipe(cleanhtml())
        .pipe(gulp.dest('dist'));
});
gulp.task('libs', function () {
    return gulp.src(paths.angular.concat(paths.jquery, paths.angular_route, paths.bootstrap))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('template', function () {
    return gulp.src(paths.template)
        .pipe(gulp.dest('dist/template'));
});

gulp.task('css', function () {
    return gulp.src(paths.css)
        .pipe(gulp.dest('dist/css'));
});
gulp.task('fonts', function () {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest('dist/fonts'));
});
gulp.task('img', function () {
    return gulp.src(paths.img)
        .pipe(gulp.dest('dist/img'));
});

gulp.task('build-dist', ['scripts', 'libs', 'index', 'partials', 'template', 'css', 'fonts', 'img']);
gulp.task('watch', ['build-dist', 'scriptsWatch', 'partialsWatch', 'IndexWatch', 'cssWatch']);

gulp.task('default', ['clean-dist'], function (cb) {
    exec('gulp build-dist', function (err) {
        if (err) return cb(err);
        cb();
    });
});