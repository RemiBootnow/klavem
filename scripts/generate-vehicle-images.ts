/**
 * Generate studio-photo vehicle images via Gemini 2.5 Flash Image ("Nano Banana").
 *
 * Four views per vehicle:
 *   - front    (hero three-quarter, bg removed via Photoroom + AI shadow, 1200×800)  → {slug}.png
 *   - side     (90° profile, environmental, no bg removal, 2048×1365)                → {slug}-side.png
 *   - rear     (45° rear three-quarter, golden hour, no bg removal, 2048×1365)       → {slug}-rear.png
 *   - interior (wide-angle cockpit, no bg removal, 2048×1365)                        → {slug}-interior.png
 *
 * Required env:
 *   GEMINI_API_KEY     — https://aistudio.google.com/apikey
 *   PHOTOROOM_API_KEY  — https://app.photoroom.com/api-dashboard  (only needed for `front`)
 *
 * Usage:
 *   npm run generate:vehicle-images                                 # default: front view
 *   npm run generate:vehicle-images -- --view side                  # one view, all vehicles
 *   npm run generate:vehicle-images -- --view all                   # all 4 views, all vehicles
 *   npm run generate:vehicle-images -- --view all --slug tesla-model-3 --force
 */

import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vehicles from "../content/vehicles.json" with { type: "json" };

interface Vehicle {
  slug: string;
  brand: string;
  model: string;
  variant: string | null;
  yearFrom: number;
  yearTo: number;
}

type ViewName =
  | "front"
  | "side"
  | "rear"
  | "interior-rear"
  | "interior-cockpit";
const ALL_VIEWS: ViewName[] = [
  "front",
  "side",
  "rear",
  "interior-rear",
  "interior-cockpit",
];

interface ViewConfig {
  filename: (slug: string) => string;
  width: number;
  height: number;
  aspectRatio: "3:2" | "4:3" | "16:9" | "1:1";
  removeBackground: boolean;
  addShadow: boolean;
  promptBuilder: (v: Vehicle, vehicleLabel: string) => string;
}

const GEMINI_MODEL = "gemini-3.1-flash-image-preview";
const DELAY_MS = 1500;
const PHOTOROOM_URL = "https://image-api.photoroom.com/v2/edit";
const COLOR = "solid pure black (jet black paint, no blue tint, no grey, no dark blue, no navy)";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const outputDir = join(repoRoot, "public", "vehicules");

function labelFor(vehicle: Vehicle): string {
  const variant =
    vehicle.variant && !/^Phase \d+$/i.test(vehicle.variant)
      ? ` ${vehicle.variant.replace(/\s*Phase \d+$/i, "").trim()}`
      : "";
  return `${vehicle.model}${variant}`.trim();
}

