import gulp from "gulp";
const { src, dest, parallel } = gulp;
import { paths, isBuild, unCSS } from "./settings.js";
import notify from "gulp-notify";
import { concatLibs } from "./settings.js";
import concat from "gulp-concat";
import newer from "gulp-newer";
import browsersync from "browser-sync";
import gulpif from "gulp-if";
import autoprefixer from "gulp-autoprefixer";
import group_media from "gulp-group-css-media-queries";
import uncss from "gulp-uncss";
import beautify from "gulp-beautify";
import cssnano from "gulp-cssnano";
import csso from "gulp-csso";
import gulpSass from "gulp-sass";
import * as dartSass from "sass";
const sass = gulpSass(dartSass);

function translateError(msg) {
  const translations = [
    ["Declarations may only be used within style rules", "Объявления допустимы только внутри CSS-правил"],
    ["Expected identifier", "Ожидался идентификатор"],
    ["Invalid CSS after", "Неверный CSS после"],
    ["Undefined mixin", "Неопределённый миксин"],
    ["argument(s)? required", "требуется аргумент(ы)"],
    ["Invalid property name", "Неверное имя свойства"],
    ["Unterminated string", "Незавершённая строка"],
    ["Invalid media query", "Неверный медиазапрос"],
  ];

  let translated = msg;

  for (const [eng, rus] of translations) {
    const regex = new RegExp(eng, "i");
    if (regex.test(translated)) {
      translated = translated.replace(regex, rus);
      break;
    }
  }

  return translated;
}

function handleError(taskName) {
  return function (err) {
    console.error(`\n${taskName} error:\n`, err.message, "\n");
    this.emit("end");
  };
}

// ===== DEV TASKS =====
export function cssCommon() {
  return src(paths.src.sass + "common.sass")
    .pipe(sass({ outputStyle: "expanded" }).on("error", handleError("SASS")))
    .pipe(dest(paths.build.css))
    .pipe(browsersync.stream());
}

export function cssComponents() {
  return src(paths.src.sass + "components.sass")
    .pipe(sass({ outputStyle: "expanded" }).on("error", handleError("SASS")))
    .pipe(dest(paths.build.css))
    .pipe(browsersync.stream());
}

export function cssBlocks() {
  return (
    src(paths.src.sass + "blocks.sass", { sourcemaps: !isBuild })
      .pipe(sass({ outputStyle: "expanded" }).on("error", handleError("SASS")))
      // только для билд режима
      .pipe(gulpif(isBuild, autoprefixer({ cascade: false })))
      .pipe(gulpif(isBuild, csso()))
      // записываем в папку сборки
      .pipe(dest(paths.build.css, { sourcemaps: !isBuild }))
      // только для dev инжектим CSS без перезагрузки страницы
      .pipe(gulpif(!isBuild, browsersync.stream({ match: "**/*.css" })))
  );
}

// ===== BUILD TASK =====
export function css() {
  return src([paths.src.sass + "common.sass", paths.src.sass + "components.sass", paths.src.sass + "blocks.sass"])
    .pipe(sass({ outputStyle: "expanded" }).on("error", handleError("SASS")))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(csso())
    .pipe(concat("style.css"))
    .pipe(gulp.dest(paths.build.css));
}

// ===== EXPORT =====
export function cssLibs() {
  return src(paths.src.cssLibsFiles)
    .pipe(gulpif(concatLibs, concat("vendor.css")))
    .pipe(
      gulpif(
        isBuild,
        csso({
          restructure: false,
          forceMediaMerge: false,
          comments: false,
          usage: {
            keyframes: false,
          },
        })
      )
    )
    .pipe(dest(paths.build.css))
    .pipe(
      gulpif(
        unCSS,
        uncss({
          html: [paths.src.unusedHtml],
          ignore: [/.*lg.*/, /.*select.*/, ".swiper", ".swiper-wrapper", ".swiper-slide", ".swiper-pagination", ".swiper-initialized", ".swiper-pagination-bullet", ".swiper-pagination-bullet-active", ".swiper-horizontal", ".fadeInUp", ".fadeInLeft", ".fadeInRight", ".fadeInDown", ".animated"],
        })
      )
    )
    .pipe(dest(paths.build.css))
    .pipe(browsersync.stream());
}
