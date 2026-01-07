import gulp from "gulp";
const { src, dest } = gulp;
import path from "path";
import fs from "fs";
import yargs from "yargs";
import { paths, source_folder, project_folder, variables, concatLibs, getFiles, replaceScripts } from "./settings.js";
import { hideBin } from "yargs/helpers";
import resize from "gulp-image-resize";
import rename from "gulp-rename";
import posthtml from "gulp-posthtml";
import realFavicon from "gulp-real-favicon";
import through2 from "through2";
import { globSync } from "glob";

//
//
//
//
// Обрезка изображений

export const resizeSettings = yargs(hideBin(process.argv))
  .option("mobile", {
    alias: "m",
    type: "boolean",
    default: false,
  })
  .option("percentage", {
    alias: "p",
    type: "number",
    default: null,
  })
  .option("width", {
    alias: "w",
    type: "number",
    default: null,
  })
  .option("folder", {
    alias: "f",
    type: "string",
    default: "",
  }).argv;

const basePath = resizeSettings.folder ? `src/assets/img/${resizeSettings.folder}` : "src/assets/img/resize";
const outputPath = resizeSettings._[1] ? `src/assets/img/${resizeSettings._[1]}` : basePath;

const resizeImg = () => {
  const resizeOptions = {
    cover: true,
    crop: false,
    upscale: true,
  };

  if (resizeSettings.percentage) {
    resizeOptions.percentage = resizeSettings.percentage;
  } else if (resizeSettings.width) {
    resizeOptions.width = resizeSettings.width;
  } else {
    resizeOptions.width = 1000;
  }

  return gulp
    .src(`${basePath}/**/*.{jpg,jpeg,png}`)
    .pipe(gulp.dest(resizeSettings.mobile ? basePath : `${basePath}/old`))
    .pipe(resize(resizeOptions))
    .pipe(
      rename(function (path) {
        if (resizeSettings.mobile) {
          path.basename += "_mobile";
        }
      })
    )
    .pipe(gulp.dest(outputPath));
};

gulp.task("resize", resizeImg);

//
//
//
//
// Фавикон

const favicon = () => {
  realFavicon.generateFavicon(
    {
      masterPicture: "src/assets/img/favicon.svg",
      dest: "src/assets/img/favicon",
      iconsPath: "/assets/img/favicon/",
      design: {
        ios: {
          pictureAspect: "noChange",
          assets: {
            ios6AndPriorIcons: false,
            ios7AndLaterIcons: false,
            precomposedIcons: false,
            declareOnlyDefaultIcon: true,
          },
        },
        desktopBrowser: {
          design: "raw",
        },
        windows: {
          pictureAspect: "noChange",
          backgroundColor: "#da532c",
          onConflict: "override",
          assets: {
            windows80Ie10Tile: false,
            windows10Ie11EdgeTiles: {
              small: false,
              medium: true,
              big: false,
              rectangle: false,
            },
          },
        },
        androidChrome: {
          pictureAspect: "noChange",
          themeColor: "#ffffff",
          manifest: {
            display: "standalone",
            orientation: "notSet",
            onConflict: "override",
            declared: true,
          },
          assets: {
            legacyIcon: false,
            lowResolutionIcons: false,
          },
        },
        safariPinnedTab: {
          pictureAspect: "silhouette",
          themeColor: "#5bbad5",
        },
      },
      settings: {
        scalingAlgorithm: "Mitchell",
        errorOnImageTooSmall: false,
        readmeFile: false,
        htmlCodeFile: false,
        usePathAsIs: false,
      },
      markupFile: "faviconData.json",
    },
    function () {}
  );
};

gulp.task("favicon", favicon);

//
//
//
//
// Бэкап

function getTimestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");

  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function cleanupTemp({ keepLast = 3, step = 3, max = 9 } = {}) {
  const dir = "temp";
  if (!fs.existsSync(dir)) return;

  const folders = fs
    .readdirSync(dir)
    .map((name) => ({
      name,
      time: fs.statSync(path.join(dir, name)).mtime.getTime(),
    }))
    .sort((a, b) => a.time - b.time);

  if (folders.length <= max) return;

  const keep = new Set();
  const total = folders.length;

  folders.slice(-keepLast).forEach((f) => keep.add(f.name));

  for (let i = 0; i < total - keepLast; i++) {
    if ((i + 1) % step === 2) {
      keep.add(folders[i].name);
    }
  }

  if (keep.size > max) {
    const orderedKeep = folders.filter((f) => keep.has(f.name)).slice(-max);

    keep.clear();
    orderedKeep.forEach((f) => keep.add(f.name));
  }

  folders.forEach((f) => {
    if (!keep.has(f.name)) {
      fs.rmSync(path.join(dir, f.name), {
        recursive: true,
        force: true,
      });
    }
  });
}

export function temp() {
  if (project_folder === "template") {
    return Promise.resolve();
  }

  cleanupTemp({
    keepLast: 3, // сколько последних хранить
    step: 3, // помимо последних еще хранятся каждые step бэкапов
    max: 9, // максимум бэкапов для хранения
  });

  return src(`${source_folder}/**/*`, { dot: true }).pipe(dest(`temp/${getTimestamp()}`));
}

//
//
//
//
// Шрифты

const fonts = () => {
  return new Promise((resolve, reject) => {
    fs.writeFile(paths.src.fontcss, "", (err) => {
      if (err) return reject(err);

      fs.readdir(paths.src.fontsDir, (err, items) => {
        if (err) return reject(err);

        const fonts = items.filter((item) => item.endsWith(".woff2"));

        if (!fonts.length) return resolve();

        Promise.all(
          fonts.map((item) => {
            return new Promise((res, rej) => {
              const fontname = path.parse(item).name;
              const style = fontname.split("-")[1];
              let weight = 400;

              switch (style) {
                case "Thin":
                  weight = 100;
                  break;
                case "ExtraLight":
                  weight = 200;
                  break;
                case "Light":
                  weight = 300;
                  break;
                case "Regular":
                  weight = 400;
                  break;
                case "Medium":
                  weight = 500;
                  break;
                case "SemiBold":
                  weight = 600;
                  break;
                case "Bold":
                  weight = 700;
                  break;
                case "ExtraBold":
                  weight = 800;
                  break;
                case "Black":
                  weight = 900;
                  break;
              }

              const fontFace = dedent(`
                @font-face {
                  font-family: '${fontname.split("-")[0]}';
                  src: url('../fonts/${fontname}.woff2');
                  font-weight: ${weight};
                  font-style: normal;
                  font-display: block;
                }
              `);

              fs.appendFile(paths.src.fontcss, fontFace, (err) => (err ? rej(err) : res()));
            });
          })
        )
          .then(resolve)
          .catch(reject);
      });
    });
  });
};

gulp.task("fonts", fonts);

