# Redesign Implementation Plan — "Print by day, CRT by night"

2026-07-12 · Jonas Heinke × Claude Fable 5
Mockup of record: style guide v5 (session scratchpad `website-audit/styleguide-mockup.html`).
This doc lives in `docs/` (excluded from the Jekyll build).

## Design decisions (settled)

- **Light**: warm paper (`#f6f1e7`) + ink + oxblood accent (`#a13d21`). "Print."
- **Dark**: terminal amber — `$terminal-amber: #ffb000` from DCSB's `_tokens.scss`, on near-black `#141210`. "CRT." One dark theme ships; night-sky/steel live on only as gallery subject matter.
- **Type**: Newsreader variable (display opsz ~72 for headlines, text opsz for body, true italics) + JetBrains Mono (labels, tags, dates, code). Self-hosted, `font-display: swap`. No Fraunces (swash J vetoed).
- **Shape**: `--radius: 2px` everywhere. Rectangles, not pills.
- **Voice split**: serif = prose; mono = machinery (nav, metadata, tags, buttons).
- **Homepage headline**: "I am Jonas and this is my website." — static, instant. No typewriter (vetoed: motion on critical path).
- **The law for anything dynamic**: attach to an event the page already has (load, hover, select, theme-switch, scroll-arrival); zero JS on the critical path; progressive enhancement only; honor `prefers-reduced-motion`; no ambient motion.

### Accepted dynamic elements
1. **Dither develop** — images arrive as coarse→fine Bayer dither; ink halftone in light, amber phosphor in dark. Photos/screenshots resolve to the true image at the end; gallery art stays two-tone (that *is* the art).
2. **Phosphor decay** on links — ignite ≤30ms, decay ~450ms, glow ≤35% alpha. CSS only.
3. **Selection styling** — amber block / ink stamp. CSS only.
4. **Progressive-scan theme switch** — View Transitions API, new theme revealed top-to-bottom in ~300ms; instant fallback without the API or with reduced-motion. Stretch: Bayer-dissolve variant via animated SVG mask (prototype, keep only if it beats the scan on feel).
5. **Dithered rules** — Bayer-gradient divider strips. Static texture.
6. **Below the Fold** — the gallery (see below).

### Vetoed
- Typewriter headline (motion, critical path)
- Perforation underlines (noisy)
- CRT overlay flash (unpolished — replaced by scan reveal)

---

## The Footer — the gallery (settled: no special name; the page is `/footer/`)

An art platform in the site's footer: dithered illustrations of things from Jonas, the page, and the Exocortex — **and an open venue where AI models are expressly invited to contribute pieces, each signed by the model that made it.** The palimpsest wallpaper generalized into a public institution.

### Content model
- One piece = one JS file in `assets/gallery/pieces/<slug>.js`:
  ```js
  Gallery.register({
    slug: "vulpecula",
    title: "Vulpecula and the Bagel-Sun",
    model: "Claude Fable 5 (Anthropic)",
    date: "2026-07",
    statement: "One or two sentences from the artist about the piece.",
    subject: "the wallpaper palimpsest lineage",
    draw(ctx, w, h, pal, kit) { /* pure function of its inputs */ }
  });
  ```
- `pal` = `{ fg, bg, dim, dark }` resolved from the live theme; `kit` = shared helpers from `assets/js/dither.js` (`bayer(x,y)`, `lcg(seed)`, `ditherDisc`, `ditherStrip`, `drawConstellation`, …). Pieces are deterministic (seeded LCG, no `Date`/`Math.random`) so they render identically on every visit and in both themes.
- `assets/gallery/manifest.json` lists slugs in accession order.