const VIEWS: Record<ViewName, ViewConfig> = {
  front: {
    filename: (slug) => `${slug}/1.png`,
    width: 2048,
    height: 1365,
    aspectRatio: "3:2",
    removeBackground: true,
    addShadow: true,
    promptBuilder: (vehicle, label) => `Professional automotive studio photograph of a ${vehicle.yearTo} ${vehicle.brand} ${label} in ${COLOR} finish. Wide landscape format, 3:2 widescreen aspect ratio.

Composition: Front three-quarter view from the driver's side, camera positioned slightly low (approximately bumper height), lens at about 35-40mm equivalent. The vehicle is centered in the frame, facing toward the left at a ~30 degree angle so both the full front fascia and driver-side profile are clearly visible. Wheels turned slightly toward the camera. The car occupies roughly 80% of the frame width.

Lighting: Clean, even studio lighting with soft diffused highlights along the hood, roofline, and side panels. Subtle rim light defining the silhouette. Gentle specular highlights on the headlights, grille, and wheels. No harsh reflections, no visible light sources in the body panels.

Background: Pure solid white (#FFFFFF), completely seamless, completely empty. No floor, no ground plane, no horizon line, no shadow, no gradient, no environment, no reflections of any kind on the ground. The car appears to float on a clean white background.

Body paint: the car must be pure black (#000000) — under no circumstances blue, navy, dark blue, graphite, or grey. If in doubt, err toward black-crow / obsidian, never toward blue.

Style: High-resolution commercial catalog photography, sharp focus throughout, photorealistic, factory-fresh condition, clean body panels, no dirt or scratches, no license plate text, no dealership branding, no people, no text, no additional graphics or annotations.`,
  },

  side: {
    filename: (slug) => `${slug}/2.png`,
    width: 2048,
    height: 1365,
    aspectRatio: "3:2",
    removeBackground: true,
    addShadow: true,
    promptBuilder: (vehicle, label) => `Professional automotive studio photograph of a ${vehicle.yearTo} ${vehicle.brand} ${label} in ${COLOR}, captured in a pure side profile view at a perfect 90-degree angle. The entire vehicle is centered in frame with equal space on both sides. Shot with a long telephoto lens (around 200mm) to eliminate perspective distortion, camera positioned at the car's beltline height. Wide landscape format, 3:2 widescreen aspect ratio.

Lighting: Clean, even, soft studio lighting directional from the front-side to emphasize the bodyline, door creases, and wheel design without harsh shadows. Crisp reflections along the doors reveal the car's curvature. Tires sharp, wheels clean and detailed.

Background: Pure solid white (#FFFFFF), completely seamless, completely empty. No floor, no ground plane, no horizon line, no shadow, no gradient, no environment, no reflections of any kind on the ground. The car appears to float on a clean white background.

Body paint: the car must be pure black (#000000) — under no circumstances blue, navy, dark blue, graphite, or grey. If in doubt, err toward black-crow / obsidian, never toward blue.

Style: Ultra-high resolution, photorealistic, commercial catalog quality, factory-fresh condition, clean body panels, no dirt or scratches, no license plate text, no dealership branding, no people, no text, no additional graphics or annotations.`,
  },

  rear: {
    filename: (slug) => `${slug}/3.png`,
    width: 2048,
    height: 1365,
    aspectRatio: "3:2",
    removeBackground: true,
    addShadow: true,
    promptBuilder: (vehicle, label) => `Professional automotive studio photograph of a ${vehicle.yearTo} ${vehicle.brand} ${label} in ${COLOR}, shot from the rear three-quarter angle (approximately 45 degrees behind the vehicle, from the driver's side). Camera at roughly hip height, lens around 50–85mm for natural proportions. The framing reveals the full rear end — taillights, badge, bumper, exhaust — along with the rear door, rear wheel, and a hint of the roofline. Wide landscape format, 3:2 widescreen aspect ratio.

Lighting: Clean, even studio lighting with soft diffused highlights. Taillights softly glowing. Reflections on the paint show depth and gloss. Gentle specular highlights on the chrome accents and wheels.

Background: Pure solid white (#FFFFFF), completely seamless, completely empty. No floor, no ground plane, no horizon line, no shadow, no gradient, no environment, no reflections of any kind on the ground. The car appears to float on a clean white background.

Body paint: the car must be pure black (#000000) — under no circumstances blue, navy, dark blue, graphite, or grey. If in doubt, err toward black-crow / obsidian, never toward blue.

Style: High-resolution commercial catalog photography, sharp focus throughout, photorealistic, factory-fresh condition, clean body panels, no dirt or scratches, no license plate text, no dealership branding, no people, no text, no additional graphics or annotations.`,
  },

  "interior-rear": {
    filename: (slug) => `${slug}/4.png`,
    width: 2048,
    height: 1365,
    aspectRatio: "3:2",
    removeBackground: false,
    addShadow: false,
    promptBuilder: (vehicle, label) => `Photorealistic interior photograph of a ${vehicle.yearTo} ${vehicle.brand} ${label}, showing the rear passenger area.

Camera: inside the cabin near the front passenger headrest, wide-angle 20mm lens, angled back and slightly down toward the rear bench. 3:2 widescreen, landscape orientation.

Lighting: soft and even interior light, dark cabin materials. All glass (windshield, side windows, rear window, sunroof, glass roof) is perfectly clear and untinted — no blue tint, no UV filter, no gradient on the glass itself. Outside every window: flat solid Pantone Cool Gray 1 C (very light, pale, near-white neutral grey) only — no sky, no environment, no buildings, no landscape, no gradient, no color variation.

No people, no text, no watermarks. Ultra-sharp focus, premium automotive catalog quality.`,
  },

  "interior-cockpit": {
    filename: (slug) => `${slug}/5.png`,
    width: 2048,
    height: 1365,
    aspectRatio: "3:2",
    removeBackground: false,
    addShadow: false,
    promptBuilder: (vehicle, label) => `Photorealistic interior photograph of a ${vehicle.yearTo} ${vehicle.brand} ${label}, showing the driver's cockpit.

Camera: inside the cabin at the rear passenger side, wide-angle 20mm lens, angled forward and slightly down toward the driver's seat and dashboard. Front passenger seat partially visible in the foreground on the left edge. 3:2 widescreen, landscape orientation.

Lighting: soft and even interior light, dark cabin materials. Any glowing screens emit soft light accents. All glass (windshield, side windows, rear window, sunroof, glass roof) is perfectly clear and untinted — no blue tint, no UV filter, no gradient on the glass itself. Outside every window: flat solid Pantone Cool Gray 1 C (very light, pale, near-white neutral grey) only — no sky, no environment, no buildings, no landscape, no gradient, no color variation.

No people, no text, no watermarks. Ultra-sharp focus, premium automotive catalog quality.`,
  },
};

