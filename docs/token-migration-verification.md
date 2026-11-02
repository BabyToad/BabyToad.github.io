# Token migration verification

Compared origin/main `6609798` with the item 12 branch, using installed headless
Chrome and Pillow. Screenshot artifacts and local harnesses remain under ignored
`_site/token-audit/`; no images, binaries, or build workarounds are committed.

## Counts and size

| Measure | Main | Branch |
| --- | ---: | ---: |
| Legacy alias references in assets/css CSS + SCSS | 236 | 0 |
| Legacy references in the bench's existing inline CSS | 9 | 0 |
| Other undefined legacy references (font-system, shadow-md) | 2 | 0 |
| Alias definitions (both themes + variables) | 53 | 0 |
| !important declarations in assets/css | 214 | 5 |
| Distinct literal media width values | 13 | 11 |
| Compiled styles.css bytes | 61,807 | 50,491 |
| Compiled styles.css gzip bytes | 11,040 | 9,463 |
| Compiled + six feature-sheet bytes | 124,516 | 112,656 |

The compiled sheet is 18.3% smaller. Counts refer to this stylesheet system;
standalone games, copied teaching assets, and slide/example documents are outside
it. Radio retains its independent palette. Its feature sheet was audited too.
The six separately loaded sheets (FWF, SRS, player, bench, image-alternates, radio)
and compiled CSS contain no removed alias name. There are no browser @imports.
Neither d-flex nor mt-3 had a remaining markup consumer on main: no class rename
was needed. The only Markdown source change is nine variable names inside the
bench's existing style block; its prose, HTML structure and front matter stay the
same. The two previously undefined properties now explicitly preserve their
rendered inherit/none values.

## Build and output checks

Both required Ruby pre-build scripts ran before each build. Main passed the normal
`bundle exec jekyll build`. Jekyll 3 on this Windows checkout then spent minutes
in frontmatter_defaults.rb, repeatedly globbing the same unchanged
`teaching/gec1/**/*.md` scope. A local Ruby launcher cached only that read-only
Dir.glob result and invoked the same Jekyll CLI. Main and branch both passed with
that launcher (about 115 / 116 seconds). Main's normal and cached builds have
identical CSS bytes and all 399 HTML bodies match. The workaround is local only;
CI and repository build commands are unchanged. An earlier checkout build stalled
across the machine's overnight suspension and was discarded.

The final build's CSS sources match the final branch after normalizing checkout
line endings. Across 399 main/branch HTML bodies, only the intentionally shortened
CLAUDE page differs after accounting for the bench's nine CSS substitutions and a
Git revision cache key in the generated slide conventions page. No template or
content structure changed. Bundler dependency check and whitespace checks pass.

## Pixel comparison

Full-page captures, 1x device scale, 900px viewport height, widths 375 and 1280,
both themes. The date and random seed were fixed; reduced motion was enabled,
fonts and images settled, and the viewport traversed every page to trigger lazy
images and gallery arrivals. No element masks or pixel tolerance were used.
Every differing RGB pixel is counted (including size differences).

For Home, Thoughts, the single thought and Bagel, the final comparison blocks
video requests, shows identical poster states and removes native video controls
in the test harness on both sides. Custom player controls remain. This excludes
browser-owned buffering/overlay animation from the CSS comparison; it does not
change the shipped page. Other captures use the live JS and media configuration.
Radio uses its standalone palette in both theme-storage conditions.

| Page | Light 375 | Light 1280 | Dark 375 | Dark 1280 |
| --- | ---: | ---: | ---: | ---: |
| Home (`/`) | 0 | 0 | 0 | 0 |
| Blog index (`/blog/`) | 0 | 0 | 0 | 0 |
| Post: Critical Analysis (`/blog/crits-lancer-vs-5e/`) | 0 | 0 | 0 | 0 |
| Projects index (`/projects/`) | 0 | 0 | 0 | 0 |
| Project: SRD Framework (`/projects/srd-framework.html`) | 0 | 0 | 0 | 0 |
| Essay: Golden Triangle (`/projects/golden-triangle.html`) | 0 | 0 | 0 | 0 |
| Thoughts index (`/thoughts/`) | 0 | 0 | 0 | 0 |
| Thought: A Language Large & General (`/thoughts/language-large-general/`) | 0 | 0 | 0 | 0 |
| Talks (`/talks/`) | 0 | 0 | 0 | 0 |
| Teaching (`/teaching/`) | 0 | 0 | 0 | 0 |
| About (`/about.html`) | 0 | 0 | 0 | 0 |
| FWF index (`/for-want-of-fuel/`) | 0 | 0 | 0 | 0 |
| FWF: Core Loop (`/for-want-of-fuel/01-core-loop/`) | 0 | 0 | 0 | 0 |
| Learn (`/learn.html`) | 0 | 0 | 0 | 0 |
| Bagel (`/bagel/`) | 0 | 0 | 0 | 0 |
| RPG Notetaker Bench (`/projects/rpg-notetaker-bench/`) | 0 | 0 | 0 | 0 |
| Footer gallery (`/footer/`) | 0 | 0 | 0 | 0 |
| 404 (`/404.html`) | 0 | 0 | 0 | 0 |
| Radio (standalone palette) (`/radio.html`) | 0 | 0 | 0 | 0 |

All 76 final comparisons are zero. The original unblocked-media pass was also
zero everywhere except these three pages:

| Page | Light 375 | Light 1280 | Dark 375 | Dark 1280 |
| --- | ---: | ---: | ---: | ---: |
| Home | 17 | 26 | 18 | 30 |
| Thoughts index | 32 | 122311 | 137 | 122209 |
| Thought: A Language Large & General | 420 | 427 | 34 | 326 |

Home's differences were Chrome's native timeline thumb. Thoughts had native
buffer indicators plus one black-versus-ready Bagel poster/frame at desktop;
the single thought had native buffering/control overlay differences. Inspected
before/after crops locate all these differences inside video rectangles. A
poster-only pass still showed native error/overlay animation, so the final pass
also removes only browser-owned controls on those videos. Original unblocked
screenshots and counts are retained separately under raw/ and raw-results.json.
No CSS-related difference remains.

Visual inspection covered all 19 pages' headers, content starts and footers in
four theme/width contact sheets, plus detailed post prose/footnote references,
bench tabs and its iframe, and the gallery pieces. The existing FWF phone heading
clipping is present in both builds and retained by this no-change migration.

## Review decisions

The base container keeps content.css's winning 2rem padding and flex column;
grid.css's 19px/1.65 typography moved into that definition. Mobile padding and all
layout modifiers are preserved. See [CSS maintenance](css-maintenance.md).

Three general thresholds are 480 / 768 / 900px. Exceptions remain at 400px (SRS),
600px (ledgers/SRS/radio), 640px (player), 1200px (wide grids), 32rem (footer), and
1339.98 / 1340px (paired sidenote modes). 769px is the inclusive complement of
768px in the nav. The unused 1012px utility tier and redundant 767px glossary
rule disappear. Forcing three total thresholds would change rendering between
widths; this PR keeps the measured exceptions instead. No broader responsive
redesign was attempted.
