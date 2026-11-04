# Item 14 build comparison and verification

Compared updated main `9195f8a` with the item 14 branch. Main advanced during the
run; the branch was rebased before this final comparison, preserving Six Springs
and Pose to Shrine. Both builds ran in production mode after `llms_full.rb` and
`gallery_bundle.rb`. Main used its locked Jekyll 3.10 bundle in a local shared Git
clone, with a read-only cache of the repeated GEC1 front-matter glob to avoid the
known Windows slowdown. The branch used ordinary `bundle exec jekyll build`.
Dart Sass and Git subprocesses required running outside the Windows sandbox.
No build workaround or dependency-install step was added to CI.

## Resulting dependencies

Eight direct dependencies, 43 installed gems; full resolution is in Gemfile.lock.
Jekyll 4.4.1 replaces the github-pages bundle and its implicit Primer theme.

| Direct gem | Locked version | Purpose |
| --- | --- | --- |
| jekyll | 4.4.1 | Site generation, using the existing Actions deployment |
| jekyll-feed | 0.17.0 | Existing feed autodiscovery; custom combined Atom feed stays |
| jekyll-seo-tag | 2.8.0 | Existing sharing metadata |
| jekyll-sitemap | 1.4.0 | Explicit dependency, formerly provided by github-pages |
| jekyll-last-modified-at | 1.3.2 | Existing Git modification dates |
| webrick | 1.9.0 | Local serve |
| tzinfo-data | 1.2024.2 | Windows/JRuby timezone data |
| wdm | 0.2.0 | Windows watcher |

The Sass converter is 3.1.0 with Dart Sass (sass-embedded 1.107.1). Liquid stays
4.0.4; Kramdown becomes 2.5.2 and Rouge 4.7.0. No `redirect_from` front matter is
used, so jekyll-redirect-from is unnecessary: the existing redirect layout still
builds the Blog/Projects compatibility addresses. faraday-retry was needed by the
removed GitHub metadata bundle and is gone too.

## Output and URL checks

- Main: 2,350 files / 404 HTML. Branch: 2,191 files / 247 HTML. Of the retained
  HTML, 74 files differ and 173 are byte-identical. Every changed/removed HTML
  filename and its reason is listed below. Line endings, terminal newlines,
  generator version, asset version queries and build/Git timestamps were
  normalized when checking for other content changes.
- All 39 generated Markdown siblings copy through byte-for-byte as static `.md`;
  their optional-front-matter HTML duplicates disappear. All 157 removed HTML
  wrappers have a surviving static `.md` counterpart. Bench `display.html` still
  fetches those raw Markdown sources. No `/blog/<slug>.html` duplicate remains in
  output or sitemap; the Blog/Thoughts indexes retain their canonical sitemap URLs.
- Sitemap URL set loses only the two accidental Six Springs wrappers:
  `/six-springs/scenes/shrine/sound/CREDITS.html` and
  `/six-springs/scenes/shrine/speech/lines.html`. Their `.md` files remain. There
  were no references to those HTML URLs in the source. Every other sitemap URL
  is preserved, including private-page exclusions.
- 26 Atom entries retain IDs, titles, links, publication dates, content, summaries,
  authors and categories. Updated timestamps may reflect Git/build times.
- All 72 site SEO heads pass the sharing audit, including feed autodiscovery. The
  audit now recognizes the fingerprint query. Image-output audit passes: largest
  project candidates total 331,624 bytes AVIF / 591,400 bytes WebP.
- The 68 authored/copied HTML pages in each of GEC1 and GEC1 preview remain
  byte-identical. Six Springs and Pose to Shrine standalone index files are also
  byte-identical. Removing their auto-converted Markdown wrappers does not restyle
  the authored sites.
