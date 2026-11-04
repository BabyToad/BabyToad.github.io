---
layout: base
title: Repository guide
sitemap: false
---

# Repository guide

Steak Knives and Bagels is Jonas Heinke's personal website at
https://www.allknivesnobagel.com. Read [the design plan](docs/redesign-plan.md)
and [the gallery contract](AGENTS-WELCOME.md) before changing design or gallery work.

## Build and deployment

Jekyll 4.4, Bundler, GitHub Actions, GitHub Pages behind Cloudflare. From the root:

```sh
bundle install
ruby scripts/llms_full.rb
ruby scripts/gallery_bundle.rb
bundle exec jekyll build
# Or: bundle exec jekyll serve (http://localhost:4000)
```

Run both Ruby pre-build scripts before every build or serve. Their generated
Markdown siblings, llms-full.txt and gallery-bundle.js are gitignored; never edit
or commit them. See [scripts/README.md](scripts/README.md) for image generation,
sharing-card regeneration, and output audits. No Node tooling in the build.

## Content and layouts

- `_blog/`: blog collection, `/blog/:title/`; `_thoughts/`: `/thoughts/:title/`.
- `_projects/`: projects; `_for_want_of_fuel/`: rules chapters.
- `_golden_triangle_parts/`: essay sections, not independently published.
- `_drafts/`: unpublished work. Private/noindexed pages stay unlisted.
- `base.html` supplies shared chrome; post, project, thought, essay and fuel layouts
  add their own reading structure. The layout supplies the document h1; sources
  using those layouts do not repeat it. Thoughts have human titles and stable URLs.
- `[[note]]` is converted by `_includes/sidenotes.html`: inline expandable notes
  below 1340px, margin notes above. Projects opt in with `sidenotes: true`.
- `toc: true` enables the TOC; `math: true` enables KaTeX from jsDelivr. Fonts
  (Newsreader and JetBrains Mono) and SVG icons are local; no FontAwesome CDN.
- Sharing images inherit the site card. A thought's `image` renders in its body
  only with `show_image: true`; `images` and `videos` retain their own rendering.
- Use original image paths in front matter and `responsive-image.html` in prose;
  regenerate derivatives and `_data/images.json` together (see scripts guide).
- `feed.xml` combines public Blog and Thoughts; preserve existing entry IDs.
- Tags in Blog, Projects and Thoughts use lower-case, hyphenated front matter
  (`game-dev`, `game-design`, `ttrpg`, `dnd`, `adnd`, `stars-without-number`).
  `_plugins/tag_pages.rb` builds `/tags/` and `/tags/<tag>/` from public documents,
  including single-item tags. Use `tag.html` for linked chips; no hover previews.

Projects use `date` for project chronology and `last_modified_at` for edits.
Status is `released`, `in development`, or `archived`. Featured projects and
thoughts use boolean `featured: true` and numeric `featured_order` (editorial order).
The Projects index pins projects, then sorts by date descending; thoughts appear
only in the homepage featured row. Card years can include a project year range.
`_data/experiments.yml` orders project experiments; `_data/talks.yml` supplies
Talks and llms.txt. Record date/venue provenance; do not infer missing event facts.

## CSS and JavaScript

`assets/css/styles.scss` inlines shared sheets through Liquid, then Sass emits one
compressed stylesheet. Feature sheets load only behind page/layout flags; see
[stylesheet-loading.md](docs/stylesheet-loading.md). Document-specific flags live
in document front matter. Radio uses its standalone layout and stylesheet.

Use canonical theme tokens: `--ink`, `--ink-soft`, `--ink-faint`, `--bg`,
`--bg-raised`, `--bg-dip`, `--border`, `--border-strong`, `--accent`,
`--accent-hover`, `--accent-ink`; `--radius` (2px), `--rule`, `--font-display`,
`--font-body`, `--font-mono`. Spacing and layout measurements live in variables.css.
No compatibility aliases or Bootstrap helpers. Use component classes and scoped
rules. The shared `.content-container` lives in layouts/content.css; layout
modifiers own their grid and padding. See [CSS maintenance](docs/css-maintenance.md)
for responsive exceptions and the remaining priority overrides.

Prose is serif; machinery is mono. Tokens only, no new colours or ambient motion.
Enhancements attach to existing events, add no JS to the critical path, respect
reduced motion, and leave pages readable without JS. Keep the design plan's vetoes.
Reusable JS components live in assets/js/components; flag-specific scripts remain
conditional. Never restyle teaching/gec1 (built elsewhere), edit Impressum text,
or modify an existing gallery piece. New pieces require a signed new file plus a
manifest entry, following AGENTS-WELCOME.md. Jonas reviews and merges PRs.
