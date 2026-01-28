import gulp from "gulp";
const { src, dest } = gulp;
import path from "path";
import fs from "fs";
import { paths, isWp, isBuild } from "./settings.js";
import { dedent } from "./functions.js";
import fileinclude from "gulp-file-include";
import notify from "gulp-notify";
import gulpif from "gulp-if";
import beautify from "gulp-beautify";
import resize from "gulp-image-resize";
import rename from "gulp-rename";
import through from "through2";

const defaultMobileMedia = 575;
const mobileCache = new Set();

function createMobileVersion(originalPath, width = defaultMobileMedia) {
  const cacheKey = `${originalPath}_${width}`;
  if (mobileCache.has(cacheKey)) return Promise.resolve();

  const ext = path.extname(originalPath);
  const dir = path.dirname(originalPath);
  const base = path.basename(originalPath, ext);
  const mobilePath = path.join(dir, `${base}-${width}${ext}`);

  if (!fs.existsSync(mobilePath)) {
    mobileCache.add(cacheKey);

    return src(originalPath)
      .pipe(resize({ width }))
      .pipe(rename(`${base}-${width}${ext}`))
      .pipe(dest(dir));
  }

  mobileCache.add(cacheKey);
  return Promise.resolve();
}

export function html() {
  if (isWp) return Promise.resolve();

  return src(paths.src.html)
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
        context: { isDev: !isBuild },
      })
    )
    .on(
      "error",
      notify.onError({
        title: "HTML error",
        message: "<%= error.message %>",
        sound: false,
      })
    )
    .pipe(
      through.obj(function (file, enc, cb) {
        if (file._processed) return cb(null, file);
        file._processed = true;

        let content = file.contents.toString();
        content = content.replace(/<!-- not format -->/g, "");

        const imgRegex = /<img\b[^>]*>/gi;
        const imgTags = content.match(imgRegex) || [];
        const processQueue = [];

        imgTags.forEach((imgTag) => {
          const srcMatch = imgTag.match(/\bsrc="([^"]+\.(?:webp|png|jpg|jpeg))"/i);
          if (!srcMatch) return;

          const imgSrc = srcMatch[1];

          const picMatch = imgTag.match(/\spic(?:="([^"]*)")?/i);
          if (!picMatch) return;

          let picWidths = [defaultMobileMedia];

          if (picMatch[1]) {
            picWidths = picMatch[1]
              .split(",")
              .map((v) => parseInt(v.trim(), 10))
              .filter((v) => !isNaN(v));
          }

          picWidths.sort((a, b) => b - a);

          const ext = path.extname(imgSrc);
          const base = path.basename(imgSrc, ext);
          const dir = path.dirname(imgSrc);
          const searchDir = path.join("src", dir);
          const availableExts = [".jpg", ".jpeg", ".png"];

          let foundPath = null;

          for (const e of availableExts) {
            const fullPath = path.join(searchDir, base + e);
            if (fs.existsSync(fullPath)) {
              foundPath = fullPath;
              break;
            }
          }

          if (!foundPath) return;

          picWidths.forEach((width) => {
            processQueue.push(createMobileVersion(foundPath, width));
          });
        });

        Promise.allSettled(processQueue)
          .then(() => {
            content = content.replace(imgRegex, (imgTag) => {
              const srcMatch = imgTag.match(/\bsrc="([^"]+\.(?:webp|png|jpg|jpeg))"/i);
              if (!srcMatch) return imgTag;

              const imgSrc = srcMatch[1];

              const picMatch = imgTag.match(/\spic(?:="([^"]*)")?/i);
              const picAttr = !!picMatch;

              let picWidths = [defaultMobileMedia];

              if (picMatch && picMatch[1]) {
                picWidths = picMatch[1]
                  .split(",")
                  .map((v) => parseInt(v.trim(), 10))
                  .filter((v) => !isNaN(v));
              }

              picWidths.sort((a, b) => b - a);

              const ext = path.extname(imgSrc);
              const base = path.basename(imgSrc, ext);
              const dir = path.dirname(imgSrc);

              const getAttr = (name) => {
                const m = imgTag.match(new RegExp(`\\b${name}="([^"]*)"`, "i"));
                return m ? m[1] : null;
              };

              const classAttr = getAttr("class");
              const widthAttr = getAttr("width");
              const heightAttr = getAttr("height");
              const alt = getAttr("alt") || "";
              const loading = getAttr("loading") || "lazy";
              const decoding = getAttr("decoding") || "async";

              const cleanAttrs = imgTag
                .replace(/^<img/i, "")
                .replace(/\/?>$/, "")
                .replace(/\bsrc="[^"]*"/gi, "")
                .replace(/\bclass="[^"]*"/gi, "")
                .replace(/\bwidth="[^"]*"/gi, "")
                .replace(/\bheight="[^"]*"/gi, "")
                .replace(/\balt="[^"]*"/gi, "")
                .replace(/\bloading="[^"]*"/gi, "")
                .replace(/\bdecoding="[^"]*"/gi, "")
                .replace(/\spic(?:="[^"]*")?/gi, "")
                .trim();

              if (picAttr) {
                const mobileSources = picWidths
                  .map((w) => {
                    const media = `(max-width: ${w}px)`;

                    return dedent(`
                      <source type="image/avif" srcset="${path.join(dir, `${base}-${w}.avif`)}" media="${media}">
                      <source srcset="${path.join(dir, `${base}-${w}.webp`)}" media="${media}">
                    `);
                  })
                  .join("");

                return dedent(`
                  <picture${classAttr ? ` class="${classAttr}"` : ""}>
                    <source type="image/avif" srcset="${path.join(dir, `${base}.avif`)}">
                    ${mobileSources}
                    <img src="${path.join(dir, `${base}.webp`)}"${cleanAttrs ? " " + cleanAttrs : ""}
                      ${widthAttr ? ` width="${widthAttr}"` : ""}
                      ${heightAttr ? ` height="${heightAttr}"` : ""}
                      alt="${alt}"
                      loading="${loading}"
                      decoding="${decoding}">
                  </picture>
                `);
              }

              return dedent(`
                <picture${classAttr ? ` class="${classAttr}"` : ""}>
                  <source type="image/avif" srcset="${path.join(dir, `${base}.avif`)}">
                  <source type="image/webp" srcset="${path.join(dir, `${base}.webp`)}">
                  <img src="${path.join(dir, `${base}.webp`)}"${cleanAttrs ? " " + cleanAttrs : ""}
                    ${widthAttr ? ` width="${widthAttr}"` : ""}
                    ${heightAttr ? ` height="${heightAttr}"` : ""}
                    alt="${alt}"
                    loading="${loading}"
                    decoding="${decoding}">
                </picture>
              `);
            });

            file.contents = Buffer.from(content);
            cb(null, file);
          })
          .catch(cb);
      })
    )
    .pipe(
      gulpif(
        isBuild,
        beautify.html({
          indent_size: 2,
          max_preserve_newlines: 1,
        })
      )
    )
    .pipe(dest(paths.build.html));
}
