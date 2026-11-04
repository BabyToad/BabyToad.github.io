# Media handoff

`ruby scripts/media_manifest.rb --check` verifies the R2 inventory against local
bytes; omit `--check` to regenerate it. This uses only Ruby's standard library.
Jonas performs the upload and account changes using [upload-media.md](upload-media.md).
All inventory files remain tracked while `_config.yml` has `media_base: ""`.
The `media_url` Liquid filter prefixes site-relative thought video/download URLs
at rendering time; their YAML `videos[].src` paths stay literal, since front
matter does not evaluate Liquid. Existing external videos keep their own URLs.
The Godot loader's two payload lookups use `Engine.fileUrls`; its worklet base and
virtual PCK path stay local. The iso-engine bundle's two audio-path resolvers use
`config.audioPath`, supplied by its page, while image/scene paths stay local.
Preserve these small integration patches if re-exporting either upstream demo.

# Gallery bundle

Before every local Jekyll build or serve (and again after adding/changing gallery
sources), run from the repository root:

```powershell
ruby scripts/llms_full.rb
ruby scripts/gallery_bundle.rb
bundle exec jekyll build
```

The Pages workflow runs these same pre-build scripts. `gallery_bundle.rb` uses
only Ruby's standard library: it concatenates `assets/js/gallery.js` followed by
the piece files in `assets/gallery/manifest.json` accession order. The manifest
is the source of truth and must match all numbered piece filenames, with unique
slugs and accession numbers; a mismatch fails the build before Jekyll runs.
Contributors add only their piece file and its manifest entry. Never edit an
existing piece. See [`AGENTS-WELCOME.md`](../AGENTS-WELCOME.md) for the contract.

The generated `assets/js/gallery-bundle.js` is gitignored and copied by Jekyll.
The footer makes one deferred request for it; `/footer/` still has every piece.
Daily selection, click-to-next and theme redraw use the unchanged renderer.
This reduces requests rather than payload size; each piece remains independently
authored and signed. Do not commit or hand-edit the bundle.

# Responsive images

Run from the repository root, after adding or changing images:

```powershell
uv --no-cache run --no-project --python C:/Users/heink/AppData/Local/Programs/Python/Python311/python.exe python scripts/images.py
uv --no-cache run --no-project --python C:/Users/heink/AppData/Local/Programs/Python/Python311/python.exe python scripts/images.py --check
uv --no-cache run --no-project --python C:/Users/heink/AppData/Local/Programs/Python/Python311/python.exe python scripts/check_image_output.py --site _site
```

On another machine, replace the Python path with an interpreter containing
Pillow 12.1.0 with WebP and AVIF codecs. `uv --no-cache run --no-project --python
python python scripts/images.py` also works when that is the default interpreter.
The script does not install tools. This machine already had uv and Pillow 12.1.0
with both codecs; neither cwebp nor ImageMagick was available. There is no new
Jekyll/CI dependency: commit the derivatives and `_data/images.json` together.

The script scans PNG/JPEG/WebP files only in `assets/images`, preserving originals,
alpha, aspect ratio and EXIF orientation. It writes WebP (quality 82, method 6) and
AVIF (quality 55, speed 6) at 480 and 960 pixels wide, capped at the original size
without upscaling. Small originals may have only one distinct width. Animated
files, SVG and ICO remain untouched. Generated `-<width>w.webp` / `-<width>w.avif`
suffixes are reserved: the script skips those inputs and removes stale derivatives
inside this directory. Source images must have unique stems within each folder.
Every derivative must be at most 500,000 bytes. `--check` verifies source hashes,
derivative hashes, dimensions, sizes, coverage and stale files without writing.
Byte-for-byte regeneration uses the same Pillow/codec versions.

Use original URLs in front matter. Project cards, project thumbnails and thought
images use `_includes/responsive-image.html` to look up the manifest. For prose
images in projects or posts, use this instead of Markdown image syntax:

```liquid
{% include responsive-image.html src="/assets/images/projects/swn-sheet-character.png" alt="Character sheet overview" %}
```

Optional parameters: `sizes`, `class` (on the img), `loading` (default lazy),
`dither=true`, and `width`/`height` for images outside the manifest. The default
`sizes` assumes prose up to 800px wide; project cards and detail headers override
it. Images without metadata retain their original URL. Ordinary Markdown images
and video poster attributes are not rewritten automatically. Current blog posts
use video posters rather than inline local images; those posters keep their URLs.

