import gulp from "gulp";
import path from "path";
import fs from "fs";
import { project_folder, template, isDeploy, concatLibs, paths, isWp } from "./settings.js";
import log from "fancy-log";
import ftp from "vinyl-ftp";
import cheerio from "gulp-cheerio";
import dotenv from "dotenv";
dotenv.config({
  quiet: true,
});

export const cleanScripts = () => {
  if (!concatLibs) {
    return gulp
      .src(project_folder + "/*.html")
      .pipe(
        cheerio(($) => {
          if ($("[data-gallery]").length === 0) {
            $('[src*="lg.js"]').remove();
            $('[src*="lg-thumbnail.js"]').remove();
            $('[src*="lg-video.js"]').remove();
            $('[src*="lg-zoom.js"]').remove();
            $('[src*="lg-hash.js"]').remove();

            $('[href*="lg.css"]').remove();
            $('[href*="lg-thumbnail.css"]').remove();
            $('[href*="lg-video.css"]').remove();
            $('[href*="lg-zoom.css"]').remove();
            $('[href*="lg-hash.css"]').remove();
          }

          if ($(".swiper").length === 0) {
            $('[src*="swiper.js"]').remove();
            $('[href*="swiper.css"]').remove();
          }

          if ($(".wow").length === 0) {
            $('[src*="wow.js"]').remove();
            $('[href*="animate.css"]').remove();
          }

          if ($(".input-date").length === 0) {
            $('[src*="date.js"]').remove();
            $('[href*="date.css"]').remove();
          }

          if ($("[data-da]").length === 0) $('[src*="dynamic.js"]').remove();
          if ($('[type="tel"]').length === 0) $('[src*="mask.js"]').remove();
          if ($("[data-notify]").length === 0) $('[src*="notify.js"]').remove();

          if ($("select").length === 0) {
            $('[src*="select.js"]').remove();
            $('[href*="select.css"]').remove();
          }

          if ($(".timer").length === 0) $('[src*="timer.js"]').remove();
        })
      )
      .pipe(gulp.dest(project_folder));
  }

  return Promise.resolve();
};

const hosts = {
  siteup: {
    domen: ".siteup.ru/",
    ftp: {
      host: process.env.FTP_HOST_SITEUP,
      user: process.env.FTP_USER_SITEUP,
      password: process.env.FTP_PASS_SITEUP,
    },
  },
  wsp: {
    domen: "verstka.demo-wsp.ru/",
    ftp: {
      host: process.env.FTP_HOST_WSP,
      user: process.env.FTP_USER_WSP,
      password: process.env.FTP_PASS_WSP,
    },
  },
  default: {
    domen: ".osmanovremzi.ru/",
    ftp: {
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASS,
    },
  },
};

const current = hosts[template] || hosts.default;

if (!current.ftp.host || !current.ftp.user || !current.ftp.password) {
  throw new Error("❌ Неправильные FTP доступы");
}

const createFastConn = () =>
  ftp.create({
    host: current.ftp.host,
    user: current.ftp.user,
    password: current.ftp.password,
    parallel: 10,
    passive: false,
    keepalive: 10000,
    log,
  });

const createSafeConn = () =>
  ftp.create({
    host: current.ftp.host,
    user: current.ftp.user,
    password: current.ftp.password,
    parallel: 1,
    passive: true,
    keepalive: 10000,
    log,
  });

function buildOnly() {
  if (!fs.existsSync(path.join(paths.build.css, "style.css"))) {
    log.warn("❌ Таск доступен только в build режиме. Запусти: gulp --build");
    return false;
  }
  return true;
}

export function getLink() {
  if (template === "wsp") return "/" + project_folder;
  if (isWp) return `/www/${project_folder}${current.domen}wp-content/themes/main/`;
  return `/www/${project_folder}${current.domen}`;
}

export const deployPaths = {
  normal: {
    base: project_folder,
    root: project_folder,
  },
  wp: {
    base: "wp/wp-content/themes/main",
    root: "wp/wp-content/themes/main",
  },
};

const currentDeploy = isWp ? deployPaths.wp : deployPaths.normal;

function handleFtpError(err, runFn) {
  if (err.code === "ECONNRESET") {
    log.warn("VPN режим, повторная попытка через безопасное соединение");
    return runFn(createSafeConn()).on("error", (e) => {
      log.error("FTP ошибка после повторной попытки:", e.message);
    });
  }
  log.error("FTP ошибка:", err.message);
}

function deployRunner(globs) {
  if (!buildOnly()) return Promise.resolve();

  const run = (conn) => gulp.src(globs, { base: currentDeploy.base, buffer: false }).pipe(conn.dest(getLink()));

  const safeRun = () => run(createSafeConn());

  const fastConn = createFastConn();

  return new Promise((resolve, reject) => {
    const stream = run(fastConn);

    stream.on("error", (err) => {
      if (err.code === "ECONNRESET") {
        log.warn("VPN режим, повторная попытка через безопасное соединение с паузой");
        setTimeout(() => {
          safeRun()
            .on("finish", resolve)
            .on("error", (e) => {
              log.error("FTP ошибка после повторной попытки:", e.message);
              reject(e);
            });
        }, 2000);
      } else {
        reject(err);
      }
    });

    stream.on("finish", resolve);
  });
}

// prettier-ignore
const deployTask = () => 
  deployRunner(isWp ? [
    `${currentDeploy.root}/assets/css/style.css`, 
    `${currentDeploy.root}/assets/js/script.js`
  ] : [
    `${project_folder}/*.html`, 
    `${project_folder}/assets/css/style.css`, 
    `${project_folder}/assets/js/script.js`
  ]
);

// prettier-ignore
const deployAllTask = () => deployRunner([
  `${currentDeploy.root}/**/*.*`
]);

// prettier-ignore
const deploySpriteTask = () => deployRunner([
  `${currentDeploy.root}/assets/img/sprite.svg`
]);

// prettier-ignore
const deployLibsTask = () => deployRunner([
  `${currentDeploy.root}/assets/css/vendor.css`, `${currentDeploy.root}/assets/js/vendor.js`
]);

// prettier-ignore
const deployImagesTask = () => deployRunner([
  `${currentDeploy.root}/assets/img/**/*`
]);

// prettier-ignore
const deployHtml = () => {
  if (isWp || !isDeploy) return Promise.resolve();

  return deployRunner([
    `${project_folder}/*.html`
  ]);
};

// prettier-ignore
const deployCss = () => {
  if (!isDeploy) return Promise.resolve();

  return deployRunner([
    `${currentDeploy.root}/assets/css/*.css`, 
    `!${currentDeploy.root}/assets/css/vendor.css`, 
    `!${currentDeploy.root}/assets/css/fonts.css`
  ]);
};

// prettier-ignore
const deployJs = () => {
  if (!isDeploy) return Promise.resolve();

  return deployRunner([
    `${currentDeploy.root}/assets/js/*.js`, 
    `!${currentDeploy.root}/assets/js/vendor.js`
  ]);
};

gulp.task("deploy", gulp.series(cleanScripts, deployTask));
gulp.task("deploy-all", gulp.series(cleanScripts, deployAllTask));
gulp.task("deploy-sprite", deploySpriteTask);
gulp.task("deploy-libs", deployLibsTask);
gulp.task("deploy-images", deployImagesTask);

export { deployTask, deployAllTask, deploySpriteTask, deployLibsTask, deployImagesTask, deployHtml, deployCss, deployJs };
