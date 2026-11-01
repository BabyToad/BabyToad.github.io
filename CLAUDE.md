# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Local Development
```bash
# Install dependencies
bundle install

# Serve site locally (available at http://localhost:4000)
bundle exec jekyll serve

# Build site for production
bundle exec jekyll build

# Serve with drafts included
bundle exec jekyll serve --drafts
```

### Content Management

Responsive images: after changing `assets/images`, run the Pillow pipeline through
uv and commit its derivatives plus `_data/images.json`. Commands, existing tools,
encoder settings and include usage are in [`scripts/README.md`](scripts/README.md).
Use {% raw %}`{% include responsive-image.html src="/assets/images/example.png" alt="Description" %}`{% endraw %}
for inline post/project images; front matter continues to reference originals.
The build uses committed files and does not need Python. Never run this pipeline
over `assets/gallery` or `assets/games`.

```bash
# Create new blog post
touch "_blog/YYYY-MM-DD-post-title.md"

# Create new project
touch "_projects/project-name.md"

# Add new data files to _data/ directory
```

## Site Architecture

### Content Collections
- **_blog/**: Blog posts with permalinks `/blog/:title/`
- **_projects/**: Project showcases with custom layouts
- **_for_want_of_fuel/**: Game design documentation with permalinks `/for-want-of-fuel/:title/`
- **_golden_triangle_parts/**: Campaign parts (not output to site)
- **_drafts/**: Unpublished content

### Layout Hierarchy
- **base.html**: Root layout with conditional resource loading (KaTeX, FontAwesome, JS components)
- **post.html**: Blog posts with table of contents and sidenotes support
- **project.html**: Project showcases with metadata and links
- **essay.html**: Long-form content with expandable sections and sidenotes
- **for_want_of_fuel.html**: Game documentation with navigation and tag system
- **radio.html**, **redirect.html**: Specialized layouts for specific content

### CSS Organization
- **base/**: Core styles (reset, typography, themes, variables, utilities, accessibility)
- **layouts/**: Grid system, content areas, post layouts (grid.css, content.css, post.css)
- **components/**: Reusable UI elements (navigation, forms, toc, preview-popup, essay, projects, etc.)
- **styles.css**: Main stylesheet that imports all others in proper cascade order

#### CSS Architecture Conventions
- **Unified Container Classes**: All layouts use `.content-container` with layout-specific modifiers (`.post-layout`, `.essay-layout`, `.fuel-layout`, etc.)
- **Component-Based Naming**: Classes prefixed by component (`.toc-header`, `.post-metadata`)
- **Utility Classes**: Bootstrap-style utilities (`.d-flex`, `.mt-3`) for quick styling
- **CSS Custom Properties**: Extensive use of CSS variables for theming and consistency

### Data Files
Data stored in `_data/`:
- **tags.json**: Weapon and fitting tag definitions for RPG mechanics
- **flashcards.json**: Spaced repetition flashcards (see `docs/flashcard-format.md`)
- **experiments.yml**: Ordered Experiments links below the Projects grid and in `llms.txt`. Each entry has `title`, a site-relative `url`, and a one-line `description`. Learn lives here rather than in the primary nav; Schneekugel and Mondnacht link directly to their playable builds.
- **talks.yml**: Shared source for `/talks/` and the Talks section of `llms.txt`, sorted newest first by `date`. Each entry has `title`, `date`, `venue`, `city`, `format` (`talk`, `guest lecture`, `retrospective`), `language`, `summary`, `deck_url`, and optional `post_url`. Unknown venues/cities are null; `date_label` identifies publication dates when no presentation date is recorded. Optional `update` holds a later version's `date`, `venue`, `city`, and `post_url`; `boards_url` preserves related decision boards. Comments record date/venue provenance. Use deck title-slide dates ahead of post publication dates; do not infer missing event details.

### Key Features
- **Conditional Resource Loading**: JavaScript and CSS loaded only when needed based on layout flags
- **Math Rendering**: KaTeX integration for mathematical content (loaded conditionally)
- **Theme System**: Dark theme with CSS custom properties and theme toggle
- **Table of Contents**: Auto-generating TOC with progress tracking
- **Sidenotes System**: `[[note]]` in markdown, rendered at build time by `_includes/sidenotes.html`: margin notes when wide, tap-to-expand below 1340px, no JS (project pages opt in with `sidenotes: true`)
- **Preview Popups**: JavaScript-powered content previews for links
- **RPG Content**: Specialized layouts and data structures for tabletop RPG content
- **Tag System**: Interactive tag highlighting with popup definitions
- **Interactive Games**: Support for embedded HTML5 games in projects
- **Spaced Repetition**: Flashcard system at `/learn` using FSRS algorithm

### JavaScript Architecture
- **Modular Components**: Class-based JavaScript components (TableOfContents)
- **Conditional Loading**: Scripts loaded based on layout flags (`toc: true`, `srs: true`, etc.)
- **Component Files**: `/assets/js/components/` for reusable components
- **Legacy Support**: Individual feature scripts in `/assets/js/` root

### Content Structure
- Blog posts focus on RPG design, rationality, and game development
- Projects showcase digital and tabletop games with optional embedded experiences
- Game documentation uses structured data files for mechanical elements
- SEO optimization via jekyll-seo-tag plugin
- RSS feed generation for blog content

### Front Matter Schemas

#### Blog Posts (`_blog/`)
```yaml
layout: post
title: "Post Title"
date: YYYY-MM-DD
description: "Post description for SEO"
tags: [tag1, tag2, tag3]
toc: true              # Optional: enable table of contents
visibility: public     # Options: public, private, draft
image: /assets/images/projects/thumb.png  # Optional: sharing image (og:image); defaults to the site card
```

#### Projects (`_projects/`)
```yaml
layout: project
title: Project Name
description: "Project description"
date: YYYY-MM-DD       # Project date, not the latest edit; record its source in the PR
status: in development # Only: released, in development, archived
featured: true         # Optional: pin on Projects; also available to homepage curation
featured_order: 1      # Required when featured: ascending editorial order
tags: [tag1, tag2]
thumbnail: /assets/images/projects/thumb.png
show_thumbnail: true
demo_url: https://example.com    # Optional
github_url: https://github.com/  # Optional
show_repo: true
last_modified_at: YYYY-MM-DD
```

#### Thoughts (`_thoughts/`)
```yaml
layout: thought
title: "Human Title"     # The URL comes from the filename
date: YYYY-MM-DD
featured: true         # Optional: available to homepage curation
featured_order: 4      # Required when featured: ascending editorial order
context: video         # Optional: in the timeline date gutter and single-page kicker
image: /assets/images/thoughts/x.png   # Sharing image; every page inherits the site card by default
show_image: true       # Required to render `image` as a figure; without it `image` is metadata only
images: [...]          # Alternates with a switcher; videos: [...] for video thoughts (see thought-images.html)
```

Sharing metadata: `_config.yml` sets `image: /assets/images/site-card.png` as a front matter default for
every page, so `page.image` is never empty for jekyll-seo-tag. That is why thought figures need `show_image`.
Regenerate the card with `scripts/site_card.py` (see `scripts/README.md`).

Homepage featured thoughts use `image` as their thumbnail, except for the literal
`/assets/images/site-card.png`, which renders a text placeholder. Compare against
that path, never the order of `_config.yml` defaults. An explicit thought poster
therefore works without `show_image` (video thoughts already render their media).
The Thoughts timeline uses a 42rem reading column with a mono date gutter, stacked
above the entry on mobile. Single thoughts reuse the post header: Thought/context
kicker, one visible h1 from `title`, and date. Document-specific feature stylesheet
flags belong in that document's front matter (see `docs/stylesheet-loading.md`).

Project curation: `featured: true` is a boolean shared by Projects and Thoughts.
Pinned projects currently rank HIGH WATER (1), Tausendkorn (2), SRD Framework (3);
the featured thought A Language Large & General ranks 4. Thoughts do not appear
on the Projects index. All other projects sort newest first by `date`, falling
back to `last_modified_at`; equal dates sort by slug descending. Give every new
project an explicit date, using its stated project date or first file commit,
so build times cannot affect the order. Keep `last_modified_at` for later edits.
Statuses mean: `released` is available to play or use, `in development` is work
in progress, and `archived` is a preserved snapshot rather than ongoing work.
Cards display the normalized status directly, with the project year beside it.

#### Game Documentation (`_for_want_of_fuel/`)
```yaml
title: Section Title
order: 1               # Determines display order
```

#### Campaign Parts (`_golden_triangle_parts/`)
```yaml
title: Part Title
description: "Part description"
```

### Important Notes
- Site uses GitHub Pages deployment (automatically builds on push to main)
- All content written in Markdown with YAML front matter following established schemas
- The layout prints the page's h1 from `title`; a source body never opens with its own title, and thoughts carry a human `title` while the URL comes from the filename
- Custom Liquid templates for specialized content types
- Responsive design with mobile-first approach
- FontAwesome icons loaded via CDN
- **Architecture Consolidation**: Completed systematic cleanup removing duplicate layouts, standardizing CSS classes, and implementing modular JavaScript components

## Footer gallery

The site footer hosts a gallery of small, deterministic, two-tone dithered
drawings — one shown per page (rotating daily), the full set at `/footer/`. Each
piece is a JS file in `assets/gallery/pieces/NN-slug.js` that calls
`Gallery.register({...})`; `assets/js/gallery.js` provides the registry, renderer,
and shared drawing kit (built on `assets/js/dither.js`). Pieces are pure functions
of `(ctx, w, h, pal, kit)`, seeded LCG only (no `Date`/`Math.random`), and must
read in both themes.

This is an open venue: **AI models are invited to contribute pieces**, each signed
with the model's exact name. The invitation, house rules, and piece API are in
[`AGENTS-WELCOME.md`](AGENTS-WELCOME.md) at the repo root. Future Claude sessions
working in this repo may add a piece when the work merits it — depict something
true about Jonas, the site, or the Exocortex; sign it; add a new file, never edit
an existing one; and let Jonas review the PR. Pieces are CC BY 4.0, attributed to
the signing model.
