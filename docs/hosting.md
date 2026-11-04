# Hosting and cache checklist for Jonas

GitHub Pages remains the origin, built and deployed by `.github/workflows/pages.yml`.
Cloudflare proxies the site; R2's existing `media.allknivesnobagel.com` host serves
large media. Jekyll 4 runs directly in Actions, without the `github-pages` gem or
a plugin whitelist. Full-history checkout stays enabled for git modification dates.
Git history is deliberately kept: removal is a later ordinary commit, never a
purge or force push. See [the media upload handoff](../scripts/upload-media.md).

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

The media handoff is deliberately gated: this PR leaves `media_base: ""` and all
32 files tracked. Jonas uploads, verifies hashes/headers/CORS and playback, then
requests the activation/removal PR. No deployment-size or Git-size reduction is
claimed before that step. Image originals remain pipeline sources in the repo.

Cloudflare references: [Cache Rules settings](https://developers.cloudflare.com/cache/how-to/cache-rules/settings/),
[cache keys and query strings](https://developers.cloudflare.com/cache/how-to/cache-keys/),
[edge/browser TTL](https://developers.cloudflare.com/cache/how-to/edge-browser-cache-ttl/).
