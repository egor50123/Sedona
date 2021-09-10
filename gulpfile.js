const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const svgstore = require("gulp-svgstore");
const del = require("del");
const WEBP = require("gulp-webp");
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');

// Styles

const css = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(sync.stream());}
exports.css = css;

//image

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel:3}),
    imagemin.mozjpeg({progressive: true}),
    imagemin.svgo()
    ]))
  .pipe(gulp.dest("build/img"))
}
exports.images = images;

//webp

const webp = () => {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(WEBP({quality:90}))
    .pipe(gulp.dest("source/img"))};
exports.webp = webp;

//sprite

const sprite = () => {
  return gulp.src("source/img/**/icon-*.svg")
  .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[style]').removeAttr('style');
      },
      parserOptions: { xmlMode: true }
    }))
  .pipe(replace('&gt;', '>'))
  .pipe(svgstore())
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("source/img"))}
exports.sprite = sprite;

//copy

const copy = () => {
  return gulp.src([
    "source/img/**",
    "source/fonts/**/*.{woff,woff2}",
    "source/js/**",
    "source/*.ico",
    "source/css/**",
    "source/*.html"
    ],{
      base: "source"
    })
  .pipe(gulp.dest("build"));};
exports.copy = copy;

const clean = () => {
  return del("build");
};
exports.clean = clean;

// Server


const server = (done) => {
  sync.init({
    server: {
      baseDir: 'source'
    },
    chrome: '-browser "chrome.exe"',
    cors: true,
    notify: false,
    ui: false,
  });
  done();}
exports.server = server;

gulp.task("build", gulp.series(clean,sprite,css,copy));
gulp.task("sprite", gulp.series(sprite));

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("css"));
  gulp.watch("source/*.html").on("change", sync.reload);
}

exports.start = gulp.series(
  css, server, watcher
);
