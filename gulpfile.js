import gulp from "gulp";
const { series, parallel } = gulp;

import del from "del";
import browsersync from "browser-sync";
import fs from "fs";
import path from "path";
import { css, cssLibs, cssBlocks, cssComponents, cssCommon, deadCss } from "./gulp/css.js";

import { paths, isDev, isBuild } from "./gulp/settings.js";

import { html } from "./gulp/html.js";
import { images } from "./gulp/images.js";
import { fonts, fontcss } from "./gulp/fonts.js";
import { deployHtml, deployCss, deployJs } from "./gulp/ftp.js";
import { svg } from "./gulp/svg.js";
import { jsLibs, js } from "./gulp/js.js";
import { temp } from "./gulp/functions.js";

import { startSession, endSession, trackFile, buildStartTimer, buildEndTimer, showStats } from "./gulp/statistics/statistics.js";

startSession();

function reload(done) {
  browsersync.reload();
  done();
}

function watchFiles() {
  const onChange = (filePath) => {
    if (!filePath) return;

    trackFile(filePath);

    if (filePath.endsWith(".html")) perf.lastChange.html = Date.now();
    else if (/\.(sass|scss|css)$/.test(filePath)) perf.lastChange.css = Date.now();
    else if (filePath.endsWith(".js")) perf.lastChange.js = Date.now();
  };

  gulp.watch(paths.watch.html, series(html, reload)).on("change", onChange);
  gulp.watch(paths.watch.js, series(js, reload)).on("change", onChange);

  const entryFiles = [paths.src.sass + "blocks.sass", paths.src.sass + "components.sass", paths.src.sass + "common.sass"];
  const partials = [paths.src.sass + "blocks/**/*.sass", paths.src.sass + "components/**/*.sass", paths.src.sass + "common/**/*.sass"];
  const sharedSass = [paths.src.sass + "all/**/*.sass", paths.src.sass + "_*.sass"];

  if (!isBuild) {
    entryFiles.forEach((file) => {
      const task = file.includes("blocks") ? cssBlocks : file.includes("components") ? cssComponents : cssCommon;
      gulp.watch(file, series(task)).on("change", onChange);
    });

    partials.forEach((pattern) => {
      const task = pattern.includes("blocks") ? cssBlocks : pattern.includes("components") ? cssComponents : cssCommon;
      gulp.watch(pattern, series(task)).on("change", onChange);
    });

    gulp.watch(sharedSass, series(parallel(cssCommon, cssComponents, cssBlocks))).on("change", onChange);
  } else {
    const allSass = [paths.src.sass + "*.sass", paths.src.sass + "all/**/*.sass", paths.src.sass + "blocks/**/*.sass", paths.src.sass + "components/**/*.sass", paths.src.sass + "common/**/*.sass"];
    gulp.watch(allSass, series(css, reload)).on("change", onChange);
  }

  gulp.watch(paths.watch.cssLibs, series(cssLibs, reload));
  gulp.watch(paths.watch.jsLibs, series(jsLibs, reload));

  gulp.watch(paths.watch.icons, series(svg, reload));
  gulp.watch(paths.watch.img, series(images, reload));
  gulp.watch(paths.watch.fontcss, series(fontcss, reload));
}

function clean() {
  return del(paths.clean);
}

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: paths.build.html,
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

const dev = series(
  (done) => {
    buildStartTimer();
    done();
  },
  temp,
  clean,
  parallel(html, js, cssCommon, cssComponents, cssBlocks, cssLibs, jsLibs, svg, images, fonts, fontcss),
  (done) => {
    buildEndTimer();
    done();
  }
);

const build = series(
  (done) => {
    buildStartTimer();
    done();
  },
  temp,
  clean,
  js,
  parallel(html, css, cssLibs, jsLibs, svg, images, fonts, fontcss, deployHtml, deployCss, deployJs),
  (done) => {
    buildEndTimer();
    done();
  }
);

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

process.on("SIGINT", () => {
  endSession();
  process.exit();
});
process.on("SIGTERM", () => {
  endSession();
  process.exit();
});

export { html, css, cssLibs, deadCss, js, jsLibs, svg, images, fontcss, deployHtml, deployCss, deployJs, build };
export default watch;
