# P03 — Image optimisation pipeline
**Model:** Gemini 3.8 Flash · **Thinking:** Medium · **Mode:** Fast

Read only: skill `neko-image-pipeline`, `src/data/image-map.source.json`, `docs/DESIGN.md` (Imagery).

## Goal
A repeatable script that turns approved originals into responsive WebP files plus a typed manifest.

## Tasks
1. First check the aspect ratios in `image-map.source.json`. If they are **not** square, STOP and ask me: crop to 1:1 (and where), or keep native ratio and let the UI use `object-fit`. Do not crop silently.
2. Write `scripts/optimize-images.mjs` (Node ESM, `sharp`): for each `keep: true` entry create `public/images/products/<slug>/<slug>-<role>[-n]-{640,1024,1600}.webp`; no upscaling; WebP q≈80; strip metadata; skip unchanged files (content hash cache in `node_modules/.cache`).
3. Generate `src/data/images.manifest.ts` (typed, with header "GENERATED — do not edit"): per image `slug, role, alt, width, height, srcset` plus a per-product ordered `gallery` list and `cardDefault`/`cardHover`.
4. Enforce budgets and print a table: 640 ≤ 70 KB, 1024 ≤ 150 KB, 1600 ≤ 300 KB; auto-lower quality (min 70) if over, and warn if still over.
5. Add `src/components/ui/ProductImage.tsx`: props `slug, role, sizes, priority?`; renders `<img>` with `srcset`, `width`, `height`, `alt`, `decoding="async"`, lazy unless `priority`; wrapper has `aspect-ratio` and beige background; on error shows a neutral same-ratio placeholder.
6. Unit test: every product in the manifest has `cardDefault`; every alt is non-empty.

## Do not
Delete or alter originals. Commit anything from `Photo collection/`.

## Exit check
`npm run images` runs twice (second run skips everything). Report total size per product and the largest file. Tests/build pass. Tick P03; commit `feat: image pipeline and manifest`.
