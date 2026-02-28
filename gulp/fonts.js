import gulp from "gulp";
const { src, dest, series } = gulp;

import { paths, normalize } from "./settings.js";
import fs from "fs";
import path from "path";
import fonter from "gulp-fonter";
import del from "del";
import ttf2woff2 from "ttf2woff2";
import through2 from "through2";
import newer from "gulp-newer";
import { readFileSync, writeFileSync } from "fs";

function hasFontSources() {
  const files = fs.readdirSync(paths.src.fonts);
  return files.some((f) => f.endsWith(".otf") || f.endsWith(".ttf") || f.endsWith(".woff"));
}

export function otfToTtf() {
  const files = fs.readdirSync(paths.src.fonts).filter((f) => f.endsWith(".otf"));
  if (!files.length) return Promise.resolve();

  return src(files.map((f) => normalize(`${paths.src.fonts}/${f}`)))
    .pipe(fonter({ formats: ["ttf"] }))
    .pipe(
      through2.obj((file, _, cb) => {
        file.path = normalize(file.path);
        cb(null, file);
      })
    )
    .pipe(dest(paths.src.fonts));
}

export function ttfToWoff2() {
  const files = fs.readdirSync(paths.src.fonts).filter((f) => f.endsWith(".ttf"));
  if (!files.length) return Promise.resolve();

  return src(files.map((f) => normalize(`${paths.src.fonts}/${f}`))).pipe(
    through2.obj((file, _, cb) => {
      try {
        const buffer = readFileSync(file.path);
        const woff2Buffer = ttf2woff2(buffer);
        const outPath = normalize(file.path.replace(/\.ttf$/i, ".woff2"));
        writeFileSync(outPath, woff2Buffer);
      } catch (e) {
        console.error("Font convert error:", e.message);
      }
      cb(null, file);
    })
  );
}

export async function cleanOriginalFonts() {
  if (!hasFontSources()) return;

  await del([normalize(path.join(paths.src.fonts, "*.otf")), normalize(path.join(paths.src.fonts, "*.ttf")), normalize(path.join(paths.src.fonts, "*.woff"))]);
}

// prettier-ignore
export function fontsBuild() {
  const srcGlob = normalize(path.join(paths.src.fonts, "*.woff2"));
  const destFolder = paths.build.fonts;

  return src(srcGlob)
    .pipe(newer(destFolder))
    .pipe(dest(destFolder));
}

export const normalizeFonts = series(otfToTtf, ttfToWoff2, cleanOriginalFonts);

// prettier-ignore
export function fontcss() { 
  return src(paths.src.fontcss, { allowEmpty: true })
    .pipe(newer(paths.build.css))
    .pipe(dest(paths.build.css));
}