- The only new output file is `assets/css/styles.css.map`, emitted by Dart Sass.
  Primer's unused `assets/css/style.css` disappears. Root `AGENTS-WELCOME.md` and
  `CLAUDE.md` are now explicit pages and no longer get the old plugin's extra raw
  copies; their `.html` endpoints remain, with site chrome. Gallery rules were not
  edited. robots.txt already references `AGENTS-WELCOME.html`.
- Git lastmod values were checked against `git log` for a blog document and a fuel
  chapter: `2025-12-06T22:57:10+01:00` and `2026-11-01T16:22:43+01:00` respectively.
  The unchanged workflow keeps `fetch-depth: 0` in CI. Its deploy remains main-only;
  no Ubuntu/production deployment is claimed for this PR.

## CSS and browser checks

Compiled CSS is **not byte-identical**: 50,508 ? 50,244 bytes. Dart Sass changes
quotes, numeric/colour formatting, whitespace, equivalent calc/min expressions,
and emits a UTF-8 BOM and source-map comment. Chrome parsed both sheets into 450
ordered rules. After normalizing eight equivalent `transparent` / `rgba(0,0,0,0)`
values and four equivalent calc/min serializations, the rules/declarations match.
Static feature stylesheets and the gallery bundle are byte-identical to main.
The default and media-override builds produce identical compiled CSS hashes:
`291bad7080a744174370eef10e17126766d2268622698bd9b8d01d01366e49fa`.
All 176 emitted asset-version references match the actual output bytes.

Installed headless Chrome inspected home, the Lancer/5e post, FWF, Learn, Bagel,
and gallery at 375 and 1280px, light and dark: 24 before/after pairs (48 page
captures), **zero changed pixels in the 24 viewport pairs**. Reduced motion and
a fixed date/random seed made the comparison deterministic. Footer and gallery
artwork views, reference-page chrome and both demo screens were also inspected.
The full gallery still draws all eight pieces. No HTTP errors or uncaught JS
exceptions occurred in the final matrix/demo run.

FWF has pre-existing horizontal overflow in both builds: scrollWidth 430 at
375px, and 1324 at 1280px (the title/metadata/header region). This was observed and
left unchanged to keep this migration free of design changes.

Schneekugel actually reaches its start screen and enters play with local files,
and with WASM/PCK fetched from a separate local HTTP origin simulating R2. Both
payloads return 200, with WASM served as `application/wasm`; its loader JS stays
on the page origin. The two patched loader lookups use the exported SafeEngine
wrapper and retain the virtual PCK path and local worklet base.
Iso-engine New Game loads/decodes seven audio tracks with a running Web Audio
context in both modes; MP3 requests all return 200 from the expected origin.
All four migrated thought videos reach readyState 4 with positive duration in
both modes. These are local cross-origin tests, **not verification of the real
R2 objects or account settings**; Jonas performs those checks before activation.

Local QA evidence is under the ignored `_site/item14-qa/`: browser-results.json,
visual-results.json, media-playing.json, videos.json, CSSOM snapshots, per-page
PNGs and six overview JPEGs. The temporary media override is outside the tracked
config. Nothing was uploaded, no credentials were read, and all 32 manifest
objects remain tracked with `media_base: ""`.

## Every retained HTML file that differs

All site-layout pages carry changed stylesheet/gallery hashes and the Jekyll
4 generator tag. Beyond these mechanical changes and normalized timestamps, only
the two reference pages, two media loaders and one Rouge code block differ.

