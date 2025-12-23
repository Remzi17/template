import gulp from "gulp";
const { src, dest } = gulp;
import path from "path";
import fs from "fs";
import { paths, isDev, isBuild } from "./settings.js";
import fileinclude from "gulp-file-include";
import notify from "gulp-notify";
import gulpif from "gulp-if";
import beautify from "gulp-beautify";
import browsersync from "browser-sync";
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

        const imgMatches = [...content.matchAll(/<img src="([^"]+\.(?:webp|png|jpg|jpeg))"([^>]*)>/g)];

        const processQueue = imgMatches.map((match) => {
          const imgSrc = match[1];
          const attrs = match[2];
          const picAttr = / pic\b/.test(attrs);
          const mobileWidth = 575;

          const ext = path.extname(imgSrc);
          const base = path.basename(imgSrc, ext);
          const dir = path.dirname(imgSrc);
          const searchDir = path.join("src", dir);
          const availableExts = [".jpg", ".jpeg", ".png"];

          let foundPath = null;
          for (const ext of availableExts) {
            const fullPath = path.join(searchDir, base + ext);
            if (fs.existsSync(fullPath)) {
              foundPath = fullPath;
              break;
            }
          }

          if (picAttr && foundPath) {
            return createMobileVersion(foundPath, mobileWidth);
          }

          return Promise.resolve();
        });

        Promise.allSettled(processQueue)
          .then(() => {
            content = content.replace(/<img src="([^"]+\.(?:webp|png|jpg|jpeg))"([^>]*)>/g, (match, imgSrc, attrs) => {
              const picAttr = / pic\b/.test(attrs);

              const ext = path.extname(imgSrc);
              const base = path.basename(imgSrc, ext);
              const dir = path.dirname(imgSrc);

              const classMatch = attrs.match(/class="([^"]*)"/);
              const widthMatch = attrs.match(/width="(\d+)"/);
              const heightMatch = attrs.match(/height="(\d+)"/);
              const altMatch = attrs.match(/alt="([^"]*)"/);
              const loadingMatch = attrs.match(/loading="([^"]*)"/);
              const decodingMatch = attrs.match(/decoding="([^"]*)"/);

              const cleanAttrs = attrs
                .replace(/\s*pic\b/, "")
                .replace(/\s*width="\d+"\s*/, "")
                .replace(/\s*height="\d+"\s*/, "")
                .replace(/\s*alt="[^"]*"\s*/, "")
                .replace(/\s*loading="[^"]*"\s*/, "")
                .replace(/\s*decoding="[^"]*"\s*/, "")
                .replace(/\s*class="[^"]*"\s*/, "")
                .trim();

              if (picAttr) {
                return `
<picture${classMatch && classMatch[1] ? ` class="${classMatch[1]}"` : ""}>
  <source type="image/avif" srcset="${path.join(dir, base)}.avif">
  <source type="image/avif" srcset="${path.join(dir, base)}_mobile.avif" media="(max-width: 575px)">
  <source srcset="${path.join(dir, base)}_mobile.webp" media="(max-width: 575px)">
  <img src="${path.join(dir, base)}.webp"
    ${cleanAttrs ? " " + cleanAttrs : ""}
    ${widthMatch && widthMatch[1] ? ` width="${widthMatch[1]}"` : ""}
    ${heightMatch && heightMatch[1] ? ` height="${heightMatch[1]}"` : ""}
    alt="${altMatch ? altMatch[1] : ""}"
    ${loadingMatch ? ` loading="${loadingMatch[1]}"` : ' loading="lazy"'}
    ${decodingMatch ? ` decoding="${decodingMatch[1]}"` : ' decoding="async"'}>
</picture>`;
              } else {
                return `
<picture${classMatch && classMatch[1] ? ` class="${classMatch[1]}"` : ""}>
  <source type="image/avif" srcset="${path.join(dir, base)}.avif">
  <source type="image/webp" srcset="${path.join(dir, base)}.webp">
  <img src="${path.join(dir, base)}.webp"
    ${cleanAttrs ? " " + cleanAttrs : ""}
    ${widthMatch && widthMatch[1] ? ` width="${widthMatch[1]}"` : ""}
    ${heightMatch && heightMatch[1] ? ` height="${heightMatch[1]}"` : ""}
    alt="${altMatch ? altMatch[1] : ""}"
    ${loadingMatch ? ` loading="${loadingMatch[1]}"` : ' loading="lazy"'}
    ${decodingMatch ? ` decoding="${decodingMatch[1]}"` : ' decoding="async"'}>
</picture>`;
              }
            });

            file.contents = Buffer.from(content);
            cb(null, file);
          })
          .catch(cb);
      })
    )
    .pipe(gulpif(isBuild, beautify.html({ indent_size: 2, max_preserve_newlines: 1 })))
    .pipe(dest(paths.build.html));
}
