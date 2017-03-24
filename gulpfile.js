
var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var sass = require("gulp-sass");
var pug = require("gulp-pug");
var concat = require("gulp-concat");
var autoprefixer = require("gulp-autoprefixer");
var sourcemaps = require("gulp-sourcemaps");
var cleanCSS = require("gulp-clean-css");
var uglify = require("gulp-uglify");
var pump = require("pump");
var uncss = require("gulp-uncss");
var combineMq = require("gulp-combine-mq");
var imagemin = require("gulp-imagemin");
var cache = require("gulp-cache");
var tinify = require("gulp-tinify");
var runSequence = require("run-sequence");



gulp.task("browserSync", function() {

	browserSync.init({
		server: {
			baseDir: "dist"
		},
	})

})

gulp.task("sass", function() {

	return gulp.src("build/style/**/*.+(scss|sass)")

		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(sourcemaps.write("/"))
		.pipe(gulp.dest("dist/style"))

});

gulp.task("reloadStyles", function(callback) {

	runSequence("sass", "pug", "reload", callback);
	// pug is ran to include above the fold css in headers

});

// Sourcemap Mapping Sample
// ------------------------
// http://localhost:3000/source/
// /build/style/

gulp.task("pug", function() {

	return gulp.src("build/*.pug")

		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest("dist"))
		.pipe(browserSync.reload({
			stream: true
		}))

});

gulp.task("concat", function() {

	return gulp.src("build/script/*.js")

		.pipe(concat("main.js"))
		.pipe(gulp.dest("dist/script"))
		.pipe(browserSync.reload({
			stream: true
		}))

});

gulp.task("compress", function() {

	return gulp.src("build/*.pug")

		.pipe(pug())
		.pipe(gulp.dest("dist"))

});

gulp.task("uglify", function(cb) {

	pump([
		gulp.src("dist/script/*.js"),
		uglify(),
		gulp.dest("dist/script/")
	],
		cb
	);

});

gulp.task("combine", function () {

	return gulp.src("dist/style/*.css")

		.pipe(combineMq({
			beautify: true
		}))

		.pipe(gulp.dest("dist/style/"));

});

gulp.task('uncss', function() {

	return gulp.src("dist/style/*.css")

		.pipe(uncss({
			html: ["dist/*.html"]
		}))
		.pipe(gulp.dest("dist/style/"));

});

gulp.task("minify", function() {

	return gulp.src("dist/style/*.css")

		.pipe(cleanCSS())
		.pipe(gulp.dest("dist/style/"))

});

gulp.task("optimise", function() {

	return gulp.src("dist/img/**/*.+(png|jpg|jpeg|gif)")

	// Caching images that ran through imagemin

	.pipe(cache(imagemin({
		interlaced: true
	})))

	.pipe(gulp.dest("dist/img/"))

});

gulp.task("tinify", function() {

	return gulp.src("dist/img/**/*.+(png|jpg|jpeg)")

	.pipe(cache(tinify("87P5426kKBE9JTn3dUXTvvF7o5-eoSzF")))
	.pipe(gulp.dest("dist/img/"))

});

gulp.task("reload", function (){

	browserSync.reload();

});










gulp.task("default", ["build"], function() {

	gulp.watch("build/**/*.pug", ["pug"]);
	gulp.watch("build/style/**/*.+(scss|sass)", ["reloadStyles"]);
	gulp.watch("build/script/**/*.js", ["concat"]);

});

gulp.task("build", function(callback) {

	runSequence(["pug", "sass", "concat"], "browserSync", callback);

});