| Output file | Reason |
| --- | --- |
| `404.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `AGENTS-WELCOME.html` | Explicit base layout replaces Primer; hashes/metadata and Rouge highlighting; invitation/rules text unchanged. |
| `CLAUDE.html` | Explicit base layout replaces Primer; Jekyll version documentation, hashes/metadata and Rouge highlighting. |
| `about.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `assets/games/schneekugel/schneekugel-godot.html` | Standalone loader renders the config-gated WASM/PCK URL map; local scripts/icons retained. |
| `assets/iso-engine/index.html` | Standalone loader renders the config-gated audioPath; image and scene paths retained. |
| `bagel/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `blog/adverse-selection/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `blog/ai-for-game-dev-talk-archive/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `blog/ai-gamedev-talk-2025-update/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `blog/ask-the-archives/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `blog/crits-lancer-vs-5e/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `blog/cryoarithmetic-engine/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `blog/game-design-talk-magdeburg/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `blog/half-life-alyx-vr-notes/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `blog/high-water/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `blog/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `blog/lunar-liches-encounters/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `blog/lunar-liches/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `blog/obsidian-archive/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `blog/opus-5-5-video-experiments/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `blog/press-a-to-learn/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `blog/spiritual-output-medieval-society/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `blog/ytmusic-mcp/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `contact.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `footer/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `for-want-of-fuel/01-core-loop/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `for-want-of-fuel/02-damage-model/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `for-want-of-fuel/03-narrative-themes/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `for-want-of-fuel/04-mechanics/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `for-want-of-fuel/05-frames/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `for-want-of-fuel/06-weapons/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `for-want-of-fuel/07-fittings/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `for-want-of-fuel/08-standard-template-mechs/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `for-want-of-fuel/09-mech-builder/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `for-want-of-fuel/09-tag-glossary/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `for-want-of-fuel/10-referee-guide/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `for-want-of-fuel/11-settlements/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `for-want-of-fuel/12-travel/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `for-want-of-fuel/20-media-inspiration/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `for-want-of-fuel/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `impressum.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `learn.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `projects/babel-below.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `projects/bcs-radio.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `projects/council-decides.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `projects/endstation.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `projects/for-want-of-fuel.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `projects/golden-triangle.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `projects/high-water.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `projects/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `projects/isometric-game-engine.html` | Hashes/generator plus Rouge 4 function/class span names in the existing TypeScript example. |
| `projects/mondnacht.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `projects/obsidian-archive.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `projects/rpg-notetaker-bench/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `projects/schneekugel.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `projects/six-springs.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `projects/srd-framework.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `projects/swn-character-sheet.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `projects/tausendkorn.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `projects/workshop-zuteilungs-tool.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `talks/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `teaching/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `thoughts/boggle-baby/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `thoughts/clavicular-moggslaughter/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `thoughts/computers-can-now-think/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `thoughts/experiments-with-opus-5-5-and-video/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `thoughts/further-experiments-in-automated-shortform-content/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `thoughts/hard-times-create-strong-jaws/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `thoughts/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `thoughts/infinite-content/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `thoughts/language-large-general/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |
| `thoughts/machine-intelligences-in-the-evals/index.html` | Content hashes and Jekyll generator version; no body change after normalization. |

## Every removed HTML wrapper

Every filename below was generated from front-matter-free Markdown by the old
GitHub Pages optional-front-matter plugin. Jekyll 4 now copies the `.md` file
verbatim and emits no duplicate HTML wrapper. No tracked HTML source was removed.

### Generated Blog / Thoughts / FWF siblings (39)

```text
blog/adverse-selection.html
blog/ai-for-game-dev-talk-archive.html
blog/ai-gamedev-talk-2025-update.html
blog/ask-the-archives.html
blog/crits-lancer-vs-5e.html
blog/cryoarithmetic-engine.html
blog/game-design-talk-magdeburg.html
blog/half-life-alyx-vr-notes.html
blog/high-water.html
blog/lunar-liches-encounters.html
blog/lunar-liches.html
blog/obsidian-archive.html
blog/opus-5-5-video-experiments.html
blog/press-a-to-learn.html
blog/spiritual-output-medieval-society.html
blog/ytmusic-mcp.html
for-want-of-fuel/01-core-loop.html
for-want-of-fuel/02-damage-model.html
for-want-of-fuel/03-narrative-themes.html
for-want-of-fuel/04-mechanics.html
for-want-of-fuel/05-frames.html
for-want-of-fuel/06-weapons.html
for-want-of-fuel/07-fittings.html
for-want-of-fuel/08-standard-template-mechs.html
for-want-of-fuel/09-mech-builder.html
for-want-of-fuel/09-tag-glossary.html
for-want-of-fuel/10-referee-guide.html
for-want-of-fuel/11-settlements.html
for-want-of-fuel/12-travel.html
for-want-of-fuel/20-media-inspiration.html
thoughts/boggle-baby.html
thoughts/clavicular-moggslaughter.html
thoughts/computers-can-now-think.html
thoughts/experiments-with-opus-5-5-and-video.html
thoughts/further-experiments-in-automated-shortform-content.html
thoughts/hard-times-create-strong-jaws.html
thoughts/infinite-content.html
thoughts/language-large-general.html
thoughts/machine-intelligences-in-the-evals.html
```

### Bench / talk raw Markdown sources (8)

```text
assets/rpg_notetaker_bench/Dicing With Death-8b0b5732-4fed-4c1d-841d-1d9efb6c5acc.html
assets/rpg_notetaker_bench/Dicing With Death-8b0b5732-4fed-4c1d-841d-1d9efb6c5acc_gpt_4.1.html
assets/rpg_notetaker_bench/Dicing With Death-8b0b5732-4fed-4c1d-841d-1d9efb6c5acc_gpt_4o.html
assets/rpg_notetaker_bench/Dicing With Death-8b0b5732-4fed-4c1d-841d-1d9efb6c5acc_gpt_4o_mini.html
assets/rpg_notetaker_bench/Dicing With Death-8b0b5732-4fed-4c1d-841d-1d9efb6c5acc_o1_mini.html
assets/rpg_notetaker_bench/Dicing With Death-8b0b5732-4fed-4c1d-841d-1d9efb6c5acc_o3_mini.html
assets/rpg_notetaker_bench/Dicing With Death-8b0b5732-4fed-4c1d-841d-1d9efb6c5acc_o4_mini.html
assets/talks/ai-gamedev-2025/CONVENTIONS.html
```

### Six Springs raw credits and speech notes (2)

```text
six-springs/scenes/shrine/sound/CREDITS.html
six-springs/scenes/shrine/speech/lines.html
```

### GEC1 and preview Markdown siblings (authored directory index pages stay) (108)

```text
teaching/gec1-vorschau/beispiele/HERKUNFT.html
teaching/gec1-vorschau/concepts/ai-register.html
teaching/gec1-vorschau/concepts/animation.html
teaching/gec1-vorschau/concepts/animator.html
teaching/gec1-vorschau/concepts/branch.html
teaching/gec1-vorschau/concepts/build.html
teaching/gec1-vorschau/concepts/collision.html
teaching/gec1-vorschau/concepts/commit.html
teaching/gec1-vorschau/concepts/component.html
teaching/gec1-vorschau/concepts/condition.html
teaching/gec1-vorschau/concepts/console.html
teaching/gec1-vorschau/concepts/delta-time.html
teaching/gec1-vorschau/concepts/devlog.html
teaching/gec1-vorschau/concepts/diff.html
teaching/gec1-vorschau/concepts/event.html
teaching/gec1-vorschau/concepts/feedback.html
teaching/gec1-vorschau/concepts/frame.html
teaching/gec1-vorschau/concepts/game-object.html
teaching/gec1-vorschau/concepts/git.html
teaching/gec1-vorschau/concepts/graph.html
teaching/gec1-vorschau/concepts/light.html
teaching/gec1-vorschau/concepts/material.html
teaching/gec1-vorschau/concepts/playtest.html
teaching/gec1-vorschau/concepts/prefab.html
teaching/gec1-vorschau/concepts/reference.html
teaching/gec1-vorschau/concepts/repository.html
teaching/gec1-vorschau/concepts/revert.html
teaching/gec1-vorschau/concepts/rigidbody.html
teaching/gec1-vorschau/concepts/scene.html
teaching/gec1-vorschau/concepts/state.html
teaching/gec1-vorschau/concepts/tag.html
teaching/gec1-vorschau/concepts/torque.html
teaching/gec1-vorschau/concepts/transform.html
teaching/gec1-vorschau/concepts/ui.html
teaching/gec1-vorschau/concepts/update.html
teaching/gec1-vorschau/concepts/vector.html
teaching/gec1-vorschau/days/01.html
teaching/gec1-vorschau/days/02.html
teaching/gec1-vorschau/days/03.html
teaching/gec1-vorschau/days/04.html
teaching/gec1-vorschau/days/05.html
teaching/gec1-vorschau/days/06.html
teaching/gec1-vorschau/guides/claude-code-and-codex.html
teaching/gec1-vorschau/guides/create-project-without-template.html
teaching/gec1-vorschau/guides/create-project.html
teaching/gec1-vorschau/guides/downloads.html
teaching/gec1-vorschau/guides/first-commit.html
teaching/gec1-vorschau/guides/github.html
teaching/gec1-vorschau/guides/install-git.html
teaching/gec1-vorschau/guides/install-unity.html
teaching/gec1-vorschau/guides/overview.html
teaching/gec1-vorschau/guides/update-package.html
teaching/gec1-vorschau/guides/vscode-and-agent.html
teaching/gec1-vorschau/schluesselbilder/HERKUNFT.html
teaching/gec1/beispiele/HERKUNFT.html
teaching/gec1/concepts/ai-register.html
teaching/gec1/concepts/animation.html
teaching/gec1/concepts/animator.html
teaching/gec1/concepts/branch.html
teaching/gec1/concepts/build.html
teaching/gec1/concepts/collision.html
teaching/gec1/concepts/commit.html
teaching/gec1/concepts/component.html
teaching/gec1/concepts/condition.html
teaching/gec1/concepts/console.html
teaching/gec1/concepts/delta-time.html
teaching/gec1/concepts/devlog.html
teaching/gec1/concepts/diff.html
teaching/gec1/concepts/event.html
teaching/gec1/concepts/feedback.html
teaching/gec1/concepts/frame.html
teaching/gec1/concepts/game-object.html
teaching/gec1/concepts/git.html
teaching/gec1/concepts/graph.html
teaching/gec1/concepts/light.html
teaching/gec1/concepts/material.html
teaching/gec1/concepts/playtest.html
teaching/gec1/concepts/prefab.html
teaching/gec1/concepts/reference.html
teaching/gec1/concepts/repository.html
teaching/gec1/concepts/revert.html
teaching/gec1/concepts/rigidbody.html
teaching/gec1/concepts/scene.html
teaching/gec1/concepts/state.html
teaching/gec1/concepts/tag.html
teaching/gec1/concepts/torque.html
teaching/gec1/concepts/transform.html
teaching/gec1/concepts/ui.html
teaching/gec1/concepts/update.html
teaching/gec1/concepts/vector.html
teaching/gec1/days/01.html
teaching/gec1/days/02.html
teaching/gec1/days/03.html
teaching/gec1/days/04.html
teaching/gec1/days/05.html
teaching/gec1/days/06.html
teaching/gec1/guides/claude-code-and-codex.html
teaching/gec1/guides/create-project-without-template.html
teaching/gec1/guides/create-project.html
teaching/gec1/guides/downloads.html
teaching/gec1/guides/first-commit.html
teaching/gec1/guides/github.html
teaching/gec1/guides/install-git.html
teaching/gec1/guides/install-unity.html
teaching/gec1/guides/overview.html
teaching/gec1/guides/update-package.html
teaching/gec1/guides/vscode-and-agent.html
teaching/gec1/schluesselbilder/HERKUNFT.html
```
