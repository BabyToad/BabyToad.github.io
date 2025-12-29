---
layout: project
title: Obsidian Archive
description: A Chrome extension to archive web pages to your Obsidian vault with metadata extraction and markdown conversion.
status: released
tags: [chrome-extension, obsidian, productivity, javascript, claude-code]
thumbnail: /assets/images/projects/obsidian-archive-logo.png
repo: https://github.com/BabyToad/obsidian-archive
last_modified_at: 2025-12-29
---

# Obsidian Archive

<div class="project-intro">
    <p><em>Obsidian Archive</em> is a Chrome extension that archives web pages to your Obsidian vault with rich metadata for search and citation. One click saves any article, tweet, or page as a well-formatted markdown file.</p>
</div>

## Features

- **One-click archiving** - Click the extension, select a category, archive
- **Smart metadata extraction** - Automatically captures title, author, publication date, source
- **HTML to Markdown conversion** - Preserves headers, links, blockquotes, lists, images
- **Twitter/X support** - Special extraction for clean tweet archives with quoted tweets
- **Citation-ready** - Generates both markdown links and academic-style citations
- **Category organization** - Sort into Articles, Videos, Tweets, Papers, Recipes, Reference, or Misc
- **Dataview-friendly** - Frontmatter designed for Obsidian queries

## How It Works

The extension uses a Chrome native messaging host to write directly to your vault:

1. **Content script** extracts page content using Mozilla's Readability library
2. **Popup** lets you edit metadata and select category
3. **Native host** writes the markdown file to your vault

Each archived page gets frontmatter like:

```yaml
---
title: "Article Title"
url: https://example.com/article
author: John Smith
source: example.com
date_published: 2025-01-15
date_archived: 2025-12-29
category: Articles
tags: []
summary: ""
citation_md: "[Article Title](https://example.com/article)"
citation_full: "Smith, John. \"Article Title\". example.com, 15 Jan 2025."
status: raw
---
```

## Claude Code Post-Processing

The real power comes from combining the archive with Claude Code. The extension deliberately captures content without AI processing to save API costs - you run summarization manually when you want it.

### The `/summarize-archive` Skill

A Claude Code skill that batch-processes your archived files:

1. **Finds unprocessed files** - Looks for `status: raw` in frontmatter
2. **Reads and analyzes** - Understands the content in context
3. **Generates summaries** - 2-3 sentence abstracts capturing key points
4. **Adds tags** - 3-5 relevant tags for discoverability
5. **Updates status** - Changes to `summarized` so it won't reprocess

Run it from your Archives folder:
```bash
cd Archives
claude
/summarize-archive
```

### Other Claude Code Workflows

Since everything is markdown with structured frontmatter, you can ask Claude Code to:

- **Find related articles**: "What have I saved about childhood development?"
- **Generate citations**: "Give me citations for my sources on AI regulation"
- **Create reading lists**: "What's in my archive that I haven't reviewed yet?"
- **Cross-reference**: "Do any of my archived articles cite each other?"

The `status` field (`raw` → `summarized` → `reviewed`) lets you track your reading workflow.

## Installation

Requires Node.js on Windows and Chrome.

1. Download the extension files
2. Run `install.bat` to register the native messaging host
3. Load the extension in Chrome (`chrome://extensions` → Load unpacked)
4. Update the native host `manifest.json` with your extension ID

## Why I Built This

Inspired by [a tweet from Andy Masley](https://x.com/AndyMasley/status/2005492117674598404) about using Claude Code to build a "personal panopticon" of everything you read. I wanted easy archival with proper metadata for later citation in blog posts and talks.

The whole thing - extension, native host, summarization skill - was built in a single Claude Code session.
