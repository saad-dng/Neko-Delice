# Prompt index (run in order, one per fresh conversation)

| # | Prompt | Model | Thinking | Stops for you? |
| --- | --- | --- | --- | --- |
| 01 | Bootstrap & structure | Gemini 3.8 Flash | Low | no |
| 02 | Photo audit & image map | Gemini 3.8 Flash | High (vision) | **yes: approve map** |
| 03 | Image optimisation pipeline | Gemini 3.8 Flash | Medium | maybe (crop question) |
| 04 | Tokens, fonts, base UI | Gemini 3.8 Flash | Medium | no |
| 05 | Logo & wordmark | Gemini 3.8 Flash | High (vision) | **yes: pick glyph** |
| 06 | Monoline cat set | Gemini 3.8 Flash | High (vision) | **yes: approve set** |
| 07 | Shell, routing, prerender, SEO | Gemini 3.8 Flash | Medium | no |
| 08 | Product data, content, currency format | Gemini 3.8 Flash | Medium | no |
| 09 | Planner engine + tests | **Claude Sonnet 4.6** | Default | no |
| 10 | Shop, filters, stores | Gemini 3.8 Flash | High | no |
| 11 | Product detail page | Gemini 3.8 Flash | Medium | no |
| 12 | Planner UI | Gemini 3.8 Flash | High (Claude if stuck twice) | no |
| 13 | Smart Bag + currency UI | **Claude Sonnet 4.6** | Default | no |
| 14 | Home, About, micro-interactions | Gemini 3.8 Flash | High | no |
| 15 | Audit & optimise | Gemini 3.8 Flash High, then Claude for any hard fix | | no |

Claude Opus 4.6: only if Sonnet fails twice on the same bug. Your token allowance is the scarce resource.

## Shared footer (already in AGENTS.md, repeated here for the agent)
Finish every prompt by: running typecheck/lint/test/build, updating `PLAN.md`, committing locally (no push), and replying in ≤10 lines: what changed · how to verify · what you did NOT do.
