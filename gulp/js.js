import gulp from "gulp";
const { src, dest } = gulp;

import { paths, isBuild, jsBundler, concatLibs } from "./settings.js";
import browsersync from "browser-sync";
import concat from "gulp-concat";
import gulpif from "gulp-if";
import terser from "gulp-terser";
import beautify from "gulp-beautify";
import esbuild from "esbuild";
import * as rollupJs from "rollup";
import { configs } from "../rollup.config.js";
// =======================
// JS LIBS
// =======================
export function jsLibs() {
  return src(paths.src.jsLibsFiles)
    .pipe(gulpif(concatLibs, concat("vendor.js")))
    .pipe(gulpif(isBuild, terser()))
    .pipe(dest(paths.build.js))
    .pipe(browsersync.stream());
}

export async function js() {
  const isDev = !process.env.BUILD;

  if (jsBundler === "esbuild") {
    await esbuild.build({
      entryPoints: ["src/assets/js/script.js"],
      bundle: true,
      outfile: paths.build.js + "script.js",
      format: "iife",
      target: "es2020",

      sourcemap: isDev,
      minify: false,
      keepNames: true,
      treeShaking: false,

      legalComments: "none",
      logLevel: "silent",
    });

    return src(paths.build.js + "script.js")
      .pipe(
        beautify.js({
          indent_size: 2,
          indent_char: " ",
          preserve_newlines: true,
          max_preserve_newlines: 2,
          brace_style: "collapse",
          keep_array_indentation: false,
          space_in_paren: false,
        })
      )
      .pipe(dest(paths.build.js))
      .pipe(isDev ? browsersync.stream() : browsersync.reload());
  } else if (jsBundler === "rollup") {
    for (const config of configs) {
      const bundle = await rollupJs.rollup(config);
      await bundle.write(config.output);
    }

    if (isDev) {
      browsersync.stream();
    } else {
      browsersync.reload();
    }
  } else {
    throw new Error(`Unknown jsBundler: ${jsBundler}`);
  }
}
