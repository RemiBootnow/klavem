# Vehicle image audit — 2026-05-22

Audit of all 51 front-view PNGs (17 vehicles × 3 colors: black, white, grey). Each issue includes the specific file(s) to regenerate or investigate.

## Direction issues (image faces right, should face left)

- [ ] **`public/vehicules/toyota-bz4x/1-grey.png`** — bZ4X grey faces right. Black + white are correct.
  - Fix: `npm run generate:vehicle-images -- --slug toyota-bz4x --view front --color grey --force`

## Wrong model

- [ ] **`public/vehicules/kia-ev4/1.png`, `1-white.png`, `1-grey.png`** — All 3 show a Kia EV6-style crossover, not the EV4 (compact sedan/hatchback launched 2025). Gemini doesn't recognize the EV4.
  - Fix: needs an explicit body-style hint in the prompt for this slug. Suggested: amend `labelFor()` in `scripts/generate-vehicle-images.ts` so EV4 gets ` (compact electric fastback sedan, NOT a crossover or SUV, twin LED headlight signature, low coupé-like roofline)`, then reroll all 3 colors.

- [ ] **`public/vehicules/kia-niro-phase-3/1-white.png`** — Shows the old Niro (Phase 2 pre-facelift design), not the redesigned Phase 3 with the distinctive boomerang C-pillar. Black + grey for Phase 3 are correct.
  - Fix: `npm run generate:vehicle-images -- --slug kia-niro-phase-3 --view front --color white --force`

- [ ] **`public/vehicules/kia-niro-phase-2/1-white.png`** — Shows the e-Niro EV variant (closed front grille, blue accent) instead of the facelifted hybrid Niro. Black + grey for Phase 2 are correct.
  - Fix: `npm run generate:vehicle-images -- --slug kia-niro-phase-2 --view front --color white --force`

## Data inconsistency (model name vs. images)

- [ ] **`hyundai-ioniq-4-phase-1` and `hyundai-ioniq-4-phase-2`** in `content/vehicles.json` — There is no "IONIQ 4" model from Hyundai. Phase 1 images show the original IONIQ hatchback (matches data: `Berline hybride`, 2017-2020 ✓). Phase 2 images show the **IONIQ 5** (black) and **IONIQ 6** (white/grey), which are EVs — none match the data's "Berline hybride 2022".
  - Decision needed: is this actually the original IONIQ (hybrid hatchback, 2017-2022)? If yes, rename slug/model and re-render Phase 2 white + grey. If you actually meant IONIQ 5 or IONIQ 6, update `vehicles.json` (model name, motorisation, bodyType).

## Known limitation (not blocking)

- **Mercedes Classe V 250 XL** (all 3 colors) — Gemini renders the 2019-2023 W447 facelift instead of the 2024+ facelift expected for a 2026 model year. May not be fixable without explicit "post-2024 facelift" prompt hints. Lower priority.

## Sweep coverage

Audited only the **front view (`1.png` / `1-white.png` / `1-grey.png`)** because that's where direction and model identity are clearest. The side and rear views were not exhaustively reviewed — worth a quick visual scan if any of the above issues turn out to extend across views.
