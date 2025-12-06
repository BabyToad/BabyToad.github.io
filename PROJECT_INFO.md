# Project Documentation
Last Updated: April 19, 2024

## Project Overview
This is a personal website built using Jekyll, a static site generator. The site serves as a portfolio and blog platform, showcasing projects, essays, and blog posts about game design, roleplaying games, and rationality.

## Architecture

### Core Technologies
- **Static Site Generator:** Jekyll
- **Content Format:** Markdown (`.md` files)
- **Templating Engine:** Liquid
- **Styling:** SASS (compiled to CSS)
- **Hosting:** GitHub Pages

### Directory Structure
```
├── _blog/              # Blog posts collection
├── _drafts/            # Unpublished posts
├── _projects/          # Projects collection
├── _golden_triangle_parts/  # Special collection
├── _layouts/           # Page templates
├── _includes/          # Reusable components
├── _data/              # Data files
├── assets/             # Static assets (CSS, images, etc.)
├── _config.yml         # Jekyll configuration
├── Gemfile             # Ruby dependencies
├── Gemfile.lock        # Locked dependency versions
└── Various .md files   # Content pages
```

### Key Configuration
- **Collections:**
  - Blog posts
  - Projects
  - Essays
  - Golden Triangle Parts
- **Plugins:**
  - jekyll-feed
  - jekyll-seo-tag
  - jekyll-last-modified-at

## Features

### Content Sections
1. **Homepage**
   - Introduction section
   - Recent blog posts display
   - Social media links
   - Contact information

2. **Blog**
   - Posts about roleplaying games
   - Game design content
   - Rationality discussions
   - Public/private post visibility

3. **Projects**
   - Digital game development
   - Tabletop game design
   - Interactive experiences

4. **Essays**
   - Game design theory
   - Rationality topics
   - Other interests

### Pages
- `index.md` - Homepage
- `about.md` - About the author
- `blog.md` - Blog listing
- `projects.md` - Projects listing
- `contact.md` - Contact information

### Technical Features
- Responsive design
- SEO optimization
- RSS feed generation
- Last modified date tracking
- SASS-based styling
- Social media integration

## Maintenance Notes
- Blog posts should be placed in `_blog/` directory
- Projects should be added to `_projects/` directory
- Essays should be placed in their respective collection
- All content should be written in Markdown format
- SASS files should be placed in `assets/css/`

## Dependencies
- Ruby (for Jekyll)
- Bundler (for dependency management)
- Jekyll plugins:
  - jekyll-feed
  - jekyll-seo-tag
  - jekyll-last-modified-at

## Development
To run the site locally:
1. Install Ruby and Bundler
2. Run `bundle install`
3. Run `bundle exec jekyll serve`
4. Access the site at `http://localhost:4000`

## Deployment
The site is automatically deployed to GitHub Pages when changes are pushed to the main branch. 