//
//
//
//
// Объединение библиотек
export const concat = () => {
  const headPath = "src/assets/html/head.html";
  const footPath = "src/assets/html/foot.html";

  let head = fs.readFileSync(headPath, "utf8");
  let foot = fs.readFileSync(footPath, "utf8");

  const headRe = /(^[ \t]*)<!-- Библиотеки -->[\s\S]*?\n\1<!-- Общие стили -->/m;
  const footRe = /(^[ \t]*)<!-- Библиотеки -->[\s\S]*?\n\1<!-- Общие скрипты -->/m;

  // =========================
  // concatLibs === true
  // =========================
  if (concatLibs) {
    head = head.replace(headRe, (_, indent) => [`${indent}<!-- Библиотеки -->`, `${indent}<link rel="preload" href="assets/css/vendor.css" as="style" onload="this.rel='stylesheet'; this.media='all'; this.onload=null;">`, ``, `${indent}<!-- Общие стили -->`].join("\n"));

    foot = foot.replace(footRe, (_, indent) => [`${indent}<!-- Библиотеки -->`, `${indent}<script src="assets/js/vendor.js" defer></script>`, ``, `${indent}<!-- Общие скрипты -->`].join("\n"));

    fs.writeFileSync(headPath, head);
    fs.writeFileSync(footPath, foot);
    return Promise.resolve();
  }

  // =========================
  // concatLibs === false
  // =========================

  head = head.replace(headRe, (_, indent) => {
    const styles = globSync(paths.src.cssLibsFiles)
      .reverse()
      .map((file) => `${indent}<link rel="preload" href="assets/css/${path.basename(file)}" as="style" onload="this.rel='stylesheet'; this.media='all'; this.onload=null;">`)
      .join("\n");

    return [`${indent}<!-- Библиотеки -->`, styles, ``, `${indent}<!-- Общие стили -->`].join("\n");
  });

  foot = foot.replace(footRe, (_, indent) => {
    const scripts = globSync(paths.src.jsLibsFiles)
      .reverse()
      .map((file) => `${indent}<script src="assets/js/${path.basename(file)}" defer></script>`)
      .join("\n");

    return [`${indent}<!-- Библиотеки -->`, scripts, ``, `${indent}<!-- Общие скрипты -->`].join("\n");
  });

  fs.writeFileSync(headPath, head);
  fs.writeFileSync(footPath, foot);

  return Promise.resolve();
};

gulp.task("concat", concat);

//
//
//
//
// Создание файлов

const cleanDir = (dir, allowed, ignore = []) => {
  const allowedSet = new Set(allowed);

  fs.readdirSync(dir).forEach((file) => {
    const name = file.split(".")[0].replace(/^_/, "");
    if (!allowedSet.has(name) && !ignore.includes(name)) {
      fs.unlinkSync(path.join(dir, file));
    }
  });
};

const appendImportsToBottom = (filePath, imports) => {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");

  const lines = content.split("\n");

  // оставляем всё до первого динамического @import
  const cleaned = [];
  for (const line of lines) {
    if (/^@import\s+["'](_|components\/_)/.test(line.trim())) break;
    cleaned.push(line);
  }

  const base = cleaned.join("\n").trimEnd();

  const result = imports.length ? `${base}\n\n${imports.join("\n")}\n` : `${base}\n`;

  fs.writeFileSync(filePath, result);
};

export function dedent(str) {
  const lines = str.split("\n");

  while (lines[0]?.trim() === "") lines.shift();
  while (lines[lines.length - 1]?.trim() === "") lines.pop();

  const minIndent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^\s*/)[0].length));

  return lines.map((l) => l.slice(minIndent)).join("\n");
}

