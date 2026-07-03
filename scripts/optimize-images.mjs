// Optimise en place les images de public/ : cap la largeur à MAX_WIDTH et
// recompresse (JPEG mozjpeg / PNG palette), sans changer le format ni le nom
// (donc aucun chemin d'image du site n'est cassé). N'écrase un fichier que si
// la version optimisée est plus légère.
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import sharp from "sharp";

const ROOT = "public";
const MAX_WIDTH = 2000;
const JPEG_QUALITY = 80;
const PNG_QUALITY = 85;
const EXTS = new Set([".jpg", ".jpeg", ".png"]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (EXTS.has(extname(entry.name).toLowerCase())) yield p;
  }
}

let before = 0;
let after = 0;
let changed = 0;
const bigWins = [];

for await (const file of walk(ROOT)) {
  const orig = await readFile(file);
  const meta = await sharp(orig).metadata();
  let pipe = sharp(orig).rotate();
  if (meta.width > MAX_WIDTH) pipe = pipe.resize({ width: MAX_WIDTH });

  const ext = extname(file).toLowerCase();
  if (ext === ".png") {
    pipe = pipe.png({ quality: PNG_QUALITY, effort: 8, compressionLevel: 9 });
  } else {
    pipe = pipe.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  }

  const out = await pipe.toBuffer();
  before += orig.length;

  if (out.length < orig.length) {
    await writeFile(file, out);
    after += out.length;
    changed++;
    const savedMB = (orig.length - out.length) / 1e6;
    if (savedMB > 0.5) bigWins.push({ file, from: orig.length, to: out.length });
  } else {
    after += orig.length; // on garde l'original
  }
}

const mb = (n) => (n / 1e6).toFixed(1) + " MB";
bigWins.sort((a, b) => b.from - b.to - (a.from - a.to));
console.log("\n=== Plus grosses réductions ===");
for (const w of bigWins.slice(0, 12)) {
  console.log(`${mb(w.from)} -> ${mb(w.to)}  ${w.file}`);
}
console.log("\n=== TOTAL ===");
console.log(`Fichiers optimisés : ${changed}`);
console.log(`Avant : ${mb(before)}  |  Après : ${mb(after)}  |  Gain : ${mb(before - after)} (${Math.round((1 - after / before) * 100)}%)`);
