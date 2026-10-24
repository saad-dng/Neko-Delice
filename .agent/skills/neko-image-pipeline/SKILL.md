---
name: neko-image-pipeline
description: Use when auditing, naming, optimising or referencing NEKO DELICE product photos (Photo collection folder), generating the image manifest, or writing alt text and responsive image markup.
---

# NEKO DELICE image pipeline

Originals: `Photo collection/<folder>/<file>.jpg` (48 files, 4–5 per product). Never edit, move or commit originals. File names contain `·`, `&`, `é`, `…` and spaces: always use the path from `docs/IMAGE-MAP.md` / `src/data/image-map.source.json`, never rebuild paths by hand.

## Audit (P02)
Open every image. Record: role, pixel size + orientation, subject centred?, any readable text (the only readable text allowed is NEKO DELICE; garbled text = flag), any animal other than cats on packs = flag, pack form matches `docs/CONTENT.md` (stick sachets; product 05 is a paper pouch), backdrop is warm beige, light from left. Mark unusable images `keep: n`. Do not guess: if unsure, say so.

## Output (P03)
`public/images/products/<slug>/<slug>-<role>[-<n>]-<640|1024|1600>.webp`
- sharp, WebP quality ~80, strip metadata, no upscaling beyond source.
- Generate `src/data/images.manifest.ts` (typed, generated, do not hand-edit): per image `{ slug, role, alt, width, height, srcset: {640,1024,1600}, sizes? }`.
- Idempotent: skip unchanged sources (hash). Script: `scripts/optimize-images.mjs`, run via `npm run images`.
- Budgets: 640 ≤ 70 KB · 1024 ≤ 150 KB · 1600 ≤ 300 KB. Tune quality per image if over.
- If sources are not square, **ask the owner** before cropping. Never silently crop.

## Markup
`<img src="…-1024.webp" srcset="…-640.webp 640w, …-1024.webp 1024w, …-1600.webp 1600w" sizes="…" width height alt decoding="async" loading="lazy">`. LCP image only: `loading="eager" fetchpriority="high"` + `<link rel="preload" as="image" imagesrcset imagesizes>` in `<Head>`. Container `aspect-ratio` from the manifest; background `beige-200`.

## Alt text
Describe what is visible: "{Product}, {what the shot shows}". No "image of". Under 140 chars. Never state text the image does not clearly show.
