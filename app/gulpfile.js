var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var watch = require('gulp-watch');
var rimraf = require('gulp-rimraf');
var cleanhtml = require('gulp-cleanhtml');
var replace = require('gulp-replace');

var exec = require('child_process').exec;


var paths = {
    dist: "../api/dist/",
    scripts: ['js/**/*.js'],
    scriptsMap: ['lib/jquery/dist/jquery.min.map', 'lib/angular-route/angular-route.min.js.map', 'lib/angular/angular.min.js.map'],
    index: ['index.html'],
    partials: ['partials/**/*.html'],
    fonts: ['fonts/**/*.*'],
    img: ['img/**/*.*'],
    template: ['template/**/*.html'],
    css: ['css/**/*.css', 'css/**/*.map'],
    json_ukraine: ['img/ukraine.json'],
    angular: ['lib/angular/angular.min.js'],
    imageJs: ['custom-js/jquery.fancybox.pack.js'],
    fancybox: ['css/**/*.gif', 'css/**/*.png'],
    uploadFile: ['lib/ng-file-upload/angular-file-upload-shim.min.js', 'lib/ng-file-upload/angular-file-upload.min.js'],
    jquery: ['lib/jquery/dist/jquery.min.js'],
    bootstrap: ['lib/bootstrap/dist/js/bootstrap.min.js'],
    angular_bootstrap: ['lib/angular-bootstrap/ui-bootstrap.min.js', 'lib/angular-bootstrap/ui-bootstrap-tpls.min.js'],
    angular_route: ['lib/angular-route/angular-route.min.js'],
    angular_scroll: ['lib/angular-scroll/angular-scroll.min.js', 'lib/angular-scroll/angular-scroll.min.js.map'],
    topojson: ['lib/topojson/topojson.js'],
    d3js: ['custom-js/d3.min.js'],
    font_awesome: ['lib/font-awesome/css/font-awesome.min.css'],
    font_awesome_font: ['lib/font-awesome/fonts/*.*']
};

// with watchers
gulp.task('scriptsWatch', function () {
    watch({ glob: paths.scripts }, function () {
        return gulp.src(paths.scripts)
            .pipe(concat('app.js'))
            .pipe(gulp.dest(paths.dist + 'js'));
    });
});
gulp.task('IndexWatch', function () {
    watch({ glob: paths.index }, function () {
        return gulp.src(paths.index)
            .pipe(gulp.dest(paths.dist));
    });
});

gulp.task('partialsWatch', function () {
    watch({glob: paths.partials}, function (files) {
        return files.pipe(gulp.dest(paths.dist + 'partials'));
    });
});

gulp.task('cssWatch', function () {
    watch({glob: paths.css}, function (files) {
        return files.pipe(gulp.dest(paths.dist + 'css'));
    });
});


// for build
gulp.task('clean-dist', function (cb) {
    rimraf(paths.dist, cb);
});

gulp.task('scripts', function () {
    return gulp.src(paths.scripts)
        .pipe(concat('app.js'))
        .pipe(gulp.dest(paths.dist + 'js'));
});
gulp.task('partials', function () {
    return gulp.src(paths.partials)
        .pipe(cleanhtml())
        .pipe(gulp.dest(paths.dist + 'partials'));
});
gulp.task('index', function () {
    return gulp.src(paths.index)
        .pipe(cleanhtml())
        .pipe(gulp.dest(paths.dist));
});
gulp.task('libs', function () {
    return gulp.src(paths.angular.concat(paths.topojson, paths.d3js, paths.angular_scroll, paths.jquery, paths.angular_route, paths.bootstrap, paths.uploadFile, paths.scriptsMap, paths.imageJs, paths.angular_bootstrap))
        .pipe(gulp.dest(paths.dist + 'js'));
});

gulp.task('template', function () {
    return gulp.src(paths.template)
        .pipe(gulp.dest(paths.dist + 'template'));
});

gulp.task('css', function () {
    return gulp.src(paths.css.concat(paths.font_awesome))
        .pipe(gulp.dest(paths.dist + 'css'));
});
gulp.task('fonts', function () {
    return gulp.src(paths.fonts.concat(paths.font_awesome_font))
        .pipe(gulp.dest(paths.dist + 'fonts'));
});
gulp.task('img', function () {
    return gulp.src(paths.img)
        .pipe(gulp.dest(paths.dist + 'img'));
});
gulp.task('ukraine-json', function () {
    return gulp.src(paths.json_ukraine)
        .pipe(gulp.dest(paths.dist + 'img'));
});

gulp.task('fancybox', function () {
    return gulp.src(paths.fancybox)
        .pipe(gulp.dest(paths.dist + 'css'));
});

gulp.task('deploy', function () {
    return gulp.src('dist/**/*.*')
        .pipe(gulp.dest('../api/dist'));
});

gulp.task('build-dist', ['scripts', 'libs', 'index', 'partials', 'template', 'css', 'fonts', 'img', 'fancybox', 'ukraine-json']);
gulp.task('watch', ['build-dist', 'scriptsWatch', 'partialsWatch', 'IndexWatch', 'cssWatch']);

gulp.task('default', ['clean-dist'], function (cb) {
    exec('gulp build-dist', function (err) {
        if (err) return cb(err);
        cb();
    });
});