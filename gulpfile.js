
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
			baseDir: "output"
		},
	})

})

gulp.task("sass", function() {

	return gulp.src("input/style/**/*.+(scss|sass)")

		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(sourcemaps.write("/"))
		.pipe(gulp.dest("output/style"))
		.pipe(browserSync.reload({
			stream: true
		}))

});

// Sourcemap Mapping Sample
// ------------------------
// http://localhost:3000/source/
// /input/style/

gulp.task("pug", function() {

	return gulp.src("input/*.pug")

		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest("output"))
		.pipe(browserSync.reload({
			stream: true
		}))

});

gulp.task("compress", function() {

	return gulp.src("input/*.pug")

		.pipe(pug())
		.pipe(gulp.dest("output"))

});

gulp.task("concat", function() {

	return gulp.src("input/script/*.js")

		.pipe(concat("main.js"))
		.pipe(gulp.dest("output/script"))
		.pipe(browserSync.reload({
			stream: true
		}))

});

gulp.task("uglify", function(cb) {

	pump([
		gulp.src("output/script/*.js"),
		uglify(),
		gulp.dest("output/script/")
	],
		cb
	);

});

gulp.task("combine", function () {

	return gulp.src("output/style/*.css")

		.pipe(combineMq({
			beautify: true
		}))

		.pipe(gulp.dest("output/style/"));

});

gulp.task('uncss', function() {

	return gulp.src("output/style/*.css")

		.pipe(uncss({
			html: ["output/*.html"]
		}))
		.pipe(gulp.dest("output/style/"));

});

gulp.task("minify", function() {

	return gulp.src("output/style/*.css")

		.pipe(cleanCSS())
		.pipe(gulp.dest("output/style/"))

});

gulp.task("optimise", function(){

	return gulp.src("output/img/**/*.+(png|jpg|jpeg|gif)")

	// Caching images that ran through imagemin

	.pipe(cache(imagemin({
		interlaced: true
	})))

	.pipe(gulp.dest("output/img/"))

});

gulp.task("tinify", function(){

	return gulp.src("output/img/**/*.+(png|jpg|jpeg)")

	.pipe(cache(tinify("87P5426kKBE9JTn3dUXTvvF7o5-eoSzF")))
	.pipe(gulp.dest("output/img/"))

});





gulp.task("final", function(callback) {

	runSequence("uncss", "combine", "minify", ["compress", "uglify"], callback);

});

gulp.task("go", ["browserSync", "pug", "sass", "concat"], function(){

	gulp.watch("input/**/*.pug", ["pug"]);
	gulp.watch("input/style/**/*.+(scss|sass)", ["sass"]);
	gulp.watch("input/script/**/*.js", ["concat"]); 

});