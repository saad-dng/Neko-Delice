# SETUP — do this once (about 20 minutes)

## 1. Check your tools (Antigravity's terminal is fine; Windows PowerShell)
```
node -v
npm -v
git --version
```
Need Node 22 or newer. If `node` is missing or older, install the current LTS from nodejs.org, then reopen Antigravity.

## 2. Scaffold the app inside your existing folder
```
cd C:\Projects\Neko-Delice
npm create vite@latest . -- --template react-ts
```
When it says the folder is not empty, choose **Ignore files and continue**. Say **No** if it offers to install and start; then:
```
npm install
npm install react-router-dom@6 zustand
npm install -D vite-react-ssg tailwindcss @tailwindcss/vite vitest jsdom @testing-library/react @playwright/test @axe-core/playwright @lhci/cli sharp
npx playwright install chromium
git init
```
(`react-router-dom@6` is deliberate: `vite-react-ssg` targets router v6.)

## 3. Drop in the kit
Copy these from the kit into `C:\Projects\Neko-Delice` (merge folders):
```
AGENTS.md   GEMINI.md   PLAN.md   SETUP.md
docs\DESIGN.md  docs\CONTENT.md  docs\IMAGE-MAP.md
prompts\ (all 15 files)
.agent\skills\ (3 folders)
```
Then move your PRD: `neko-delice-prd-v2.md` → `docs\PRD.md` (rename).
Optional: also put `neko-delice-handover.md` in `docs\` (its decisions are already merged into PLAN.md).

## 4. Make sure Antigravity sees the rules
Open the Customizations / Rules panel. You should see `AGENTS.md` (or `GEMINI.md`) active. If it does not appear, create a workspace rule in the panel and paste the contents of `AGENTS.md` into it (do not keep both copies, they cost tokens on every message).
Skills: newer builds read `.agents\skills\`, older ones `.agent\skills\`. If the skills are not listed, copy the 3 folders to the other spelling.

## 5. Optional external skills (only these; more skills = more tokens every message)
Run in the terminal, pick Antigravity when asked where to install:
```
npx skills add anthropics/skills -s frontend-design
npx skills add Leonxlnx/taste-skill
npx skills add vercel-labs/agent-skills
```
- `frontend-design` (Anthropic): baseline "don't make generic AI UI".
- `taste-skill` (design-taste-frontend): stronger art direction. Our `docs/DESIGN.md` always wins if it pushes a louder look.
- `vercel-labs/agent-skills`: includes `web-design-guidelines` (used in the audit prompt P15) and `vercel-react-best-practices` (performance).
If you are short on tokens, install only `frontend-design` and `web-design-guidelines`. Skip `ui-ux-pro-max`: it is large.

## 6. First commit
```
git add -A
git commit -m "chore: scaffold + agent kit"
```
Add a `.gitignore` line `Photo collection/` (prompt P01 does this too). Create the GitHub repo yourself and push with Antigravity's push button after each phase.

## How to run a prompt
1. New agent conversation per prompt. 2. Select the model written at the top of the prompt. 3. Use Planning mode if your build has it for prompts marked **Plan first**. 4. Paste the whole prompt (or attach the file). 5. Review the diff, run the site, check the **Exit check**, commit, tick `PLAN.md`.
Token tip: always-on rules cost tokens on every message. Keep `AGENTS.md` short (it is), and tell the agent "read only the files listed".
Escalate to Claude only when marked, or when Flash fails the same task twice.
