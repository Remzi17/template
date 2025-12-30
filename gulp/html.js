import gulp from "gulp";
const { src, dest } = gulp;
import path from "path";
import fs from "fs";
import { paths, isWp, isBuild } from "./settings.js";
import fileinclude from "gulp-file-include";
import notify from "gulp-notify";
import gulpif from "gulp-if";
import beautify from "gulp-beautify";
import resize from "gulp-image-resize";
import rename from "gulp-rename";
import through from "through2";

const mobileCache = new Set();

function createMobileVersion(originalPath, width = 575) {
  const cacheKey = `${originalPath}_${width}`;
  if (mobileCache.has(cacheKey)) return Promise.resolve();

  const ext = path.extname(originalPath);
  const dir = path.dirname(originalPath);
  const base = path.basename(originalPath, ext);
  const mobilePath = path.join(dir, `${base}_mobile${ext}`);

  if (!fs.existsSync(mobilePath)) {
    mobileCache.add(cacheKey);
    return src(originalPath)
      .pipe(resize({ width }))
      .pipe(rename(`${base}_mobile${ext}`))
      .pipe(dest(dir));
  } else {
    mobileCache.add(cacheKey);
    return Promise.resolve();
  }
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
    .on("error", notify.onError({ title: "HTML error", message: "<%= error.message %>", sound: false }))
    .pipe(
      through.obj(function (file, enc, cb) {
        if (file._processed) return cb(null, file);
        file._processed = true;

        let content = file.contents.toString();
        content = content.replace(/<!-- not format -->/g, "");

        const imgRegex = /<img\b[^>]*>/gi;
        const imgTags = content.match(imgRegex) || [];
        const processQueue = [];

        imgTags.forEach((imgTag, index) => {
          const srcMatch = imgTag.match(/\bsrc="([^"]+\.(?:webp|png|jpg|jpeg))"/i);
          if (!srcMatch) {
            return;
          }

          const imgSrc = srcMatch[1];

          const picMatch = imgTag.match(/\spic(?:="([^"]*)")?/i);
          const picAttr = !!picMatch;
          let picWidth = 575;

          if (picMatch && picMatch[1]) {
            const w = parseInt(picMatch[1], 10);
            if (!isNaN(w)) picWidth = w;
          }

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

          if (picAttr && foundPath) {
            processQueue.push(createMobileVersion(foundPath, picWidth));
          }
        });

        Promise.allSettled(processQueue)
          .then(() => {
            content = content.replace(imgRegex, (imgTag) => {
              const srcMatch = imgTag.match(/\bsrc="([^"]+\.(?:webp|png|jpg|jpeg))"/i);
              if (!srcMatch) return imgTag;

              const imgSrc = srcMatch[1];
              const picMatch = imgTag.match(/\spic(?:="([^"]*)")?/i);
              const picAttr = !!picMatch;
              let picWidth = 575;

              if (picMatch && picMatch[1]) {
                const w = parseInt(picMatch[1], 10);
                if (!isNaN(w)) picWidth = w;
              }

              const mobileMedia = `(max-width: ${picWidth}px)`;
              const ext = path.extname(imgSrc);
              const base = path.basename(imgSrc, ext);
              const dir = path.dirname(imgSrc);

              const getAttr = (name) => {
                const m = imgTag.match(new RegExp(`\\b${name}="([^"]*)"`, "i"));
                return m ? m[1] : null;
              };

              const classAttr = getAttr("class");
              const width = getAttr("width");
              const height = getAttr("height");
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
                return `
<picture${classAttr ? ` class="${classAttr}"` : ""}>
  <source type="image/avif" srcset="${path.join(dir, base)}.avif">
  <source type="image/avif" srcset="${path.join(dir, base)}_mobile.avif" media="${mobileMedia}">
  <source srcset="${path.join(dir, base)}_mobile.webp" media="${mobileMedia}">
  <img src="${path.join(dir, base)}.webp"${cleanAttrs ? " " + cleanAttrs : ""}
    ${width ? ` width="${width}"` : ""}
    ${height ? ` height="${height}"` : ""}
    alt="${alt}"
    loading="${loading}"
    decoding="${decoding}">
</picture>`;
              }

              return `
<picture${classAttr ? ` class="${classAttr}"` : ""}>
  <source type="image/avif" srcset="${path.join(dir, base)}.avif">
  <source type="image/webp" srcset="${path.join(dir, base)}.webp">
  <img src="${path.join(dir, base)}.webp"${cleanAttrs ? " " + cleanAttrs : ""}
    ${width ? ` width="${width}"` : ""}
    ${height ? ` height="${height}"` : ""}
    alt="${alt}"
    loading="${loading}"
    decoding="${decoding}">
</picture>`;
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
