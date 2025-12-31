import gulp from "gulp";
const { series, parallel } = gulp;

import del from "del";
import browsersync from "browser-sync";
import { css, cssLibs, cssBlocks, cssComponents, cssCommon, deadCss } from "./gulp/css.js";
import { paths, isDev, isBuild, isWp } from "./gulp/settings.js";
import fs from "fs";
import { exec } from "child_process";
import { html } from "./gulp/html.js";
import { images } from "./gulp/images.js";
import { fonts, fontcss } from "./gulp/fonts.js";
import { deployHtml, deployCss, deployJs } from "./gulp/ftp.js";
import { svg } from "./gulp/svg.js";
import { jsLibs, js } from "./gulp/js.js";
import { temp } from "./gulp/functions.js";
import { startSession, endSession, trackFile, buildStartTimer, buildEndTimer, showStats } from "./gulp/statistics/statistics.js";

startSession();

const envFilePath = ".env";

function getEnvNodeEnv() {
  const env = fs.readFileSync(envFilePath, "utf-8");
  const match = env.match(/^NODE_ENV=(.*)$/m);
  return match ? match[1] : "dev";
}

function setEnvNodeEnv(value) {
  let env = fs.readFileSync(envFilePath, "utf-8");

  if (/^NODE_ENV=.*/m.test(env)) {
    env = env.replace(/^NODE_ENV=.*/m, `NODE_ENV=${value}`);
  } else {
    env += `\nNODE_ENV=${value}`;
  }

  fs.writeFileSync(envFilePath, env);
}

export function syncEnvAndDocker(cb) {
  const cliEnv = process.argv.includes("--build") ? "build" : "dev";
  const envFileEnv = getEnvNodeEnv();

  if (cliEnv !== envFileEnv) {
    console.log(`Docker ENV: ${envFileEnv} → ${cliEnv}`);
    setEnvNodeEnv(cliEnv);

    exec("docker compose down && docker compose up -d --build", (err, stdout, stderr) => {
      console.log(stdout);
      console.error(stderr);
      cb(err);
    });
  } else {
    cb();
  }
}
function reload(done) {
  browsersync.reload();
  done();
}

// prettier-ignore
function watchFiles() {
  const onChange = (filePath) => {
    if (!filePath) return;

    trackFile(filePath);
  };

  gulp.watch(paths.watch.html, series(html, reload)).on("change", onChange);
  gulp.watch(paths.watch.js, series(js, reload)).on("change", onChange);

  const entryFiles = [
    paths.src.sass + "blocks.sass", 
    paths.src.sass + "components.sass", 
    paths.src.sass + "common.sass"
  ];

  const partials = [
    paths.src.sass + "blocks/**/*.sass", 
    paths.src.sass + "components/**/*.sass", 
    paths.src.sass + "common/**/*.sass"
   ];

  const sharedSass = [
    paths.src.sass + "all/**/*.sass", 
    paths.src.sass + "_*.sass"
  ];

  if (isDev) {
    console.log('isDev нх');
    
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
    console.log('isBuild нх');
    const allSass = [
      paths.src.sass + "*.sass", 
      paths.src.sass + "all/**/*.sass", 
      paths.src.sass + "blocks/**/*.sass", 
      paths.src.sass + "components/**/*.sass", 
      paths.src.sass + "common/**/*.sass"
    ];
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
  if (isWp) {
    browsersync.init({
      proxy: "http://localhost:8080",
      notify: false,
      open: true,
    });
  } else {
    browsersync.init({
      server: {
        baseDir: paths.build.html,
      },
      notify: false,
      open: true,
    });
  }

  done();
}

const dev = series(
  syncEnvAndDocker,
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
  syncEnvAndDocker,
  (done) => {
    buildStartTimer();
    done();
  },
  temp,
  clean,
  js,
  parallel(html, css, cssLibs, jsLibs, svg, images, fonts, fontcss),
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
