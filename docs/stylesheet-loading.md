# Stylesheet loading

`assets/css/styles.scss` is the Jekyll entry point. Its YAML front matter enables
Liquid and Sass processing; the build emits compressed `/assets/css/styles.css`.
The URL stays stable, and the output contains no browser `@import` requests.

Liquid `include_relative` directives inline the existing CSS sources in their
original cascade order before Sass runs. This preserves their paths and avoids
renaming sources: the current Ruby Sass version does not inline `.css` imports.
Keep shared styles in this entry point, including `components/sidenotes.css`.

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
