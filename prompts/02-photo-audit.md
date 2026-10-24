# P02 — Photo audit → image map
**Model:** Gemini 3.8 Flash · **Thinking:** High (needs vision) · **Mode:** Plan first

Read only: `docs/IMAGE-MAP.md`, `docs/CONTENT.md` (products section), skill `neko-image-pipeline`.

## Goal
Look at **every one of the 48 photos** in `Photo collection/` and produce a verified map. This is the single most important accuracy step: later prompts trust this map.

## Tasks
1. List all files per folder (keep exact names, including `·`, `&`, `é`, `…`).
2. Open each image. For every image record: slug, original relative path, role (`hero|angle|contents|together|detail|carton|lifestyle`), pixel width × height, orientation, whether the subject is centred with margin, any readable text (only NEKO DELICE is allowed; flag garbled text), any non-cat animal artwork on packs (flag), pack form (stick sachet / stand-up pouch / amber bottle / paper pouch / vacuum brick), quality notes, and a draft alt text (≤140 chars).
3. Specifically answer: (a) Is product 05 a paper pouch? Does `Aluminum_pouch_on_beige_backdrop…` actually show aluminium? (b) What is `Missing_products_in_first_photo…`? usable? (c) What is `image.png_…` in product 07? (d) Which image is the best `hero` for products 03, 05, 06 (names are ambiguous)? (e) Do packs show correct cats only?
4. Write the verified table into `docs/IMAGE-MAP.md` under "Verified map" and a machine-readable `src/data/image-map.source.json`: `[{ slug, source, role, width, height, alt, keep }]`, ordered by gallery order per product. Choose for each product: `cardDefault` (hero) and `cardHover` (contents; hardware: together).
5. List problems and gaps (e.g. product 03 has no detail shot) and what the gallery will look like for each product.

## Do not
Rename, move, convert or crop anything. Do not generate new images. Do not continue to the next prompt.

## Exit check
Table has 48 rows. Report a 10-line summary of problems. **STOP and wait for my approval or corrections.** After I approve, set `keep` flags, tick P02, commit `docs: verified image map`.
