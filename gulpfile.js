// ====================
// ⏱ Performance metrics
// ====================
const perf = {
  start: Date.now(),
  ready: null,
  lastChange: {
    html: null,
    css: null,
    js: null,
  },
};

const logTime = (label, time) => {
  const ms = time.toFixed(0);
  console.log(`⏱ ${label}: ${ms} ms`);
};

import gulp from "gulp";
const { series, parallel } = gulp;

import del from "del";
import browsersync from "browser-sync";
import cache from "gulp-cached";
import remember from "gulp-remember";
import fs from "fs";
import path from "path";
import { css, cssLibs, cssBlocks, cssComponents, cssCommon } from "./gulp/css.js";

import { paths, isDeploy, isDev, isBuild } from "./gulp/settings.js";

import { html } from "./gulp/html.js";
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

function reload(done) {
  browsersync.reload();
  done();
}

function watchFiles() {
  const onChange = (filePath) => {
    if (!filePath) return;

    if (filePath.endsWith(".html")) perf.lastChange.html = Date.now();
    else if (filePath.match(/\.(sass|scss|css)$/)) perf.lastChange.css = Date.now();
    else if (filePath.endsWith(".js")) perf.lastChange.js = Date.now();
  };

  // HTML
  gulp.watch(paths.watch.html, series(html, measure(html, "html"), reload)).on("change", onChange);

  // JS
  gulp.watch(paths.watch.js, series(rollup, measure(rollup, "js"), reload)).on("change", onChange);

  // =====================
  // ENTRY SASS FILES
  // =====================
  if (!isBuild) {
    gulp.watch(paths.src.sass + "blocks.sass", series(cssBlocks, measure(cssBlocks, "css"), reload)).on("change", onChange);

    gulp.watch(paths.src.sass + "components.sass", series(cssComponents, measure(cssComponents, "css"), reload)).on("change", onChange);

    gulp.watch(paths.src.sass + "common.sass", series(cssCommon, measure(cssCommon, "css"), reload)).on("change", onChange);

    // =====================
    // PARTIALS (blocks/components/common folders)
    // =====================
    gulp.watch(paths.src.sass + "blocks/**/*.sass", series(cssBlocks, measure(cssBlocks, "css"), reload)).on("change", onChange);

    gulp.watch(paths.src.sass + "components/**/*.sass", series(cssComponents, measure(cssComponents, "css"), reload)).on("change", onChange);

    gulp.watch(paths.src.sass + "common/**/*.sass", series(cssCommon, measure(cssCommon, "css"), reload)).on("change", onChange);
  }

  // =====================
  // SHARED FILES (ALL / VARS / MIXINS)
  // =====================
  const sharedSass = [paths.src.sass + "all/**/*.sass", paths.src.sass + "_*.sass"];

  gulp.watch(sharedSass, series(isBuild ? css : parallel(cssCommon, cssComponents, cssBlocks), reload)).on("change", onChange);

  // =====================
  // Остальное
  // =====================
  gulp.watch(paths.watch.cssLibs, series(cssLibs, reload));
  gulp.watch(paths.watch.jsLibs, series(jsLibs, reload));
  gulp.watch(paths.watch.icons, series(svg, reload));
  gulp.watch(paths.watch.img, series(images, reload));
  gulp.watch(paths.watch.fontcss, series(fontcss, reload));
}

// ====================
// 🧹 Clean
// ====================
function clean() {
  return del(paths.clean);
}

// ====================
// 🌐 BrowserSync + Dashboard
// ====================
function browserSync(done) {
  browsersync.init(
    {
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
    },
    () => {
      perf.ready = Date.now();
      logTime("Gulp start → BrowserSync ready", perf.ready - perf.start);
    }
  );

  done();
}
function measure(task, type) {
  return function measuredTask(done) {
    const start = perf.lastChange[type];
    const end = Date.now();

    if (start) {
      logTime(`${type.toUpperCase()} update`, end - start);
      perf.lastChange[type] = null;
    }

    done();
  };
}

const dev = series(temp, clean, parallel(html, rollup, cssCommon, cssComponents, cssBlocks, cssLibs, jsLibs, svg, images, fonts, fontcss));

const build = series(temp, clean, rollup, parallel(html, css, cssLibs, jsLibs, svg, images, fonts, fontcss, deployHtml, deployCss, deployJs));

export const watch = parallel(isDev ? dev : build, watchFiles, browserSync);

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
export { html, css, cssLibs, rollup, jsLibs, svg, images, fontcss, deployHtml, deployCss, deployJs, build };
export default watch;