const create = () => {
  /* ---------------- HTML ---------------- */
  const htmlTpl = dedent(`
    @@include('assets/html/head.html', {
    "class": ""
    })
    @@include("assets/html/crumbs.html", {
    "list": [{
    "title":"Контакты",
    "link":"#"
    }]
    })

    @@include('assets/html/foot.html')
  `);

  getFiles.html.sort().forEach((name) => {
    const file = `${paths.src.htmlFiles}${name}.html`;
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, htmlTpl);
    }
  });

  /* ---------------- SASS: components ---------------- */

  const componentsImports = getFiles.components.sort().map((name) => `@import "components/_${name}"`);

  appendImportsToBottom(`${source_folder}/assets/sass/components.sass`, componentsImports);

  cleanDir(paths.src.sassComponents, getFiles.components, ["burger"]);

  /* ---------------- SASS: blocks ---------------- */

  const skip = new Set(["style", "fonts", "all", "components"]);

  const blocksImports = getFiles.sass
    .filter((name) => !skip.has(name))
    .sort()
    .map((name) => `@import "_${name}"`);

  appendImportsToBottom(`${source_folder}/assets/sass/blocks.sass`, blocksImports);

  /* ---------------- SASS files ---------------- */

  getFiles.sass.forEach((name) => {
    const file = `${paths.src.sass}_${name}.sass`;
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, `//.${name}\n`);
    }
  });

  /* ---------------- JS components ---------------- */

  if (replaceScripts) {
    const js = getFiles.jsScripts;
    const imports = js.map((name) => `import { ${name} } from './components/${name}'`).join("\n");
    const calls = js.map((name) => `${name}()`).join("\n");

    fs.writeFileSync(`${source_folder}/assets/js/components.js`, `${imports}\n\n${calls}\n`);

    cleanDir(paths.src.jsComponents, js, ["variable"]);
  }

  /* ---------------- JS libs ---------------- */

  cleanDir(paths.src.jsLibs, getFiles.jsLibs);

  /* ---------------- CSS libs ---------------- */

  cleanDir(paths.src.cssLibs, getFiles.cssLibs);

  /* ---------------- CSS variables ---------------- */

  const v = variables;

  fs.writeFileSync(
    paths.src.cssvariables,
    dedent(`
      $active: ${v.active}
      $gray: ${v.gray}
      $text: ${v.text}
      $bg: ${v.bg}
      $border-radius: ${v.borderRadius}

      $minWidth: ${v.minWidth}
      $maxWidth: ${v.maxWidth}
      $containerWidth: ${v.containerWidth}
      $container: ${v.container}
      $firstBreakpoint: ${v.firstBreakpoint}
      $section_gap: ${v.section_gap}
      $burgerMedia: ${v.burgerMedia}

      $font: '${v.font}'
    `)
  );
};

gulp.task("create", gulp.series(concat, create));

//
//
//
//
// Создание карты сайта

