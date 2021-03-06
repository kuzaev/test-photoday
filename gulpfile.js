const gulp = require("gulp");
const less = require("gulp-less");
const browserSync = require("browser-sync").create();
const imagemin = require("gulp-imagemin");
const autoprefixer = require("gulp-autoprefixer");

const src_folder = "./src/";
const src_assets_folder = "./src/assets/";
const dist_folder = "./dist/";
const dist_assets_folder = "./dist/assets/";

gulp.task("html", () => {
  return gulp
    .src([src_folder + "**/*.html"], {
      base: src_folder,
      since: gulp.lastRun("html"),
    })
    .pipe(gulp.dest(dist_folder))
    .pipe(browserSync.stream());
});

gulp.task("less", () => {
  return gulp
    .src([src_assets_folder + "less/**/*.less"], {
      since: gulp.lastRun("less"),
    })
    .pipe(less())
    .pipe(
      autoprefixer({
        browsers: ["last 4 versions"],
      })
    )
    .pipe(gulp.dest(dist_assets_folder + "css"))
    .pipe(browserSync.stream());
});

gulp.task("images", () => {
  return gulp
    .src([src_assets_folder + "images/**/*.+(png|jpg|jpeg|gif|svg|ico)"], {
      since: gulp.lastRun("images"),
    })
    .pipe(imagemin())
    .pipe(gulp.dest(dist_assets_folder + "images"))
    .pipe(browserSync.stream());
});

gulp.task("serve", () => {
  return browserSync.init({
    server: {
      baseDir: ["dist"],
    },
    port: 3000,
    open: false,
  });
});

gulp.task("watch", () => {
  const watchImages = [
    src_assets_folder + "images/**/*.+(png|jpg|jpeg|gif|svg|ico)",
  ];
  const watch = [src_folder + "**/*.html", src_assets_folder + "**/*.less"];
  gulp.watch(watch, gulp.series("build")).on("change", browserSync.reload);
  gulp
    .watch(watchImages, gulp.series("images"))
    .on("change", browserSync.reload);
});

gulp.task("build", gulp.series("html", "less", "images"));

gulp.task("default", gulp.series("build", gulp.parallel("serve", "watch")));
