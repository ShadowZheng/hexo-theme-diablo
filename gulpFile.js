var gulp = require('gulp'),
	browserify = require('gulp-browserify'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	livereload = require('gulp-livereload'),
	scss = require('gulp-sass'),
	autoprefix = require('gulp-autoprefixer'),
	minifyCss = require('gulp-minify-css');

var path = {
	html: 'index.html',
	img: 'img',
	scss: 'scss/**/*.scss',
	js: 'js/**/*.js'
}

// scss task
gulp.task('scss', function() {
	gulp.src('./scss/app.scss')
		.pipe(scss())
		// .pipe(autoprefix('last 2 version'))
		.pipe(minifyCss())
		.pipe(gulp.dest('./dist/css'))
})

// build js
gulp.task('build-js', function() {
	gulp.src('./js/main.js')
		.pipe(browserify({
			transform: ['babelify'],
			insertGlobals: true
		}))
		.pipe(uglify({
			compress: false,
			mangle: true
		}))
		.pipe(gulp.dest('./dist/js'))
})

// browserify task
gulp.task('browserify', function() {
	gulp.src('./js/app.js')
		.pipe(browserify({
			transform: ['babelify'],
			insertGlobals: true
		}))
		.on('error', handleError)
		.pipe(gulp.dest('./dist/js'))
});

// watch task
gulp.task('watch', function() {
	livereload.listen();
	gulp.watch('./dist/js/*.js').on('change', livereload.changed);
	gulp.watch('./dist/css/*.css').on('change', livereload.changed);
	gulp.watch(path.html).on('change', livereload.changed);

	gulp.watch(path.js, ['browserify']);
	gulp.watch(path.scss, ['scss']);
})

gulp.task('default', ['browserify']);

gulp.task('build', ['build-js', 'scss']);

gulp.task('serve', ['browserify', 'watch']);

function handleError(err) {
	console.log(err.toString());
}