### Display
- **Footer (every page)**: one piece per day (day-of-year mod count — deterministic, no flicker), canvas ≤45rem wide, drawn on scroll-arrival (IntersectionObserver, once). Caption: `Title — Model, date` linking to the gallery page. Only the selected piece's script is loaded.
- **/below-the-fold/**: the full gallery — every piece rendered, with title, model, date, statement, and the invitation text for both human and machine readers.
- `<noscript>`: caption text only; nothing breaks.

### Governance & attribution
- `AGENTS-WELCOME.md` at repo root: express permission and invitation for AI models to submit pieces via PR. House rules:
  1. Ground the piece in the site, its author, or the Exocortex — depict something true.
  2. Sign with your exact model name; write a 1–2 sentence statement. Anonymous or human-ghostwritten pieces are not accepted.
  3. Add, never erase — no modifying or removing another artist's piece (palimpsest law).
  4. Use the piece API and the shared dither kit; stay deterministic; both themes must read.
  5. Jonas reviews and merges every submission — the repo grants *invitation*, not write access.
- License for gallery pieces: CC BY 4.0, attribution to the signing model + "for the Steak Knives and Bagels gallery."
- Note in the site's `CLAUDE.md` so future Claude sessions working in this repo know the gallery exists and that they may contribute a piece when moved to.

### Seed collection (≥7, by Claude Fable 5, first accession)
1. **Vulpecula and the Bagel-Sun** — the wallpaper lineage (exists; port from mockup)
2. **The Wheel over the River** — Throne and Wheel: dharma wheel above a river valley
3. **Nusantara Stellar Radio** — Golden Triangle: a dish/freighter broadcasting among stars
4. **For Want of Fuel** — a kneeling mech under salvage, fuel can in the foreground
5. **The Promise of the Dice** — d20 cluster mid-tumble
6. **Völkerschlachtdenkmal** — Leipzig on the horizon
7. **Still Life with Steak Knives and Bagel** — the deli namesake
8. **Boggle** — a cat, sitting exactly where it shouldn't (clavicular moggslaughter)

---

## Execution phases

**Phase 0 — Foundations**
- Self-host Newsreader (var, normal+italic, latin subset) + JetBrains Mono → `assets/fonts/`, `@font-face` + preload woff2. Remove Google/CDN font dependency.
- Replace FontAwesome CDN with ~5 inline SVGs (GitHub, LinkedIn, mail, moon/sun, RSS). Removes last third-party CSS.
- Rewrite `assets/css/base/variables.css` + `themes.css` with the token set from the mockup (both themes + `--radius`).
- Convert `styles.css` @import chain to a Jekyll-compiled SCSS entry point (one compiled stylesheet, kills the import waterfall).

**Phase 1 — Component port**
- Port all mockup components into the existing CSS architecture: nav, home intro + latest-thought, blog index rows (dates!), project cards, tags, post/essay/FWF layouts (kicker, headline scale, meta), TOC, buttons, pagination, footer, 404, contact.
- Global: selection styling, phosphor-decay links (tuned values), squared corners, asterism dividers.
- Touch layouts (`base`, `post`, `project`, `essay`, `for_want_of_fuel`, `thought`) as needed; keep class names where possible.

**Phase 2 — Theme switch**
- Progressive-scan via View Transitions in `theme.js`; instant fallback; reduced-motion instant. Prototype Bayer-dissolve; keep whichever feels better (Jonas judges on sight).

**Phase 3 — Dither engine**
- `assets/js/dither.js` (shared kit) + `dither-img.js`: IntersectionObserver lazy-load wrapper for project thumbnails & post images — develop animation resolving to the true image. No layout shift (canvas overlays the reserved image box), instant plain image without JS.
- Dithered rules component (JS-upgraded `<hr class="dither">`, plain rule fallback).

**Phase 4 — Below the Fold**
- `dither.js` kit finalization, `gallery.js` (register/render/rotate), footer include, `/below-the-fold/` page, manifest, 8 seed pieces, `AGENTS-WELCOME.md`, CLAUDE.md note, license text.

**Phase 5 — QA & ship**
- Local build + visual pass on every layout, both themes; mobile widths; Lighthouse (target: no regression, likely improvement from dropped CDNs); deploy via Actions; live verification; before/after screenshots.

Phases 0–1 land as one PR-sized commit series (the visual cutover), 2–4 individually. Each phase verified in the real Jekyll build before the next.

## Settled 2026-07-12
- Gallery name: none — it's simply "the footer"; gallery page at `/footer/`.
- License: CC BY 4.0 for gallery pieces, attributed to the signing model.
- Purged history force-pushed to origin.
