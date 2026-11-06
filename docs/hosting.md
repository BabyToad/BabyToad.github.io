# Hosting and cache checklist for Jonas

GitHub Pages remains the origin, built and deployed by `.github/workflows/pages.yml`.
Cloudflare proxies the site; R2's existing `media.allknivesnobagel.com` host serves
large media. Jekyll 4 runs directly in Actions, without the `github-pages` gem or
a plugin whitelist. Full-history checkout stays enabled for git modification dates.
The 32 objects in `scripts/media-manifest.txt` are live in bucket `aknb-media`;
`media_base` points to `https://media.allknivesnobagel.com`. Their 137,641,848 bytes
(131.27 MiB) are no longer tracked in the checkout or copied into the deployment.
Git history is deliberately kept, so historical media still contributes to Git
object storage and clone size. No purge or force push is used. See
[the media maintenance guide](../scripts/upload-media.md).

In Cloudflare → the `allknivesnobagel.com` zone → Caching → Cache Rules:

- [ ] Check existing rules before adding these; remove any blanket year-long
  HTML rule. Scope site rules to hostnames `www.allknivesnobagel.com` and
  `allknivesnobagel.com`, leaving the media host's existing setup intact.
- [ ] Fonts: path **starts with** `/assets/fonts/`. Set cache eligibility to
  **Eligible for cache**, Edge TTL to **Ignore cache-control header and use this
  TTL: 1 year (31536000 seconds)**, Browser TTL to **Override origin: 1 year**.
  Use new filenames if font bytes change.
- [ ] Fingerprinted assets: path **starts with** `/assets/` and query string
  **starts with** `v=`. The site emits only a 16-hex content hash in this query.
  Use the same eligibility, Edge TTL and Browser TTL settings as fonts. Keep
  the **default cache key, including the full query string**; do not enable
  Ignore Query String or strip `v` in another rule. Restrict this rule to these
  asset URLs; unversioned CSS/JS keeps its origin policy.
- [ ] HTML and everything outside those two rules: preserve default cache
  eligibility and origin Cache-Control, with Browser TTL **Respect existing
  headers**. Do not apply Cache Everything or a forced long TTL to HTML, `.html`
  pages, directory URLs, the feed or sitemap. The asset rules must not match them.
- [ ] After deployment, copy a real `styles.css?v=…` URL from View Source and
  request it twice (`curl.exe -I 'COPIED_URL'`). Check year-long browser caching
  and `CF-Cache-Status` / `Age`. Check a page and an unversioned asset still keep
  their origin caching policy. A source change must produce a different hash URL.
- [ ] Purge-on-deploy is optional. A manual URL purge can refresh HTML quickly;
  fingerprinted asset URLs change automatically. The current workflow needs no
  Cloudflare token. A purge cannot evict an already cached browser response, so
  it does not replace fingerprinting.

The `?v=` scheme hashes the compiled stylesheet bytes (including Liquid CSS
includes), conditional stylesheets and the generated gallery bundle. No clock or
previous build output is involved. GitHub Pages can keep its origin CSS TTL;
new deployments request a new URL when bytes change. Keep old asset cache entries
until expiry; they do not need purging.

Large media belongs in R2, never in a new Git commit. Upload with the same
`assets/...` object-key layout, the correct Content-Type and
`Cache-Control: public, max-age=31536000, immutable`; use a new filename when bytes
change. Reference site-relative paths through `media_url`. The bucket permits
public GET/HEAD with CORS, Range requests and exposed range/length headers for
Godot, Web Audio and video playback. Verify HTTPS bytes and browser loading
before publishing a reference. Ignored offline copies may stay on disk; Jekyll's
media exclusions keep them out of `_site`. Image originals remain pipeline
sources in the repo. The Bagel video on a GitHub release keeps its existing URL.

Old direct site-origin media URLs are no longer served by Pages. If preserving
shared direct links is needed, add Cloudflare redirects for the exact manifest
paths to their media-host URLs, preserving query strings. This activation does
not change account-side redirect rules.

Cloudflare references: [Cache Rules settings](https://developers.cloudflare.com/cache/how-to/cache-rules/settings/),
[cache keys and query strings](https://developers.cloudflare.com/cache/how-to/cache-keys/),
[edge/browser TTL](https://developers.cloudflare.com/cache/how-to/edge-browser-cache-ttl/).