Pictures expose intrinsic width/height on the img and reserve its aspect ratio
without JavaScript. The dither hook observes `img[data-dither]`, waits for its load,
wraps the entire picture, then draws from that same img. Canvas `drawImage(img)`
uses the decoded browser-selected `currentSrc`; no original is loaded by JS and
the img stays inside its source-selection context. The card's crop is preserved
through both wrappers. Reduced motion and the final plain-image reveal still use
the existing Dither engine. Thought alternates switch the complete picture panel;
with JavaScript disabled all alternatives remain visible.

After a Jekyll build, `check_image_output.py` checks emitted local image markup and
files, and enforces a conservative projects-index budget: every card's largest
candidate, for each format separately, must total less than 1,000,000 bytes. It
also reports the smallest candidates and img-only fallback. The budget applies
to the AVIF and WebP picture sources; the img fallback deliberately references
the original for crawlers and clients without picture support. Add `--baseline PATH`
to compare with a separate main build. These are asset bytes for all cards, not a
browser network trace; native lazy loading can defer off-screen cards. The audit
skips copied teaching pages and assets, which this pipeline does not manage.


# Sharing card and metadata

Regenerate the committed 1200x630 card (no network access needed):

```powershell
uv --no-cache run --no-project --python C:/Users/heink/AppData/Local/Programs/Python/Python311/python.exe python scripts/site_card.py
uv --no-cache run --no-project --python C:/Users/heink/AppData/Local/Programs/Python/Python311/python.exe python scripts/images.py
```

Use Pillow 12.1.0, as for the image pipeline above. `site_card.py` draws Newsreader
at weight 400, display optical size 72 and subtitle optical size 18, with the
footer's 8x8 Bayer thresholds. It writes a palette-indexed, strictly two-colour
PNG (`#ffb000` / `#141210`), without random values or timestamps, under 300 KB.
The second command updates its responsive derivatives and the manifest; Jekyll
and social previews use the original PNG. No Python or font download runs in CI.

`scripts/fonts/Newsreader.ttf` is the unmodified 451,664-byte variable TTF from
[google/fonts at 8b0a1d0](https://github.com/google/fonts/tree/8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5/ofl/newsreader),
originally named `Newsreader[opsz,wght].ttf`. Its SIL Open Font License is included
as `scripts/fonts/OFL.txt`. The font is build tooling only and excluded from the
published site along with `scripts/`.

The global front matter `image` default in `_config.yml` supplies the site card
to jekyll-seo-tag. Override it in documents with an original PNG/JPEG/WebP or a
960w WebP, never AVIF. Projects use their thumbnail; thoughts use the first image
or video poster. `show_image: true` opts a thought's single `image` into its body;
otherwise `image` is metadata only. This prevents inherited defaults or inline
video posters from becoming extra visible figures. The existing `images` and
`videos` arrays keep their display behavior.

# Combined Atom feed

`feed.xml` combines all published Blog and Thoughts documents, newest first,
without a ten-entry cap: frequent thoughts must not evict the existing blog
entries. Existing entry IDs, dates, links and content follow jekyll-feed 0.17.0.
Draft/private/noindexed documents are excluded. Thoughts include their media
from the same include used on the page. Subscribers stay on `/feed.xml`; no
second subscription or additional visible links are necessary. `{% feed_meta %}`
in the base head advertises this same URL.

jekyll-feed 0.17.0 can generate separate collection feeds but cannot merge them.
The local template adapts its Atom template (MIT license preserved in
`docs/jekyll-feed-LICENSE.txt`). The plugin intentionally skips a feed path that
already exists in the source. Keep the plugin for its autodiscovery tag; compare
the local template with upstream when upgrading it.

After building, validate metadata and compare with an isolated main build:

```powershell
uv --no-cache run --no-project --python C:/Users/heink/AppData/Local/Programs/Python/Python311/python.exe python scripts/check_sharing_output.py --site _site/current-build --baseline _site/baseline-build
```

The comparison requires identical HTML bodies after normalizing picture fallback
URLs and the existing image-alternates build-time query string. It checks every
SEO head, with RSS autodiscovery required on the site's base layout (including
the repository reference pages). Sitemap structure and URLs must be
identical; `lastmod` timestamps are compared separately in review because the
plugin derives them from Git commits and static-file checkout mtimes. Metadata
commits legitimately update document dates; timestamps are not pinned to hide it.
