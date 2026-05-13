---
name: add-vehicle
description: Add a new rental vehicle to the Klavem catalog. Collects minimal info from the user (brand, model, years, motorisation, category, body type), appends an entry to content/vehicles.json, and generates the 5 catalog images via scripts/generate-vehicle-images.ts. Triggers on phrases like "add a new car", "new vehicle in the fleet", "add a vehicle to the catalog", "/add-vehicle".
---

# Add Vehicle to Klavem Catalog

Run through these steps in order. Do not skip or combine unrelated steps.

## 1. Collect minimal info

Use `AskUserQuestion` to gather the required fields. Group them to minimize round-trips. Two good groupings:

**Question 1 — identity** (free-text via the "Other" fallback)

Ask in a single `AskUserQuestion` call:
- "What is the vehicle's brand?" (e.g. Toyota, Tesla, Mercedes)
- "What is the model?" (e.g. Model 3, C-HR, Classe V)
- "Is there a variant or trim?" (e.g. "Phase 3", "250 XL", or "None")

Since `AskUserQuestion` works best with preset options, for brand you can offer the existing brands from `content/vehicles.json` as options plus "Other". For model and variant, simple options won't fit — instead, instruct the user to type it in via the "Other" free-text field, or ask in plain text prose before calling the tool.

**Question 2 — classification** (multi-select-able presets)

Single `AskUserQuestion` call with multiple questions:
- **Motorisation**: options `Hybride`, `Électrique`, `Diesel`
- **Category**: options `1`, `2`, `3`, `4`, `5` (price tier)
- **Body type**: offer common values from existing vehicles (`SUV compact hybride`, `Berline électrique`, `Break hybride`, `Monospace 7 places`, `SUV urbain hybride`, `SUV coupé hybride`, `Berline hybride`, `SUV électrique`) plus "Other" for free-text.
- **Year range**: ask for yearFrom and yearTo separately, or as a single "2024" / "2023-2026" string. Normalize into two integers.

**Question 3 — technical specs** (research, then confirm with user)

