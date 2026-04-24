/**
 * Generate Next.js app-icon variants from a single source PNG.
 *
 * Next.js 16 file conventions (src/app/):
 *   - icon.png        — 32×32   browser tab
 *   - icon1.png       — 192×192 PWA / Android
 *   - icon2.png       — 512×512 PWA / Android high-res
 *   - apple-icon.png  — 180×180 iOS home screen
 *
 * The legacy src/app/favicon.ico (from create-next-app) is removed —
 * modern browsers pick up icon.png, and Next.js injects the correct <link> tags.
 *
 * Usage:
 *   npm run generate:favicon -- <path-to-source.png>
 *
 * Source image should be square and at least 512×512 for best results.
 */

import sharp from "sharp";
import { existsSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const appDir = join(repoRoot, "src", "app");

interface Variant {
  filename: string;
  size: number;
}

const VARIANTS: Variant[] = [
  { filename: "icon.png", size: 32 },
  { filename: "icon1.png", size: 192 },
  { filename: "icon2.png", size: 512 },
  { filename: "apple-icon.png", size: 180 },
];

async function main() {
  const sourceArg = process.argv[2];
  if (!sourceArg) {
    console.error("Usage: npm run generate:favicon -- <path-to-source.png>");
    process.exit(1);
  }

  const sourcePath = resolve(sourceArg);
  if (!existsSync(sourcePath)) {
    console.error(`Source file not found: ${sourcePath}`);
    process.exit(1);
  }

  const { width, height, format } = await sharp(sourcePath).metadata();
  if (format !== "png") {
    console.warn(`Warning: source is ${format}, not png — continuing anyway.`);
  }
  if (!width || !height || width !== height) {
    console.warn(
      `Warning: source is ${width}×${height} (not square) — output will be stretched.`,
    );
  }
  if (width && width < 512) {
    console.warn(
      `Warning: source is ${width}px wide; 512px+ recommended for crisp output.`,
    );
  }

  for (const { filename, size } of VARIANTS) {
    const outPath = join(appDir, filename);
    await sharp(sourcePath)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(outPath);
    console.log(`✓ ${filename}  ${size}×${size}`);
  }

  const legacyFavicon = join(appDir, "favicon.ico");
  if (existsSync(legacyFavicon)) {
    rmSync(legacyFavicon);
    console.log("✓ removed legacy favicon.ico");
  }

  console.log("\nDone. Restart `npm run dev` if it's running to pick up the new icons.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
