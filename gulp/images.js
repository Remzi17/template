import gulp from "gulp";
const { src, dest } = gulp;
import { paths } from "./settings.js";
import browsersync from "browser-sync";
import newer from "gulp-newer";
import webp from "gulp-webp";
import avif from "gulp-avif";
import gulpif from "gulp-if";
import mergeStream from "merge-stream";

export function images(done) {
  const webpStream = src(paths.src.img)
    .pipe(newer({ dest: paths.build.img, ext: ".webp" }))
    .pipe(webp({ quality: 80 }))
    .pipe(dest(paths.build.img));

  const avifStream = src(paths.src.img)
    .pipe(gulpif((file) => /\.(jpe?g|png)$/i.test(file.path), newer({ dest: paths.build.img, ext: ".avif" })))
    .pipe(gulpif((file) => /\.(jpe?g|png)$/i.test(file.path), avif({ quality: 65 })))
    .pipe(dest(paths.build.img));

  return mergeStream(webpStream, avifStream).on("finish", () => {
    browsersync.reload();
    done();
  });
}