The data model requires these fields. Research them yourself from manufacturer specs / well-known sources (you do NOT need to call the user for each one unless you can't find a value):

- **transmission**: `"Automatique"` or `"Manuelle"`. Almost all modern hybrids/electrics are auto — only flag if you find a manual.
- **consommation** (Hybride/Diesel only): WLTP combined consumption as a French-formatted string, e.g. `"4,5 L/100 km"`. Set to `null` for electric vehicles.
- **tempsCharge** (Électrique only): DC fast-charge time 10→80 %, e.g. `"30 min (10-80 %)"`. Set to `null` for non-electric.
- **autonomie**: number of km. WLTP range for electrics (e.g. `533`); set to `null` for hybrid/diesel (we don't surface tank range).
- **coffre**: number, in litres. Standard "boot volume seats up" figure.
- **places**: integer — typically 5, occasionally 7 (vans).

Before writing the JSON, list the 6 values back to the user in one short message so they can correct anything you couldn't find or got wrong.

**Question 4 — daily tariff** (`tarifJournalier`, number of euros or null)

After the user chooses a category, derive a default daily tariff from this mapping (from the original PDF) and propose it:

| Cat | Default €/day |
|-----|---------------|
| 1   | 37            |
| 2   | 42            |
| 3   | 45            |
| 4   | 47            |
| 5   | null (sur devis) |

Offer the user two options via `AskUserQuestion`:
- Accept the default for the chosen category
- Set a custom price (free-text integer, or "null" for "sur devis")

Store the value as a number (e.g. `45`) or JSON null (not the string `"null"`) in the new entry.

## 2. Compute the slug

Format: kebab-cased `brand-model-[variant]-[yearFrom]`.

Rules:
- Lowercase everything
- Replace spaces with hyphens
- Strip special characters except hyphens (e.g., `C-HR` stays `c-hr`)
- If variant exists, include it: `kia-niro-phase-3`
- If model name alone collides with another entry (same brand + model but different years), append yearFrom: `toyota-c-hr-2025`
- Check uniqueness against existing `content/vehicles.json`. If collision, append `-yearFrom` or pick another disambiguator.

Examples from the existing catalog:
- Toyota C-HR (2025) → `toyota-c-hr-2025`
- Kia Niro Phase 3 → `kia-niro-phase-3`
- Mercedes Classe V 250 XL → `mercedes-classe-v-250-xl`
- Tesla Model 3 → `tesla-model-3`

## 3. Write the description

Every vehicle needs a **French description of ~400–500 characters** (hard maximum 500). Write it yourself using your own knowledge of the specified car — do NOT call an external API.

**Tone & content:**
- Factual, concrete, no marketing fluff or superlatives ("incroyable", "exceptionnel", etc.).
- Focus on what matters to a VTC driver renting the car: fuel/energy consumption (with approximate figures), boot/interior space, comfort for passengers, operating cost, reliability, image/positioning, compatibility with platforms (Uber, Bolt, Heetch) or ZFE Paris if relevant.
- Include one or two model-specific details that prove you know the car (e.g. "Toyota Safety Sense de série", "écran tactile 15,4\"", "plateforme E-GMP", "motorisation 1.8 L 180 ch").
- Use French number formatting: "4,5 L/100 km" not "4.5 L/100 km".
- No opening filler like "Ce modèle..." or "Voici...". Lead directly with the vehicle type.

**Examples of good first sentences (pattern to match):**
- "Break hybride Toyota reconnu pour sa fiabilité exemplaire et sa motorisation hybride éprouvée."
- "Monospace premium Mercedes Classe V 250d en version longue (XL), configuration 7 places idéale pour les transferts groupes et familiaux."
- "Berline électrique Tesla Model 3, référence du segment."

**Before appending to JSON, verify**: description length is ≤ 500 characters. If over, tighten.

## 4. Append entry to content/vehicles.json

Read `content/vehicles.json`, parse, append a new object with this shape (and write back as JSON with 2-space indent, trailing newline):

```json
{
  "slug": "<computed-slug>",
  "brand": "<Brand>",
  "model": "<Model>",
  "variant": "<variant or null>",
  "bodyType": "<body type>",
  "yearFrom": <int>,
  "yearTo": <int>,
  "motorisation": "<Hybride|Électrique|Diesel>",
  "transmission": "<Automatique|Manuelle>",
  "consommation": "<\"X,X L/100 km\" for Hybride/Diesel, null for Électrique>",
  "tempsCharge": "<\"X min (10-80 %)\" for Électrique, null for Hybride/Diesel>",
  "autonomie": "<km int for Électrique, null otherwise>",
  "coffre": <litres int>,
  "places": <seats int>,
  "category": <1-5>,
  "tarifJournalier": <number or null>,
  "image": "/vehicules/<slug>/1.png",
  "images": [
    "/vehicules/<slug>/1.png",
    "/vehicules/<slug>/2.png",
    "/vehicules/<slug>/3.png",
    "/vehicules/<slug>/4.png",
    "/vehicules/<slug>/5.png"
  ],
  "description": "<French description you wrote in step 3, ≤500 chars>"
}
```

Use the JSON write pattern `JSON.stringify(data, null, 2) + "\n"` to preserve formatting.

## 5. Generate the 5 images

The generation script lives at `scripts/generate-vehicle-images.ts`. It requires `GEMINI_API_KEY` and `PHOTOROOM_API_KEY` environment variables.

- Check first whether the user has these in their env (they may be in `.env` or set in shell). If not set, ask them to provide keys.
- Warn the user of cost: **~$0.30 Photoroom fees per new vehicle** (3 views × $0.10 for front/side/rear; interior views are free).
- Run:

```bash
GEMINI_API_KEY=<key> PHOTOROOM_API_KEY=<key> npm run generate:vehicle-images -- --view all --slug <new-slug>
```

The script creates `public/vehicules/<slug>/` and writes `1.png` through `5.png`.

Runtime is ~1 minute per vehicle (5 images × ~10s each + delays).

## 6. Show the user the results

Use `Read` on each of the 5 generated PNGs to display them back. Confirm:
- Entry appended to `content/vehicles.json`
- 5 images created in `public/vehicules/<slug>/`
- Live preview at `http://localhost:3000/vehicules/<slug>` (if the dev server is running)

## View meaning reference

The 5 images correspond to these views (handled by the generation script — you don't set them yourself):

| # | View | Aspect | Pipeline | Description |
|---|------|--------|----------|-------------|
| 1 | front | 16:9 2048×1152 | Photoroom bg removal + AI shadow | Front three-quarter studio cutout on transparent bg |
| 2 | side | 16:9 2048×1152 | Photoroom bg removal + AI shadow | 90° side profile cutout on transparent bg |
| 3 | rear | 16:9 2048×1152 | Photoroom bg removal + AI shadow | 45° rear three-quarter cutout on transparent bg |
| 4 | interior-rear | 16:9 2048×1152 | Gemini only | Rear cabin view, light grey through windows |
| 5 | interior-cockpit | 16:9 2048×1152 | Gemini only | Driver's cockpit view, light grey through windows |

All details (prompts, dimensions, pipeline) are defined in `scripts/generate-vehicle-images.ts`. Do not re-implement any of that here — just call the script.

## Gotchas

- **Slug uniqueness**: always verify against existing `content/vehicles.json`. A duplicate slug silently overwrites an existing vehicle's detail page route.
- **Interior views ignore Photoroom**: if the user asks about transparency on interior views, explain they're opaque Gemini-only outputs (design decision — Photoroom creates artifacts on cabin shots).
- **Model for Gemini**: the script uses `gemini-3.1-flash-image-preview`. Interior views require this specific model + `imageSize: "2K"` to produce 16:9. Do not downgrade to `gemini-2.5-flash-image`.
- **API key leakage**: if the user pastes their Gemini or Photoroom keys in chat, remind them that the transcript stores these — they should rotate afterward.
