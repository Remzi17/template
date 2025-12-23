import gulp from "gulp";
import { project_folder, template, isBuild, isDeploy, concatLibs } from "./settings.js";
import gutil from "gulp-util";
import ftp from "vinyl-ftp";
import cheerio from "gulp-cheerio";

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
};

let domen;

export function getLink() {
  if (template == "wsp") {
    return "/" + project_folder;
  } else {
    return "/www/" + project_folder + domen;
  }
  // return '/www/test.osmanovremzi.ru/wp-content/themes/main/';
}

if (template == "siteup") {
  domen = ".siteup.ru/";

  var conn = ftp.create({
    host: "host.siteup.ru",
    user: "osmanov",
    password: "2Z0a5T8i",
    parallel: 10,
    log: gutil.log,
  });
} else if (template == "wsp") {
  domen = "verstka.demo-wsp.ru/";

  var conn = ftp.create({
    host: "managem9.beget.tech",
    user: "managem9_remzi",
    password: "BaZSZLHV*B89",
    parallel: 10,
    log: gutil.log,
  });
} else {
  domen = ".osmanovremzi.ru/";

  var conn = ftp.create({
    host: "ru5.link-host.net",
    user: "remzi144_dev",
    password: "hP1jU7gP8u",
    parallel: 10,
    log: gutil.log,
  });
}

function buildOnly() {
  if (!isBuild) {
    console.warn(`\n\n\n\n Таск доступен только в build режиме. Запусти: gulp --build\n\n\n\n\n\n`);
    return false;
  }
  return true;
}

const deploy = () => {
  if (!buildOnly()) return Promise.resolve();

  return cleanScripts().on("end", () => {
    const globs = [project_folder + "/assets/css/style.css", project_folder + "/assets/js/script.js", project_folder + "/*.html"];

    return gulp
      .src(globs, {
        base: project_folder,
        buffer: false,
      })
      .pipe(conn.dest(getLink()));
  });
};

const deployAll = () => {
  if (!buildOnly()) return Promise.resolve();

  return cleanScripts().on("end", () => {
    let globs = [project_folder + "/**/*.*", project_folder + "/*.*"];

    return gulp
      .src(globs, {
        base: project_folder,
        buffer: false,
      })
      .pipe(conn.dest(getLink()));
  });
};

const deploySprite = () => {
  if (!buildOnly()) return Promise.resolve();

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
  if (!buildOnly()) return Promise.resolve();

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
  if (!buildOnly()) return Promise.resolve();

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
  if (!buildOnly()) return Promise.resolve();

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
  if (!buildOnly()) return Promise.resolve();

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

gulp.task("deploy", deploy);
gulp.task("deploy-all", deployAll);
gulp.task("deploy-sprite", deploySprite);
gulp.task("deploy-libs", deployLibs);
gulp.task("deploy-images", deployImages);

export { deploy, deployAll, deploySprite, deployLibs, deployImages, deployHtml, deployCss, deployJs };
