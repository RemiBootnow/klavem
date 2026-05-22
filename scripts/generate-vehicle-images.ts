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
  bodyType: string;
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
const EXTERIOR_VIEWS: ViewName[] = ["front", "side", "rear"];

type ColorName = "black" | "white" | "grey";
const ALL_COLORS: ColorName[] = ["black", "white", "grey"];

interface ColorPaint {
  short: string; // used in the lead-in
  detailed: string; // used in the "Body paint:" instruction
  suffix: string; // filename suffix (empty for default black)
}

const COLOR_PAINTS: Record<ColorName, ColorPaint> = {
  black: {
    short:
      "deep gloss black (high-gloss jet-black paint with crisp white/silver specular highlights, mirror-like reflections, no blue tint, no navy, no dark blue, no graphite, no matte or satin finish)",
    detailed:
      "deep glossy jet-black with sharp white/silver specular highlights and clean mirror-like reflections along the bodylines, hood, roof, and side panels. The base tone is pure black — never blue, never navy, never dark blue, never graphite. Highlights from the studio lights should appear pale white/silver on the curves; the rest of the panels stay deep black. The finish is high-gloss, not matte and not satin.",
    suffix: "",
  },
  white: {
    short:
      "deep gloss pearl white (high-gloss bright pearl-white paint with crisp pale specular highlights, mirror-like reflections, no yellow tint, no beige, no cream, no ivory, no matte or satin finish)",
    detailed:
      "deep glossy pearl-white with sharp pale specular highlights and clean mirror-like reflections along the bodylines, hood, roof, and side panels. The base tone is pure bright white — never beige, never cream, never ivory, never yellow-tinted. Reflections from the studio lights appear as soft pale-grey accents on the shadowed curves; the rest of the panels stay clean bright white. The finish is high-gloss pearl, not matte and not satin.",
    suffix: "-white",
  },
  grey: {
    short:
      "deep gloss metallic medium grey (high-gloss medium silver-grey paint with crisp pale specular highlights, mirror-like reflections, no green tint, no brown, no blue tint, no matte or satin finish)",
    detailed:
      "deep glossy metallic medium silver-grey with sharp pale specular highlights and clean mirror-like reflections along the bodylines, hood, roof, and side panels. The base tone is neutral mid-grey with subtle metallic flake — never blue, never green, never brown. Highlights from the studio lights appear pale white/silver on the curves; shadowed panels deepen toward a darker grey. The finish is high-gloss metallic, not matte and not satin.",
    suffix: "-grey",
  },
};

interface ViewConfig {
  filename: (slug: string, colorSuffix: string) => string;
  width: number;
  height: number;
  aspectRatio: "3:2" | "4:3" | "16:9" | "1:1";
  removeBackground: boolean;
  addShadow: boolean;
  promptBuilder: (
    v: Vehicle,
    vehicleLabel: string,
    paint: ColorPaint
  ) => string;
}

const GEMINI_MODEL = "gemini-3.1-flash-image-preview";
const DELAY_MS = 1500;
const PHOTOROOM_URL = "https://image-api.photoroom.com/v2/edit";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const outputDir = join(repoRoot, "public", "vehicules");

function labelFor(vehicle: Vehicle): string {
  const variant =
    vehicle.variant && !/^Phase \d+$/i.test(vehicle.variant)
      ? ` ${vehicle.variant.replace(/\s*Phase \d+$/i, "").trim()}`
      : "";
  const wagonHint =
    vehicle.bodyType.startsWith("Break") &&
    !/touring sports?|wagon|estate|break/i.test(variant)
      ? " Touring Sports (estate / station-wagon body, long roofline extending to the rear, large tailgate, NOT a hatchback or sedan)"
      : "";
  const slugHint =
    vehicle.slug === "kia-ev4"
      ? " (compact electric fastback sedan, NOT a crossover or SUV, twin LED headlight signature, low coupé-like roofline)"
      : vehicle.slug.startsWith("hyundai-ioniq-phase-")
        ? " (original Ioniq hybrid liftback hatchback, AE-generation 2016-2022, NOT the IONIQ 5, NOT the IONIQ 6, NOT any modern EV with pixel headlights — conventional Hyundai hex grille, narrow swept headlights, low aerodynamic fastback roofline)"
        : "";
  return `${vehicle.model}${variant}${wagonHint}${slugHint}`.trim();
}

