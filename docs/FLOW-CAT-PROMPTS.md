# NEKO DELICE — Flow Cat Photography Reference & Roles

The cat photography collection for Homepage v2 is provided in `prompts/neko-delice-homepage-v2-kit/Cat photos/`.

## Provided Photography Asset Inventory

| File Name | Intended Role | Description & Quality Notes |
|---|---|---|
| `cat-hero-01_20261026210942.jpg` | Hero Primary | High-resolution cat on warm neutral ground with soft natural light, ample negative space on the left for hero typography and product carton overlay. |
| `cat-hero-02_20261026210942.jpg` | Hero Alt | Alternative high-resolution cat portrait with warm amber/brown coat and neutral background. |
| `cat-eating-01_20261026210942.jpg` | Why Band ("Better food. Better days.") | Cat eating from a low ceramic dish, showing mealtime contentment, natural posture, no unnatural artifacts. |
| `cat-peek-01_20261026210942.jpg` | Closing CTA / Edge Peek | Cat peeking with alert, curious eyes and visible ears, ideal for edge positioning or closing CTA. |
| `cat-portrait-01_20261026210942.jpg` | Supporting Portrait | Attentive seated cat portrait with serene gaze and clear silhouette. |
| `kitten-01_20261026210942.jpg` | Life Stage Supporting | Young kitten in playful posture, clean paws and natural whiskers. |

## Intake Protocol (Stage V2-03)
- Verify anatomy (whiskers, paws, pupils, ears).
- Color calibration to ensure background tones blend smoothly into NEKO DELICE's `#FBF6EE` (cream-50) using CSS radial/linear masks.
- Output via Sharp pipeline to `public/images/site/` with 640, 1024, 1600 WebP formats under strict size budgets (Hero ≤ 150 KB, supporting ≤ 120 KB at 1024px).