function sitemap(cb) {
  const pageTitles = {
    index: "Главная",
    about: "О нас",
    blog: "Блог",
    brands: "Бренды",
    catalog: "Каталог",
    category: "Категории",
    compare: "Сравнение",
    contact: "Контакты",
    faq: "Вопрос-ответ",
    feedback: "Отзывы",
    license: "Лицензии",
    news: "Новости",
    production: "Продукция",
    project: "Проекты",
    "single-project": "Проект",
    services: "Услуги",
    search: "Поиск",
    "search-empty": "Поиск - ничего не найдено",
    "single-category": "Категория",
    "single-product": "Товар",
    "single-services": "Услуга",
    "single-news": "Статья",
    text: "Текстовая",
    vacancy: "Вакансии",
    video: "Видео",
    wishlist: "Избранное",
  };

  const htmlFiles = fs
    .readdirSync(paths.src.htmlFiles)
    .filter((file) => file.endsWith(".html") && file !== "sitemap.html")
    .map((file) => {
      const name = path.basename(file, ".html");
      return {
        file: file,
        name: name,
        title: pageTitles[name] || name,
        path: file === "index.html" ? `/${project_folder}` : file,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title, "ru"));

  const links = htmlFiles.map((page) => `<li><a target="_blank" href="${page.path}">${page.title}</a></li>`).join("\n\t\t\t\t");

  const sitemapContent = dedent(`
    @@include('assets/html/head.html', {
    "class": '""'
    })
    @@include("assets/html/crumbs.html", {
    "list": [{
    "title": "Карта сайта",
    "link": "'#'"
    }]
    })

    <!-- Карта сайта -->
    <div class="section">
      <div class="container">
        <div class="text-block">
          <ul>
            ${links}
            <li><a data-modal="popup-call">Заказать звонок</a></li>
            <li><a data-modal="popup-thank">Спасибо</a></li>
          </ul>
        </div>
      </div>
    </div>

    @@include('assets/html/foot.html')
  `);

  const sitemapPath = path.join("src", "sitemap.html");

  fs.writeFile(sitemapPath, sitemapContent.trim(), (err) => {
    if (err) return cb(err);

    console.log("\n\n ✅ Карта сайта создана \n\n\n");

    cb();
  });
}

gulp.task("sitemap", sitemap);

//
//
//
//
// Очистка страниц от неиспользуемых библиотек
export const cleanScripts = () => {
  if (!concatLibs) {
    return gulp
      .src(project_folder + "/*.html")
      .pipe(
        posthtml([
          (tree) => {
            const hasNode = (check) => {
              let found = false;

              tree.walk((node) => {
                if (!node || !node.tag) return node;

                if (check(node)) {
                  found = true;
                }

                return node;
              });

              return found;
            };

            const removeIfNot = (match, condition) => {
              if (!condition()) {
                tree.walk((node) => {
                  if (!node || !node.tag) return node;

                  if (node.tag === match.tag && node.attrs && Object.entries(match.attrs).every(([key, val]) => node.attrs[key] && val.test(node.attrs[key]))) {
                    return null;
                  }

                  return node;
                });
              }
            };

            const hasDynamic = () => hasNode((node) => node.attrs && Object.prototype.hasOwnProperty.call(node.attrs, "data-da"));
            const hasNotify = () => hasNode((node) => node.attrs && Object.prototype.hasOwnProperty.call(node.attrs, "data-notify"));
            const hasGallery = () => hasNode((node) => node.attrs && Object.prototype.hasOwnProperty.call(node.attrs, "data-gallery"));
            const hasSwiper = () => hasNode((node) => node.attrs && node.attrs.class && node.attrs.class.includes("swiper"));
            const hasWow = () => hasNode((node) => node.attrs && node.attrs.class && node.attrs.class.includes("wow"));
            const hasInputDate = () => hasNode((node) => node.tag === "input" && node.attrs && node.attrs.class && node.attrs.class.includes("input-date"));
            const hasSelect = () => hasNode((node) => node.tag === "select");
            const hasTimer = () => hasNode((node) => node.attrs && node.attrs.class && node.attrs.class.includes("timer"));

            removeIfNot({ tag: "script", attrs: { src: /dynamic/ } }, hasDynamic);

            removeIfNot({ tag: "script", attrs: { src: /notify/ } }, hasNotify);

            removeIfNot({ tag: "script", attrs: { src: /lg/ } }, hasGallery);
            removeIfNot({ tag: "link", attrs: { href: /lg/ } }, hasGallery);

            removeIfNot({ tag: "script", attrs: { src: /swiper/ } }, hasSwiper);
            removeIfNot({ tag: "link", attrs: { href: /swiper/ } }, hasSwiper);

            removeIfNot({ tag: "script", attrs: { src: /wow/ } }, hasWow);
            removeIfNot({ tag: "link", attrs: { href: /animate/ } }, hasWow);

            removeIfNot({ tag: "script", attrs: { src: /date/ } }, hasInputDate);
            removeIfNot({ tag: "link", attrs: { href: /date/ } }, hasInputDate);

            removeIfNot({ tag: "script", attrs: { src: /select/ } }, hasSelect);
            removeIfNot({ tag: "link", attrs: { href: /select/ } }, hasSelect);

            removeIfNot({ tag: "script", attrs: { src: /timer/ } }, hasTimer);

            return tree;
          },
        ])
      )
      .pipe(
        through2.obj(function (file, _, cb) {
          if (file.isBuffer()) {
            let html = file.contents.toString();

            html = html.replace(/<\/script>\s*\n\s*\n\s*(<script)/g, "</script>\n\t$1");
            html = html.replace(/\n\s*\n\s*\n+/g, "\n\n");

            file.contents = Buffer.from(html);
          }

          cb(null, file);
        })
      )
      .pipe(gulp.dest(project_folder));
  }

  return Promise.resolve();
};

gulp.task("clean", cleanScripts);

function cb() {}

export { resizeImg, favicon, fonts, create, sitemap };
