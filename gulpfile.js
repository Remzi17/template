import gulp from "gulp";
const { series, parallel } = gulp;

import del from "del";
import browsersync from "browser-sync";
import cache from "gulp-cached";
import remember from "gulp-remember";
import fs from "fs";
import path from "path";

import { paths, isDeploy } from "./gulp/settings.js";
import { html } from "./gulp/html.js";
import { css, cssLibs } from "./gulp/css.js";
import { images } from "./gulp/images.js";
import { fonts, fontcss } from "./gulp/fonts.js";
import { deployHtml, deployCss, deployJs } from "./gulp/ftp.js";
import { svg } from "./gulp/svg.js";
import { jsLibs, rollup } from "./gulp/js.js";
import { temp } from "./gulp/functions.js";

// ====================
// 📊 Статистика
// ====================
import { startSession, endSession, trackFile, buildStartTimer, buildEndTimer, showStats } from "./gulp/statistics/statistics.js";

// ====================
// 🔄 Reload
// ====================
function reload(done) {
  browsersync.reload();
  done();
}

// ====================
// 👀 Watch
// ====================
function watchFiles() {
  const onChange = (filePath) => {
    if (filePath) trackFile(filePath);
  };

  if (isDeploy) {
    gulp.watch(paths.watch.html, series(html, deployHtml)).on("change", onChange);
    gulp.watch(paths.watch.css, series(css, deployCss)).on("change", onChange);
    gulp.watch(paths.watch.js, series(rollup, deployJs, reload)).on("change", onChange);
  } else {
    const htmlWatcher = gulp.watch(paths.watch.html, html);
    htmlWatcher.on("change", onChange);
    htmlWatcher.on("unlink", (filePath) => {
      delete cache.caches.html?.[filePath];
      remember.forget("html", filePath);
    });

    gulp.watch(paths.watch.css, css).on("change", onChange);
    gulp.watch(paths.watch.js, series(rollup, reload)).on("change", onChange);
  }

  gulp.watch(paths.watch.cssLibs, cssLibs).on("change", onChange);
  gulp.watch(paths.watch.jsLibs, jsLibs).on("change", onChange);
  gulp.watch(paths.watch.icons, svg).on("change", onChange);
  gulp.watch(paths.watch.img, images).on("change", onChange);
  gulp.watch(paths.watch.fontcss, fontcss).on("change", onChange);
}

// ====================
// 🧹 Clean
// ====================
function clean() {
  return del(paths.clean);
}

// ====================
// 🏗 Build
// ====================
const build = series(startSession, temp, clean, buildStartTimer, rollup, parallel(html, css, cssLibs, jsLibs, svg, images, fonts, fontcss, deployHtml, deployCss, deployJs), buildEndTimer);

// ====================
// 🌐 BrowserSync + Dashboard
// ====================
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: paths.build.html, // например "./dist"
    },
    middleware: [
      (req, res, next) => {
        if (req.url === "/__stats") {
          res.setHeader("Content-Type", "text/html");
          res.end(fs.readFileSync(path.resolve("gulp/statistics/dashboard/index.html")));
          return;
        }

        if (req.url === "/__stats/dashboard.js") {
          res.setHeader("Content-Type", "application/javascript");
          res.end(fs.readFileSync(path.resolve("gulp/statistics/dashboard/dashboard.js")));
          return;
        }

        if (req.url === "/__stats/data") {
          res.setHeader("Content-Type", "application/json");
          res.end(fs.readFileSync(path.resolve("./statistics.json")));
          return;
        }

        next();
      },
    ],
    notify: false,
    open: true,
  });

  done();
}
// ====================
// 👁 Watch + Server
// ====================
export const watch = parallel(build, watchFiles, browserSync);

// ====================
// 📟 CLI команды статистики
// ====================
export const stats = (done) => {
  showStats("all");
  done();
};
export const statsTime = (done) => {
  showStats("time");
  done();
};
export const statsFiles = (done) => {
  showStats("files");
  done();
};
export const statsBuild = (done) => {
  showStats("build");
  done();
};

// ====================
// 🛑 Завершение сессии
// ====================
process.on("SIGINT", () => {
  endSession();
  process.exit();
});
process.on("SIGTERM", () => {
  endSession();
  process.exit();
});

// ====================
export { html, css, cssLibs, rollup, jsLibs, svg, images, fontcss, deployHtml, deployCss, deployJs, build, watch as default };