const ASPECT_TOLERANCE = 0.1;
const MAX_ASPECT_RETRIES = 3;

async function generateWithGemini(
  ai: GoogleGenAI,
  vehicle: Vehicle,
  view: ViewConfig
): Promise<Buffer> {
  const label = labelFor(vehicle);
  const targetAspect = view.width / view.height;

  for (let attempt = 1; attempt <= MAX_ASPECT_RETRIES; attempt++) {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: view.promptBuilder(vehicle, label),
      config: {
        responseModalities: ["IMAGE"],
        imageConfig: {
          aspectRatio: view.aspectRatio,
          imageSize: "2K",
        },
      } as Parameters<typeof ai.models.generateContent>[0]["config"],
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    let imageBuffer: Buffer | null = null;
    for (const part of parts) {
      if (part.inlineData?.data) {
        imageBuffer = Buffer.from(part.inlineData.data, "base64");
        break;
      }
    }
    if (!imageBuffer) throw new Error("Gemini returned no image");

    const meta = await sharp(imageBuffer).metadata();
    if (!meta.width || !meta.height) {
      throw new Error("Could not read Gemini output dimensions");
    }
    const actualAspect = meta.width / meta.height;
    const ratioError = Math.abs(actualAspect - targetAspect) / targetAspect;

    if (ratioError <= ASPECT_TOLERANCE) {
      return imageBuffer;
    }

    console.log(
      `    aspect mismatch (attempt ${attempt}/${MAX_ASPECT_RETRIES}): got ${meta.width}x${meta.height} (${actualAspect.toFixed(3)}), want ~${targetAspect.toFixed(3)} — retrying`
    );

    if (attempt < MAX_ASPECT_RETRIES) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error(
    `Gemini refused to produce ${view.aspectRatio} after ${MAX_ASPECT_RETRIES} attempts`
  );
}

async function removeBackgroundWithPhotoroom(
  input: Buffer,
  apiKey: string,
  addShadow: boolean
): Promise<Buffer> {
  const form = new FormData();
  form.append(
    "imageFile",
    new Blob([new Uint8Array(input)], { type: "image/png" }),
    "input.png"
  );
  form.append("removeBackground", "true");
  form.append("outputSize", "originalImage");
  form.append("referenceBox", "originalImage");
  if (addShadow) form.append("shadow.mode", "ai.soft");

  const res = await fetch(PHOTOROOM_URL, {
    method: "POST",
    headers: { "x-api-key": apiKey, Accept: "image/png" },
    body: form,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Photoroom ${res.status}: ${body.slice(0, 300)}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

async function normalize(
  input: Buffer,
  view: ViewConfig
): Promise<Buffer> {
  const resizer = sharp(input).resize({
    width: view.width,
    height: view.height,
    fit: "contain",
    kernel: "lanczos3",
    background: view.removeBackground
      ? { r: 0, g: 0, b: 0, alpha: 0 }
      : { r: 247, g: 247, b: 247, alpha: 1 }, // #F7F7F7
  });
  return resizer.png().toBuffer();
}

async function processOne(
  ai: GoogleGenAI,
  vehicle: Vehicle,
  view: ViewConfig,
  photoroomKey: string | null
): Promise<"generated" | "failed"> {
  const outputPath = join(outputDir, view.filename(vehicle.slug));
  const outputParent = dirname(outputPath);
  if (!existsSync(outputParent)) mkdirSync(outputParent, { recursive: true });
  const rawDir = join(outputParent, "raw");
  if (!existsSync(rawDir)) mkdirSync(rawDir, { recursive: true });
  const rawPath = join(rawDir, basename(outputPath));
  try {
    const raw = await generateWithGemini(ai, vehicle, view);
    writeFileSync(rawPath, raw);
    console.log(`  ✓ ${rawPath} (raw Gemini)`);
    const processed =
      view.removeBackground && photoroomKey
        ? await removeBackgroundWithPhotoroom(raw, photoroomKey, view.addShadow)
        : raw;
    const final = await normalize(processed, view);
    writeFileSync(outputPath, final);
    console.log(`  ✓ ${outputPath}`);
    return "generated";
  } catch (err) {
    console.log(`  ✗ error: ${(err as Error).message}`);
    return "failed";
  }
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const slugIdx = args.indexOf("--slug");
  const onlySlug = slugIdx >= 0 ? args[slugIdx + 1] : null;
  const viewIdx = args.indexOf("--view");
  const viewArg = viewIdx >= 0 ? args[viewIdx + 1] : "front";

  let selectedViews: ViewName[];
  if (viewArg === "all") {
    selectedViews = ALL_VIEWS;
  } else if (ALL_VIEWS.includes(viewArg as ViewName)) {
    selectedViews = [viewArg as ViewName];
  } else {
    console.error(
      `Unknown view "${viewArg}". Valid: ${ALL_VIEWS.join(", ")}, all`
    );
    process.exit(1);
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    console.error("Error: GEMINI_API_KEY is required.");
    process.exit(1);
  }

  const needsPhotoroom = selectedViews.some((v) => VIEWS[v].removeBackground);
  const photoroomKey = process.env.PHOTOROOM_API_KEY ?? null;
  if (needsPhotoroom && !photoroomKey) {
    console.error(
      "Error: PHOTOROOM_API_KEY is required for the 'front' view."
    );
    process.exit(1);
  }

  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  const ai = new GoogleGenAI({ apiKey: geminiKey });
  const list = (vehicles as Vehicle[]).filter(
    (v) => !onlySlug || v.slug === onlySlug
  );

  if (list.length === 0) {
    console.error(`No vehicle found matching slug "${onlySlug}"`);
    process.exit(1);
  }

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  const tasks: Array<{ vehicle: Vehicle; viewName: ViewName }> = [];
  for (const vehicle of list) {
    for (const viewName of selectedViews) {
      tasks.push({ vehicle, viewName });
    }
  }

  for (let i = 0; i < tasks.length; i++) {
    const { vehicle, viewName } = tasks[i];
    const view = VIEWS[viewName];
    const outputPath = join(outputDir, view.filename(vehicle.slug));

    if (existsSync(outputPath) && !force) {
      console.log(`• skip  ${vehicle.slug} [${viewName}] (already exists)`);
      skipped++;
      continue;
    }

    console.log(`• gen   ${vehicle.slug} [${viewName}]`);
    const result = await processOne(ai, vehicle, view, photoroomKey);
    if (result === "generated") generated++;
    else failed++;

    if (i < tasks.length - 1) {
      await new Promise((r) => setTimeout(r, DELAY_MS));
    }
  }

  console.log(
    `\nDone. Generated: ${generated} · Skipped: ${skipped} · Failed: ${failed}`
  );
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
