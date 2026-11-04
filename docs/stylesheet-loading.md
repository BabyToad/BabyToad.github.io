# Stylesheet loading

`assets/css/styles.scss` is the Jekyll entry point. Its YAML front matter enables
Liquid and Sass processing; the build emits compressed `/assets/css/styles.css`.
The output contains no browser `@import` requests.

The base layout's shared and conditional stylesheets and the footer gallery bundle
carry `?v=<first 16 hex characters of SHA-256>`. `_plugins/asset_versions.rb`
resolves the Liquid filter's placeholders after every page has rendered, hashing
the actual Sass output or static file bytes. Identical builds keep identical URLs;
changed CSS, its included sources, or gallery content changes the relevant URL.
No asset from a previous `_site` build is read. Cloudflare must keep the query
string in its cache key; see [hosting.md](hosting.md).

Liquid `include_relative` directives inline the existing CSS sources in their
original cascade order before Sass runs. This preserves their paths and avoids
renaming sources: explicit `.css` imports remain browser requests in Sass.
Jekyll 4 uses jekyll-sass-converter 3 and Dart Sass.
Keep shared styles in this entry point, including `components/sidenotes.css`.
Tag archives reuse `components/blog-index.css` for ledger rows and linked chips.
The former blog hover preview, its script/flag and shared popup CSS are removed;
tag navigation works without JavaScript.

Feature styles are loaded directly by `_layouts/base.html` when either the page
or its layout sets the corresponding flag:

| Flag | Stylesheet | Current consumers |
| --- | --- | --- |
| `fuel` | `components/for-want-of-fuel.css` | For Want of Fuel layout |
| `srs` | `components/srs.css` | Learn page |
| `player` | `components/player.css` | Bagel post and Thoughts timeline |
| `rpg_notetaker_bench` | `components/rpg-notetaker-bench.css` | RPG Notetaker Bench project |

Flags for individual documents live in their own front matter: `player: true`
on the Bagel thought and `thoughts.md`, and `rpg_notetaker_bench: true` on the
bench project. The Thoughts timeline needs player styles because it renders
the Bagel post's full content.
KaTeX and image-alternates keep their existing conditional loading. Radio keeps
its standalone layout, which already loads only its own radio stylesheet.

The Blog and Projects index permalinks also live in `_config.yml` defaults.
`redirects/` preserves their old `.html` URLs with the existing redirect layout;
these compatibility pages are excluded from the sitemap.
