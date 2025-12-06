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
Game design data stored in `_data/`:
- **tags.json**: Comprehensive weapon and fitting tag definitions for RPG mechanics

### Key Features
- **Conditional Resource Loading**: JavaScript and CSS loaded only when needed based on layout flags
- **Math Rendering**: KaTeX integration for mathematical content (loaded conditionally)
- **Theme System**: Dark theme with CSS custom properties and theme toggle
- **Table of Contents**: Auto-generating TOC with progress tracking
- **Sidenotes System**: Marginal notes that adapt to screen size
- **Preview Popups**: JavaScript-powered content previews for links
- **RPG Content**: Specialized layouts and data structures for tabletop RPG content
- **Tag System**: Interactive tag highlighting with popup definitions
- **Interactive Games**: Support for embedded HTML5 games in projects

### JavaScript Architecture
- **Modular Components**: Class-based JavaScript components (TableOfContents, Sidenotes)
- **Conditional Loading**: Scripts loaded based on layout flags (`toc: true`, `sidenotes: true`, etc.)
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
sidenotes: true        # Optional: enable sidenotes
visibility: public     # Options: public, private, draft
```

#### Projects (`_projects/`)
```yaml
layout: project
title: Project Name
description: "Project description"
status: in-progress    # Options: completed, in-progress, planning
tags: [tag1, tag2]
thumbnail: /assets/images/projects/thumb.png
show_thumbnail: true
demo_url: https://example.com    # Optional
github_url: https://github.com/  # Optional
show_repo: true
last_modified_at: YYYY-MM-DD
```

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
- Custom Liquid templates for specialized content types
- Responsive design with mobile-first approach
- FontAwesome icons loaded via CDN
- **Architecture Consolidation**: Completed systematic cleanup removing duplicate layouts, standardizing CSS classes, and implementing modular JavaScript components