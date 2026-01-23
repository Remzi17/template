import path from "path";
import { project_folder, isWp } from "./gulp/settings.js";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import dynamicImportVars from "@rollup/plugin-dynamic-import-vars";

const isBuild = process.env.BUILD === "true";

const baseConfig = (input, outputFile) => ({
  input: input,
  output: {
    file: outputFile,
    format: "iife",
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    isBuild &&
      terser({
        keep_fnames: /waitForTilesLoad|getTileContainer/,
      }),
    dynamicImportVars(),
  ],

  // treeshake: {
  // 	moduleSideEffects: false,
  // },
});

console.log(path.resolve(project_folder, "assets/js/script.js"));

// prettier-ignore
export const configs = [baseConfig(
  "src/assets/js/script.js", 
  isWp ? "wp/wp-content/themes/main/assets/js/script.js" : path.resolve(project_folder, "assets/js/script.js")
)];
