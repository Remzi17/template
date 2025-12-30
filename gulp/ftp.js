import gulp from "gulp";
import path from "path";
import fs from "fs";
import { project_folder, template, isDeploy, concatLibs, paths } from "./settings.js";
import log from "fancy-log";
import ftp from "vinyl-ftp";
import cheerio from "gulp-cheerio";
import dotenv from "dotenv";
dotenv.config();

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

export function getLink() {
  if (template === "wsp") return "/" + project_folder;
  return "/www/" + project_folder + current.domen;
}

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
  throw new Error("❌ FTP credentials not found. Check .env");
}

const conn = ftp.create({
  host: current.ftp.host,
  user: current.ftp.user,
  password: current.ftp.password,
  parallel: 10,
  log,
});

function buildOnly() {
  if (!fs.existsSync(path.join(paths.build.css, "style.css"))) {
    console.warn(`\n\n\n\n ❌ Таск доступен только в build режиме. Запусти: gulp --build\n\n\n\n\n\n`);
    return false;
  }
  return true;
}

const deploy = () => {
  if (!buildOnly()) return Promise.resolve();

  const globs = [project_folder + "/assets/css/style.css", project_folder + "/assets/js/script.js", project_folder + "/*.html"];

  return gulp
    .src(globs, {
      base: project_folder,
      buffer: false,
    })
    .pipe(conn.dest(getLink()));
};

const deployAll = () => {
  if (!buildOnly()) return Promise.resolve();

  let globs = [project_folder + "/**/*.*", project_folder + "/*.*"];

  return gulp
    .src(globs, {
      base: project_folder,
      buffer: false,
    })
    .pipe(conn.dest(getLink()));
};

const deploySprite = () => {
  let globs = [project_folder + "/assets/img/sprite.svg"];

  return gulp
    .src(globs, {
      base: project_folder,
      buffer: false,
    })
    .pipe(conn.newer(getLink()))
    .pipe(conn.dest(getLink()));
};

const deployLibs = () => {
  let globs = [project_folder + "/assets/css/vendor.css", project_folder + "/assets/js/vendor.js"];

  return gulp
    .src(globs, {
      base: project_folder,
      buffer: false,
    })
    .pipe(conn.newer(getLink()))
    .pipe(conn.dest(getLink()));
};

const deployImages = () => {
  let globs = [project_folder + "/assets/img/**/*"];

  return gulp
    .src(globs, {
      base: project_folder,
      buffer: false,
    })
    .pipe(conn.newer(getLink()))
    .pipe(conn.dest(getLink()));
};

const deployHtml = () => {
  if (!isDeploy) return Promise.resolve();

  let globs = [project_folder + "/*.html"];

  return gulp
    .src(globs, {
      base: project_folder,
      buffer: false,
    })
    .pipe(conn.newer(getLink()))
    .pipe(conn.dest(getLink()));
};

const deployCss = () => {
  if (!buildOnly()) return Promise.resolve();

  if (!isDeploy) return Promise.resolve();
  let globs = [project_folder + "/assets/css/*.css", "!" + project_folder + "/assets/css/vendor.css", "!" + project_folder + "/assets/css/fonts.css"];

  return gulp
    .src(globs, {
      base: project_folder,
      buffer: false,
    })
    .pipe(conn.newer(getLink()))
    .pipe(conn.dest(getLink()));
};

const deployJs = () => {
  if (!isDeploy) return Promise.resolve();
  let globs = [project_folder + "/assets/js/*.js", "!" + project_folder + "/assets/js/vendor.js"];

  return gulp
    .src(globs, {
      base: project_folder,
      buffer: false,
    })
    .pipe(conn.newer(getLink()))
    .pipe(conn.dest(getLink()));
};

gulp.task("deploy", gulp.series(cleanScripts, deploy));
gulp.task("deploy-all", gulp.series(cleanScripts, deployAll));
gulp.task("deploy-sprite", deploySprite);
gulp.task("deploy-libs", deployLibs);
gulp.task("deploy-images", deployImages);

export { deploy, deployAll, deploySprite, deployLibs, deployImages, deployHtml, deployCss, deployJs };
