/*
 * gulpfile for motion environment development and server
 *
 * edit /node_modules/gulp-less/index.js:68 : replace 'done' with 'then'
 *
 * (c) Uwe Gerdes, entwicklung@uwegerdes.de
 */
'use strict';

var glob = require('glob'),
	gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	jshint = require('gulp-jshint'),
	less = require('gulp-less'),
	lessChanged = require('gulp-less-changed'),
	lesshint = require('gulp-lesshint'),
	notify = require('gulp-notify'),
	uglify = require('gulp-uglify'),
	gutil = require('gulp-util'),
	path = require('path'),
	rename = require('rename'),
	runSequence = require('run-sequence')
	;

var baseDir = __dirname;
var watchFilesFor = {};

/*
 * log only to console, not GUI
 */
var log = notify.withReporter(function (options, callback) {
	callback();
});

/*
 * less files lint and style check
 */
watchFilesFor['less-lint'] = [
	path.join(baseDir, 'less', '**', '*.less')
];
gulp.task('less-lint', function () {
	return gulp.src( watchFilesFor['less-lint'] )
		.pipe(lesshint())  // enforce style guide
		.on('error', function (err) {})
		.pipe(lesshint.reporter())
		;
});

watchFilesFor.less = [
	path.join(baseDir, 'less', '**', '*.less'),
	path.join(baseDir, 'less', 'app.less')
];
gulp.task('less', function () {
	var dest = function(filename) {
		return path.join(path.dirname(path.dirname(filename)), 'css');
	};
	var src = watchFilesFor.less.filter(function(el){return el.indexOf('/**/') == -1; });
	return gulp.src( src )
		.pipe(lessChanged({
			getOutputFileName: function(file) {
				return rename( file, { dirname: dest(file), extname: '.css' } );
			}
		}))
		.pipe(less())
		.on('error', log.onError({ message:  'Error: <%= error.message %>' , title: 'LESS Error'}))
		.pipe(autoprefixer('last 3 version', 'safari 5', 'ie 8', 'ie 9', 'ios 6', 'android 4'))
		.pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
		.pipe(gulp.dest(function(file) { return dest(file.path); }))
		.pipe(log({ message: 'written: <%= file.path %>', title: 'Gulp less' }))
		;
});

/*
 * lint javascript files
 */
watchFilesFor.jshint = [
	path.join(baseDir, 'package.json'),
	path.join(baseDir, '**', '*.js')
];
gulp.task('jshint', function(callback) {
	return gulp.src(watchFilesFor.jshint)
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		;
});

/*
 * run all build tasks
 */
gulp.task('build', function(callback) {
	runSequence('less-lint',
		'less',
		'jshint',
		callback);
});

/*
 * watch task
 */
gulp.task('watch', function() {
	Object.keys(watchFilesFor).forEach(function(task) {
		watchFilesFor[task].forEach(function(filename) {
			glob(filename, function(err, files) {
				if (err) {
					console.log(filename + ' error: ' + JSON.stringify(err, null, 4));
				}
				if (files.length === 0) {
					console.log(filename + ' not found');
				}
			});
		});
		gulp.watch( watchFilesFor[task], [ task ] );
	});
});

/*
 * default task: run all build tasks and watch
 */
gulp.task('default', function(callback) {
	runSequence('build',
		'watch',
		callback);
});

module.exports = {
	gulp: gulp,
	watchFilesFor: watchFilesFor
};