function yearTag(vehicle: Vehicle): string {
  return vehicle.yearFrom === vehicle.yearTo
    ? `${vehicle.yearFrom}`
    : `${vehicle.yearFrom}-${vehicle.yearTo}`;
}

const VIEWS: Record<ViewName, ViewConfig> = {
  front: {
    filename: (slug, suffix) => `${slug}/1${suffix}.png`,
    width: 2048,
    height: 1365,
    aspectRatio: "3:2",
    removeBackground: true,
    addShadow: true,
    promptBuilder: (vehicle, label, paint) => `Professional automotive studio photograph of a ${yearTag(vehicle)} ${vehicle.brand} ${label} in ${paint.short} finish. Wide landscape format, 3:2 widescreen aspect ratio.

Composition: Front three-quarter view from the driver's side, camera positioned slightly low (approximately bumper height), lens at about 35-40mm equivalent. The vehicle is centered in the frame, facing toward the left at a ~30 degree angle so both the full front fascia and driver-side profile are clearly visible. Wheels turned slightly toward the camera. The car occupies roughly 80% of the frame width.

Lighting: Clean, even studio lighting with soft diffused highlights along the hood, roofline, and side panels. Subtle rim light defining the silhouette. Gentle specular highlights on the headlights, grille, and wheels. No harsh reflections, no visible light sources in the body panels.

Background: Pure solid white (#FFFFFF), completely seamless, completely empty. No floor, no ground plane, no horizon line, no shadow, no gradient, no environment, no reflections of any kind on the ground. The car appears to float on a clean white background.

Body paint: ${paint.detailed}

Style: High-resolution commercial catalog photography, sharp focus throughout, photorealistic, factory-fresh condition, clean body panels, no dirt or scratches, no license plate text, no dealership branding, no people, no text, no additional graphics or annotations.`,
  },

  side: {
    filename: (slug, suffix) => `${slug}/2${suffix}.png`,
    width: 2048,
    height: 1365,
    aspectRatio: "3:2",
    removeBackground: true,
    addShadow: true,
    promptBuilder: (vehicle, label, paint) => `Professional automotive studio photograph of a ${yearTag(vehicle)} ${vehicle.brand} ${label} in ${paint.short}, captured in a pure side profile view at a perfect 90-degree angle. The entire vehicle is centered in frame with equal space on both sides. Shot with a long telephoto lens (around 200mm) to eliminate perspective distortion, camera positioned at the car's beltline height. Wide landscape format, 3:2 widescreen aspect ratio.

Lighting: Clean, even, soft studio lighting directional from the front-side to emphasize the bodyline, door creases, and wheel design without harsh shadows. Crisp reflections along the doors reveal the car's curvature. Tires sharp, wheels clean and detailed.

Background: Pure solid white (#FFFFFF), completely seamless, completely empty. No floor, no ground plane, no horizon line, no shadow, no gradient, no environment, no reflections of any kind on the ground. The car appears to float on a clean white background.

Body paint: ${paint.detailed}

Style: Ultra-high resolution, photorealistic, commercial catalog quality, factory-fresh condition, clean body panels, no dirt or scratches, no license plate text, no dealership branding, no people, no text, no additional graphics or annotations.`,
  },

  rear: {
    filename: (slug, suffix) => `${slug}/3${suffix}.png`,
    width: 2048,
    height: 1365,
    aspectRatio: "3:2",
    removeBackground: true,
    addShadow: true,
    promptBuilder: (vehicle, label, paint) => `Professional automotive studio photograph of a ${yearTag(vehicle)} ${vehicle.brand} ${label} in ${paint.short}, shot from the rear three-quarter angle (approximately 45 degrees behind the vehicle, from the driver's side). Camera at roughly hip height, lens around 50–85mm for natural proportions. The framing reveals the full rear end — taillights, badge, bumper, exhaust — along with the rear door, rear wheel, and a hint of the roofline. Wide landscape format, 3:2 widescreen aspect ratio.

Lighting: Clean, even studio lighting with soft diffused highlights. Taillights softly glowing. Reflections on the paint show depth and gloss. Gentle specular highlights on the chrome accents and wheels.

Background: Pure solid white (#FFFFFF), completely seamless, completely empty. No floor, no ground plane, no horizon line, no shadow, no gradient, no environment, no reflections of any kind on the ground. The car appears to float on a clean white background.

Body paint: ${paint.detailed}

Style: High-resolution commercial catalog photography, sharp focus throughout, photorealistic, factory-fresh condition, clean body panels, no dirt or scratches, no license plate text, no dealership branding, no people, no text, no additional graphics or annotations.`,
  },

  "interior-rear": {
    filename: (slug, suffix) => `${slug}/4${suffix}.png`,
    width: 2048,
    height: 1365,
    aspectRatio: "3:2",
    removeBackground: false,
    addShadow: false,
    promptBuilder: (vehicle, label) => `Photorealistic interior photograph of a ${yearTag(vehicle)} ${vehicle.brand} ${label}, showing the rear passenger area.

Camera: inside the cabin near the front passenger headrest, wide-angle 20mm lens, angled back and slightly down toward the rear bench. 3:2 widescreen, landscape orientation.

Lighting: soft and even interior light, dark cabin materials. All glass (windshield, side windows, rear window, sunroof, glass roof) is perfectly clear and untinted — no blue tint, no UV filter, no gradient on the glass itself. Outside every window: flat solid Pantone Cool Gray 1 C (very light, pale, near-white neutral grey) only — no sky, no environment, no buildings, no landscape, no gradient, no color variation.

No people, no text, no watermarks. Ultra-sharp focus, premium automotive catalog quality.`,
  },

  "interior-cockpit": {
    filename: (slug, suffix) => `${slug}/5${suffix}.png`,
    width: 2048,
    height: 1365,
    aspectRatio: "3:2",
    removeBackground: false,
    addShadow: false,
    promptBuilder: (vehicle, label) => `Photorealistic interior photograph of a ${yearTag(vehicle)} ${vehicle.brand} ${label}, showing the driver's cockpit.

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
  view: ViewConfig,
  paint: ColorPaint
): Promise<Buffer> {
  const label = labelFor(vehicle);
  const targetAspect = view.width / view.height;

  for (let attempt = 1; attempt <= MAX_ASPECT_RETRIES; attempt++) {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: view.promptBuilder(vehicle, label, paint),
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
  paint: ColorPaint,
  photoroomKey: string | null
): Promise<"generated" | "failed"> {
  const outputPath = join(outputDir, view.filename(vehicle.slug, paint.suffix));
  const outputParent = dirname(outputPath);
  if (!existsSync(outputParent)) mkdirSync(outputParent, { recursive: true });
  const rawDir = join(outputParent, "raw");
  if (!existsSync(rawDir)) mkdirSync(rawDir, { recursive: true });
  const rawPath = join(rawDir, basename(outputPath));
  try {
    const raw = await generateWithGemini(ai, vehicle, view, paint);
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
  const colorIdx = args.indexOf("--color");
  const colorArg = colorIdx >= 0 ? args[colorIdx + 1] : "black";

  let selectedViews: ViewName[];
  if (viewArg === "all") {
    selectedViews = ALL_VIEWS;
  } else if (viewArg === "exterior") {
    selectedViews = EXTERIOR_VIEWS;
  } else if (ALL_VIEWS.includes(viewArg as ViewName)) {
    selectedViews = [viewArg as ViewName];
  } else {
    console.error(
      `Unknown view "${viewArg}". Valid: ${ALL_VIEWS.join(", ")}, all, exterior`
    );
    process.exit(1);
  }

  let selectedColors: ColorName[];
  if (colorArg === "all") {
    selectedColors = ALL_COLORS;
  } else if (ALL_COLORS.includes(colorArg as ColorName)) {
    selectedColors = [colorArg as ColorName];
  } else {
    console.error(
      `Unknown color "${colorArg}". Valid: ${ALL_COLORS.join(", ")}, all`
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

  const tasks: Array<{
    vehicle: Vehicle;
    viewName: ViewName;
    colorName: ColorName;
  }> = [];
  for (const vehicle of list) {
    for (const colorName of selectedColors) {
      for (const viewName of selectedViews) {
        tasks.push({ vehicle, viewName, colorName });
      }
    }
  }

  for (let i = 0; i < tasks.length; i++) {
    const { vehicle, viewName, colorName } = tasks[i];
    const view = VIEWS[viewName];
    const paint = COLOR_PAINTS[colorName];
    const outputPath = join(
      outputDir,
      view.filename(vehicle.slug, paint.suffix)
    );

    if (existsSync(outputPath) && !force) {
      console.log(
        `• skip  ${vehicle.slug} [${viewName}/${colorName}] (already exists)`
      );
      skipped++;
      continue;
    }

    console.log(`• gen   ${vehicle.slug} [${viewName}/${colorName}]`);
    const result = await processOne(ai, vehicle, view, paint, photoroomKey);
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
