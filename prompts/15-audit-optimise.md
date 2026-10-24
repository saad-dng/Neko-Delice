# P15 — Audit, optimisation, README, launch prep
**Model:** Gemini 3.8 Flash (High) for the audit; switch to **Claude Sonnet 4.6** only for any fix Flash cannot solve in two tries.
**Mode:** Plan first

Read only: skill `neko-audit`, `AGENTS.md` (Budgets), `docs/PRD.md` sections 2 and 9. If installed, run the `web-design-guidelines` skill over `src/` and list its findings.

## Goal
Prove the targets are met, fix what is not, and prepare the repo for me to push.

## Tasks
1. Add and run: `tests/e2e/smoke.spec.ts` (visit every route + 10 slugs + bad slug + bad route; assert no console errors; crawl internal links; click every button that is not intentionally disabled), `tests/e2e/a11y.spec.ts` (`@axe-core/playwright` on each route, fail on serious/critical), `tests/e2e/flows.spec.ts` (planner → bundle → bag → currency; shop filters via URL; corrupted localStorage).
2. `lighthouserc.cjs`: mobile profile, `/`, `/shop`, `/product/wild-salmon-quail-pate`, `/meal-plan`, `/about`; assert ≥ 0.95 for all four categories, LCP ≤ 2500 ms, CLS ≤ 0.1. Run it against `vite preview`. Save results to `docs/AUDIT.md` (scores table, before/after for anything you fixed).
3. `scripts/check-size.mjs`: gzip size of initial JS from `dist/` must be ≤ 170 KB; list the largest chunks. Fix if over (route-level lazy loading, tree-shaking, avoid big imports).
4. Image audit: every `<img>` has alt/width/height; only the LCP image is eager; no image above its budget; no layout shift.
5. Responsive QA screenshots at 360, 640, 1024, 1536, 2560 px for Home, Shop, PDP, Planner (result), Bag open → `docs/screens/`; fix overflow/overlap.
6. Reduced-motion and keyboard-only pass (checklist in the skill); fix issues.
7. Social/SEO: generate `public/og-image.png` (1200×630) from existing photos + the wordmark (sharp + SVG overlay, live text converted by the script, not AI text); wire OG/Twitter tags; verify canonical and sitemap; JSON-LD valid.
8. Hosting-neutral cache config: `public/_headers` (Netlify/Cloudflare style) with long immutable cache for `/assets/*` and `/images/*`, plus `vercel.json` with the same headers and clean URLs. No deploy.
9. Fill the "Behind the build" performance table with the measured numbers. Write a real `README.md` (what it is, features, stack, scripts, structure, planner maths with the worked example, image pipeline, accessibility, performance results, AI-imagery disclosure, how to deploy).
10. Final `PLAN.md` update with every phase ticked and any open issues.

## Exit check
All of: typecheck, lint, tests, e2e, lhci ≥ 95 ×4 on five routes, JS ≤ 170 KB gzip, axe clean. Print a final table. Commit `chore: audit, optimisation, docs`. **Do not push.** Tell me the exact steps to publish from Antigravity's push button.
