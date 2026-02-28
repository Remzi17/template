import fs from "fs";
import path from "path";
import { performance } from "perf_hooks";

const FILE = path.resolve("statistics.json");

let cache = null;
let writeTimer = null;
let buildStart = 0;

// ---------- INIT ----------

function load() {
  if (cache) return cache;

  if (!fs.existsSync(FILE)) {
    cache = { sessions: [], files: {}, builds: [] };
    return cache;
  }

  try {
    cache = JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    cache = { sessions: [], files: {}, builds: [] };
  }

  return cache;
}

function save() {
  if (writeTimer) clearTimeout(writeTimer);

  writeTimer = setTimeout(() => {
    fs.writeFileSync(FILE, JSON.stringify(cache, null, 2));
  }, 200);
}

function today() {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}`;
}

// ---------- SESSION ----------

export function startSession() {
  const data = load();
  data.sessions.push({
    date: today(),
    start: Date.now(),
    end: null,
  });
  save();
}

export function endSession() {
  const data = load();
  const s = data.sessions.at(-1);
  if (s && !s.end) s.end = Date.now();
  save();
}

// ---------- FILE TRACKING ----------

export function trackFile(filePath) {
  if (!filePath) return;

  const name = path.basename(filePath);
  if (name.startsWith("__") || name.startsWith(".") || name.endsWith(".map")) return;

  const data = load();
  data.files[name] = (data.files[name] || 0) + 1;
  save();
}

// ---------- BUILD TIMER ----------

export function buildStartTimer() {
  buildStart = performance.now();
}

export function buildEndTimer() {
  const data = load();
  data.builds.push({
    time: Math.round(performance.now() - buildStart),
    date: today(),
  });
  save();
}

export function showStats(filter = "all") {
  const data = read();
  const a = calc(data);

  console.log("\n📊 СТАТИСТИКА ПРОЕКТА\n");

  if (filter === "all" || filter === "time") {
    console.log(`⏱ Общее время: ${format(a.total)}`);
    console.log(`📆 Самый продуктивный день: ${a.topDay?.[0] || "—"}`);
    console.log(`🔁 Сессий: ${a.sessions}`);
    console.log(`📏 Средняя сессия: ${format(a.avgSession)}\n`);
  }

  if (filter === "all" || filter === "files") {
    console.log("🔥 Топ файлов:");
    a.files.forEach(([f, c]) => console.log(`  ${f} — ${c}`));
    console.log();
  }
}
