# P01 — Bootstrap & structure
**Model:** Gemini 3.8 Flash · **Thinking:** Low · **Mode:** Fast

Read only: `AGENTS.md`, `PLAN.md`, `docs/PRD.md` sections 4 and 8.

## Goal
Turn the fresh Vite + React + TS scaffold into a clean, correctly configured NEKO DELICE project. No UI yet.

## Tasks
1. Verify the scaffold works (`npm run dev` starts). Delete template demo files (App.css, assets/react.svg, counter, etc.).
2. Configure `vite.config.ts`: `@vitejs/plugin-react`, `@tailwindcss/vite`, path alias `@/` → `src/`, Vitest block (`jsdom`, globals, setup file).
3. Switch to `vite-react-ssg`: scripts `dev` = `vite-react-ssg dev`, `build` = `vite-react-ssg build`. Keep `preview`. Add scripts: `typecheck` (`tsc -b --noEmit`), `lint`, `test` (`vitest run`), `e2e` (`playwright test`), `images` (`node scripts/optimize-images.mjs`), `lhci` (`lhci autorun`), `size`.
4. Create folders with a `.gitkeep` only where empty: `src/{config,data,lib,store,components/{ui,layout,shop,product,planner,bag,cat-art},routes,styles}`, `scripts/`, `tests/e2e/`.
5. `tsconfig`: `strict`, `noUncheckedIndexedAccess`, `@/*` paths. ESLint: keep the template config, add `jsx-a11y` rules **only if already installed** (do not install anything new).
6. `.gitignore`: add `Photo collection/`, `.lighthouseci/`, `playwright-report/`, `test-results/`, `dist/`.
7. Replace `README.md` with a 15-line stub (name, one-sentence description, scripts, "see PLAN.md").
8. Move/confirm docs live at `docs/PRD.md`, `docs/DESIGN.md`, `docs/CONTENT.md`, `docs/IMAGE-MAP.md`.
9. Add one trivial Vitest test so `npm test` passes.

## Do not
Install dependencies. Write any page UI. Touch `Photo collection/`.

## Exit check
`npm run typecheck`, `lint`, `test`, `build` all succeed; `git status` shows `Photo collection/` ignored. Tick P01 in `PLAN.md`; commit `chore: bootstrap project structure`.
