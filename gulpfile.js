/* import gulp-module */
var gulp       = require('gulp'),
	webserver  = require('gulp-webserver'),
	concat     = require('gulp-concat'),
	concatcss  = require('gulp-concat-css');
	jshint     = require('gulp-jshint'),
	rename     = require('gulp-rename'),
	uglify     = require('gulp-uglify'),
	uglifycss  = require('gulp-uglifycss'),
	minifyhtml = require('gulp-minify-html'),
	imagemin   = require('gulp-imagemin'),
	pngquant   = require('imagemin-pngquant'),
	gulpif     = require('gulp-if'),
	livereload = require('gulp-livereload'),
	del        = require('del'),
	config     = require('./config.json');

/* default [ clean, script, style, watch ] */
gulp.task('default',['server', 'scripts', 'html', 'styles', 'images', 'watch']);

/* server */
gulp.task('server',function(){
	gulp.src(config.path.dist) 
		.pipe(webserver(config.path.dist));
});

/* clean [ html, js, css, images ] */
gulp.task('clean',function(){
	del([
		config.path.html.dest+'*',
		config.path.css.dest+'*',
		config.path.js.dest.app+'*',
		config.path.js.dest.controller+'*',
		config.path.js.dest.libs+'*',
		config.path.js.dest.util+'*',
		config.path.js.dest.ui+'*',
		config.path.js.dest.tmpl+'*',
		config.path.js.dest.asset+'*',
		config.path.images.dest+'*'
	]);
});

/* script [ jshint, uglify, rename ] */
gulp.task('scripts',['js:uglify-app', 'js:uglify-controller', 'js:uglify-libs', 'js:uglify-template', 'js:uglify-util', 'js:uglify-ui', 'js:uglify-asset']);

gulp.task('js:uglify-app',function(){
	gulp.src(config.path.js.src.app)
		.pipe(gulpif(config.lint.scripts.app, jshint()))
		.pipe(gulpif(config.lint.scripts.app, jshint.reporter('jshint-stylish')))
		.pipe(gulpif(config.uglify.scripts, uglify(config.uglify_option)))
		.pipe(gulpif(config.rename.scripts, rename(config.rename_option)))
		.pipe(gulp.dest(config.path.js.dest.app));
});

gulp.task('js:uglify-controller',function(){
	gulp.src(config.path.js.src.controller)
		.pipe(gulpif(config.lint.scripts.controller, jshint()))
		.pipe(gulpif(config.lint.scripts.controller, jshint.reporter('jshint-stylish')))
		.pipe(gulpif(config.uglify.scripts, uglify(config.uglify_option)))
		.pipe(gulpif(config.rename.scripts, rename(config.rename_option)))
		.pipe(gulp.dest(config.path.js.dest.controller));
});

gulp.task('js:uglify-libs',function(){
	gulp.src(config.path.js.src.libs)
		.pipe(gulpif(config.lint.scripts.libs, jshint()))
		.pipe(gulpif(config.lint.scripts.libs, jshint.reporter('jshint-stylish')))
		.pipe(gulpif(config.uglify.scripts.libs, uglify(config.uglify_option)))
		.pipe(gulpif(config.rename.scripts.libs, rename(config.rename_option)))
		.pipe(gulp.dest(config.path.js.dest.libs));
});

gulp.task('js:uglify-template',function(){
	gulp.src(config.path.js.src.template)
		.pipe(gulpif(config.lint.scripts.template, jshint()))
		.pipe(gulpif(config.lint.scripts.template, jshint.reporter('jshint-stylish')))
		.pipe(gulpif(config.uglify.scripts.template, uglify(config.uglify_option)))
		.pipe(gulpif(config.rename.scripts.template, rename(config.rename_option)))
		.pipe(gulp.dest(config.path.js.dest.template));
});

gulp.task('js:uglify-util',function(){
	gulp.src(config.path.js.src.util)
		.pipe(gulpif(config.lint.scripts.util, jshint()))
		.pipe(gulpif(config.lint.scripts.util, jshint.reporter('jshint-stylish')))
		.pipe(gulpif(config.uglify.scripts.util, uglify(config.uglify_option)))
		.pipe(gulpif(config.rename.scripts.util, rename(config.rename_option)))
		.pipe(gulp.dest(config.path.js.dest.util));
});

gulp.task('js:uglify-ui',function(){
	gulp.src(config.path.js.src.ui)
		.pipe(gulpif(config.lint.scripts.ui, jshint()))
		.pipe(gulpif(config.lint.scripts.ui, jshint.reporter('jshint-stylish')))
		.pipe(gulpif(config.uglify.scripts.ui, uglify(config.uglify_option)))
		.pipe(gulpif(config.rename.scripts.ui, rename(config.rename_option)))
		.pipe(gulp.dest(config.path.js.dest.ui));
});

gulp.task('js:uglify-asset',function(){
	gulp.src(config.path.js.src.asset)
		.pipe(gulpif(config.lint.scripts.asset, jshint()))
		.pipe(gulpif(config.lint.scripts.asset, jshint.reporter('jshint-stylish')))
		.pipe(gulpif(config.uglify.scripts.asset, uglify(config.uglify_option)))
		.pipe(gulpif(config.rename.scripts.asset, rename(config.rename_option)))
		.pipe(gulp.dest(config.path.js.dest.asset));
});


/* html [ minify, rename ] */
gulp.task('html',function(){
	gulp.src(config.path.html.src)
		.pipe(gulpif(config.uglify.html, minifyhtml()))
		.pipe(gulpif(config.rename.html, rename(config.rename_option)))
		.pipe(gulp.dest(config.path.html.dest));
});

/* style [ concat, uglify, rename ] */
gulp.task('styles',function(){
	gulp.src(config.path.css.src)
		.pipe(gulpif(config.concat.styles, concatcss(config.path.css.result)))
		.pipe(gulpif(config.uglify.styles, uglifycss()))
		.pipe(gulpif(config.rename.styles, rename(config.rename_option)))
		.pipe(gulp.dest(config.path.css.dest));
});

/* images */
gulp.task('images',function(){
	gulp.src(config.path.images.src)
		.pipe(imagemin({
			progressive:true,
			svgoPlugins:[{removeViewBox:false}],
			use:[pngquant()]
		}))
		.pipe(gulp.dest(config.path.images.dest));
});

/* livereload */
gulp.task('watch',function(){
	livereload.listen();
	gulp.watch(config.path.js.src.app,['js:uglify-app']);
	gulp.watch(config.path.js.src.asset,['js:uglify-asset']);
	gulp.watch(config.path.js.src.controller,['js:uglify-controller']);
	gulp.watch(config.path.js.src.libs,['js:uglify-libs']);
	gulp.watch(config.path.js.src.template,['js:uglify-template']);
	gulp.watch(config.path.js.src.util,['js:uglify-util']);
	gulp.watch(config.path.js.src.ui,['js:uglify-ui']);
	gulp.watch(config.path.css.src,['styles']);
	gulp.watch(config.path.html.src,['html']);
	gulp.watch(config.path.images.src,['images']);
	gulp.watch(config.path.dist+'**').on('change',livereload.changed);
});