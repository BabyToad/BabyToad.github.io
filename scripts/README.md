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
also reports the smallest candidates and img-only fallback. Add `--baseline PATH`
to compare with a separate main build. These are asset bytes for all cards, not a
browser network trace; native lazy loading can defer off-screen cards. The audit
skips copied teaching pages and assets, which this pipeline does not manage.
