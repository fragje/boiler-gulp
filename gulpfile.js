// TODO: Compress images
// TODO: Uglify javascript
// TODO: Add optional legacy support and png fallback to icons with svg4everybody
// TODO: Add optional task for swig (prototyping with twig)

// Import node packages
var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var cssPrefix   = require('gulp-autoprefixer');
var del         = require('del');
var plumber     = require('gulp-plumber');
var styledown   = require('gulp-styledown');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var rename = require('gulp-rename');
var svg2png = require('gulp-svg2png');

// Input and output path
var path = {
    root: './',
    dest: './dist/',
    src: './src/',
    npm: './node_modules/'
}

//
// Tasks
//

// Delete destination folder
gulp.task('clean', function() {
    del([ path.dest ], function (err) {
        console.log('Files deleted');
    })
});

// Copy misc assets
gulp.task('copy-src-assets', function() {
    gulp.src([
            path.src + 'font/**/*',
            path.src + 'img/**/*'],
            { base: path.src } // base keeps original path
        )
        .pipe(gulp.dest( path.dest ))
        .pipe(browserSync.reload({ stream:true }));
});

// Copy root assets
// gulp.task('copy-root-assets', function() {
//     gulp.src([
//             './CNAME']
//         )
//         .pipe(gulp.dest( path.dest ))
// });

// JavaScript
gulp.task('js', function() {
    return gulp.src([
            path.src + 'js/script.js',
            path.npm + 'svg4everybody/dist/svg4everybody.js'
        ])
        .pipe(gulp.dest(path.dest + 'js'))
        .pipe(browserSync.reload({ stream:true }));
});

// Sass
gulp.task('sass', function () {
    var sassConfig = {
        errLogToConsole: true
    };

    gulp.src(path.src + 'sass/*.scss')
        .pipe(plumber())
        .pipe(sass(sassConfig))
        .pipe(cssPrefix(['last 15 versions', '> 1%', 'ie 8'], { cascade: true }))
        .pipe(gulp.dest(path.dest + 'css'))
        .pipe(browserSync.reload({ stream:true }));
});

// Icons
// SvgStore
gulp.task('icons', function () {
    return gulp
        .src(path.src + 'icons/*.svg')
        .pipe(rename({ prefix: 'icon-' }))
        .pipe(svgmin())
        .pipe(svgstore())
        .pipe(gulp.dest(path.dest + 'icons'));
});

// Styleguide
gulp.task('styleguide', function() {
    gulp.src(path.src + 'styleguide/styleguide.md')
        .pipe(plumber())
        .pipe(styledown({
          config: path.src + 'styleguide/config-styleguide.md',
          filename: 'index.html'
        }))
        .pipe(gulp.dest(path.dest + 'styleguide/'))
        .pipe(browserSync.reload({ stream:true }));
});

// Browser-sync
gulp.task('browser-sync', ['build'], function() {
    browserSync({
        server: {
            baseDir: 'dist'
        }
    });
});

// Watch files
gulp.task('watch', function () {
    // gulp.watch(path.src + 'html/**/*', ['html']);
    gulp.watch(path.src + 'sass/**/*', ['sass']);
    gulp.watch(path.src + 'js/**/*', ['js']);
    gulp.watch(path.src + 'icons/**/*', ['icons']);
    gulp.watch(path.src + 'image/**/*', ['copy-src']);
    gulp.watch(path.src + 'font/**/*', ['copy-src']);
    gulp.watch(path.src + 'styleguide/**/*.md', ['styleguide']);

});

// Base build task
gulp.task('build', ['sass', 'icons', 'copy-src-assets', 'styleguide']);

// Default task
gulp.task('default', ['browser-sync', 'watch']);
