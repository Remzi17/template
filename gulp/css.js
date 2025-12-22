import gulp from "gulp";
const { src, dest, parallel } = gulp;
import { paths, isDev, isBuild, unCSS, concatLibs } from "./settings.js";
import browsersync from "browser-sync";
import notify from "gulp-notify";
import gulpif from "gulp-if";
import concat from "gulp-concat";
import autoprefixer from "gulp-autoprefixer";
import csso from "gulp-csso";
import uncss from "gulp-uncss";
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

export function handleError(taskName) {
  return function (err) {
    const original = err.messageOriginal || err.message || "Неизвестная ошибка";
    const short = original.split("\n")[0];
    const translated = translateError(short);
    const file = err.relativePath || err.file || "Неизвестный файл";
    const line = err.line || "?";

    notify({
      title: `\n${taskName} ошибка`,
      message: `\n\n${translated}\n${file.split("src/assets/")[1]}\n${line} строка \n\n\n\n`,
      sound: true,
    }).write(err);

    this.emit("end");
  };
}

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
  return src(paths.src.sass + "blocks.sass", { sourcemaps: isDev })
    .pipe(sass({ outputStyle: "expanded" }).on("error", handleError("SASS")))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(csso())
    .pipe(dest(paths.build.css, { sourcemaps: isDev }))
    .pipe(browsersync.stream({ match: "**/*.css" }));
}

export function css() {
  return src([paths.src.sass + "common.sass", paths.src.sass + "components.sass", paths.src.sass + "blocks.sass"])
    .pipe(sass({ outputStyle: "expanded" }).on("error", handleError("SASS")))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(csso())
    .pipe(concat("style.css"))
    .pipe(gulp.dest(paths.build.css));
}

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
