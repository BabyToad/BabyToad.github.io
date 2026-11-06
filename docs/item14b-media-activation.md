# R2 activation verification (2026-11-06)

Compared `origin/main` at `30a5466` with the media activation on
`upgrade/14b-media-activation`. Both production builds ran
`ruby scripts/llms_full.rb` and `ruby scripts/gallery_bundle.rb` first.

## Public object checks

All 32 manifest URLs returned HTTPS 200 with exact source byte sizes
(137,641,848 bytes total), manifest MIME types,
`Cache-Control: public, max-age=31536000, immutable` and
`Access-Control-Allow-Origin: *`. HEAD used `Accept-Encoding: identity` because
Cloudflare can gzip WASM responses without a source-byte Content-Length.
Representative WASM, MP4 and MP3 GETs with `Range: bytes=0-1023` returned 206,
exact Content-Range totals and 1,024 bytes. WASM Range preflight returned 204.
No account settings or credentials were read or changed.

## Output comparison

Main emits 2,282 files; activation emits 2,250. Exactly the 32 manifest payloads
are absent, saving 137,641,848 bytes (131.27 MiB) in the deployment even with all
32 ignored offline copies still on disk. No other file is removed or added.
2,226 retained files are byte-identical, including CSS, JS, images, standalone
teaching pages and Bagel. The 24 changed files are:

- `CLAUDE.html` and `colophon/index.html`: the documented media state.
- `assets/games/schneekugel/schneekugel-godot.html` and
  `assets/iso-engine/index.html`: the remote payload map and audioPath.
- `feed.xml`, `thoughts/index.html`,
  `thoughts/further-experiments-in-automated-shortform-content/index.html`,
  `thoughts/hard-times-create-strong-jaws/index.html` and
  `thoughts/language-large-general/index.html`: media-host video sources and
  download links, plus feed build time.
- The 15 `for-want-of-fuel/**/index.html` pages: only their existing generated
  `article:published_time` and JSON-LD `datePublished` build timestamps.

After normalizing those generated timestamps and the intended media-host
prefix, there are no unexplained differences. The two documentation pages are
reviewed separately. Front matter retains literal paths; rendering applies
`media_url`. Loader JS, worklets, icons, scene and image paths remain local.

## Chrome

Installed headless Chrome 156.0.8078.81 loaded the local production build with
ordinary cross-origin requests to the real HTTPS media host; no proxy or
CORS/security override was used.

- `/thoughts/`: all four R2 videos reached readyState 3 or 4, with media-host
  currentSrc and 206 responses. Existing release-hosted videos also loaded.
- `/bagel/`: the existing GitHub-release source is unchanged and reached
  readyState 4, duration 428.54 seconds.
- Schneekugel loader: remote WASM and PCK returned 200; engine startup resolved,
  the loading overlay disappeared and the rendered title screen was inspected.
- `/assets/iso-engine/`: New Game fetched and decoded all seven startup MP3s
  through Web Audio and entered the scene; the rendered scene was inspected. Both demos had no page errors or failed requests.

Video request cancellations caused by the explicit metadata reload and native
range buffering were recorded as ERR_ABORTED; all video elements still reached
metadata or better with no MediaError. This is local Windows build/browser
verification, not a claim of a deployed production or Ubuntu build.

## Repository size and compatibility

At baseline and after build verification, `git count-objects -vH` is unchanged:
200 loose objects / 398.81 KiB; 7,686 packed objects in four packs / 235.31 MiB.
New commits add only small Git objects; historical media is retained, so Git
storage and historical clone size do not shrink. The checkout stops tracking
131.27 MiB, while local offline copies remain intact.

Old site-origin direct media URLs will leave Pages. Optional exact-path
Cloudflare redirects are documented, with no account-side changes in this PR.
