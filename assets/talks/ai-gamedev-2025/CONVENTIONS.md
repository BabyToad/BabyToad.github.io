# AI for Game Developers 2025 — Slide Deck Conventions

This document captures the design philosophy, stylistic conventions, and component patterns for this presentation. Use it as a reference when editing or extending the slide deck.

---

## Design Philosophy

From the CSS header:
- **Warm off-white, not blinding** — optimized for projector display
- **Typography as primary differentiator** — minimal color, maximum clarity
- **Content must fit** — no scrolling, slides are single-screen
- **Minimal accent, used sparingly** — deep blue (#1a56db) for links and highlights

---

## Color Palette

| Purpose | Variable | Value | Usage |
|---------|----------|-------|-------|
| Background | `--bg-base` | #f8f8f7 | Warm paper white |
| Surface | `--bg-surface` | #ffffff | Cards, elevated elements |
| Muted | `--bg-muted` | #f0f0ef | Subtle backgrounds, callouts |
| Text primary | `--text-primary` | #1a1a1a | Main text (near-black) |
| Text secondary | `--text-secondary` | #555555 | Supporting text |
| Text tertiary | `--text-tertiary` | #888888 | Meta, captions, annotations |
| Accent | `--accent` | #1a56db | Links, highlights (sparing) |
| Positive | `--positive` | #047857 | Forest green (results) |
| Negative | `--negative` | #b91c1c | Deep red (warnings) |

---

## Typography Scale

Uses responsive `clamp()` with both vw and vh to fit any aspect ratio:

| Class | Size Range | Weight | Usage |
|-------|------------|--------|-------|
| `.title-large` | 2.5–4.5rem | 700 | Title slide only |
| `.section-title` | 2.5–4.5rem | 800 | Section openers |
| `h1` | 2–3.5rem | 700 | Slide headers |
| `h2` | 1.5–2.5rem | 600 | Main content headers |
| `.lead` | 1.2–2rem | 500 | Subtitle/intro text |
| `p, li` | 1–1.5rem | normal | Body text |
| `.source` | 0.75–1rem | normal | Citations (italic, tertiary) |

**Fonts:**
- Sans: System stack (`-apple-system, BlinkMacSystemFont, "Segoe UI"...`)
- Mono: `"SF Mono", "Cascadia Code", "Consolas"`

---

## Slide Structure

Every slide follows this pattern:

```html
<section class="slide" data-slide="N" data-section="sectionname">
    <div class="slide-content">
        <!-- Visible content -->
    </div>
    <div class="slide-details">
        <!-- Speaker notes, sources, further reading -->
        <!-- Hidden by default, shown in detail mode -->
    </div>
</section>
```

### Section Names (data-section)
- `opening` — Title, about, agenda
- `foundation` — How AI works
- `scaling` — Scaling laws & forecasts
- `theory` — How to work with AI
- `utility` — Practical applications
- `context` — Ethics & considerations
- `action` — Call to action, resources

---

## Slide Types & Components

### 1. Section Title Slides
Used to introduce each major section.

```html
<h1 class="section-title">Section Name</h1>
<p class="section-subtitle">Descriptive subtitle</p>
```

### 2. Content Slides with Header
Standard format for most slides.

```html
<h2>Slide Title</h2>
<p class="lead">Optional intro/subtitle text</p>
<!-- Content components below -->
```

### 3. Quote Boxes (Primary Pattern)
**Use for all prominent attributed quotes.** This is the standard.

```html
<div class="quote-box">
    <blockquote>"The quoted text goes here."</blockquote>
    <p class="attribution">— Author Name, Source</p>
</div>
```

**Style:** Muted background, rounded corners, attribution right-aligned.

**Multi-line quotes:** Use `<br><br>` for paragraph breaks within the quote:
```html
<blockquote>"First line.<br><br>Second line.<br><br>Third line."</blockquote>
```

**Attribution formats:**
- With source: `— Author Name, "Source Title"`
- Person only: `— Author Name, role/context`
- With link: `— <a href="URL">Author Name</a>`

### 4. Standalone Blockquotes (Secondary Pattern)
Use sparingly for inline/example quotes or when the box treatment is too heavy.

```html
<blockquote>
    "Quote text here."
    <cite>— Author Name</cite>
</blockquote>
```

**Style:** Muted background, 3px left border (tertiary), italic.

### 5. Example Prompts
For showing prompt comparisons (has different styling with accent border):

```html
<div class="example-prompt">
    <p class="prompt-label">Instead of:</p>
    <blockquote>"Bad prompt example"</blockquote>
    <p class="prompt-label">Try:</p>
    <blockquote>"Good prompt example"</blockquote>
</div>
```

### 6. Key Insight Boxes
For central takeaways you want to emphasize.

```html
<div class="key-insight">
    <p class="insight-text">"The memorable phrase or insight"</p>
</div>
```

**Style:** Centered, 2px solid border (primary), rounded corners.

### 6. Callouts
For important single-line takeaways.

```html
<p class="callout">The key point in one sentence.</p>
```

**Style:** Muted background, 3px left border (primary), medium weight.

### 7. Warning Boxes
For cautions or important considerations.

```html
<div class="warning-box">
    <p class="lead">Warning or important consideration</p>
</div>
```

**Style:** Light red background, red border.

### 8. Big Lists
Primary list format for bullet points.

```html
<ul class="big-list">
    <li><strong>Bold lead:</strong> explanation text</li>
    <li>Or plain items without bold lead</li>
</ul>
```

**Style:** Custom dot bullets, generous spacing. Nested lists allowed (use standard `<ul>`).

### 9. Split Content
Two-column layout for comparisons.

```html
<div class="split-content">
    <div class="left">
        <h3>Left Column Title</h3>
        <ul>...</ul>
    </div>
    <div class="right">
        <h3>Right Column Title</h3>
        <ul>...</ul>
    </div>
</div>
```

### 10. Stat Grids
For displaying statistics prominently.

```html
<div class="stat-grid three-stats">  <!-- or four columns by default -->
    <div class="stat">
        <span class="stat-number">$7T</span>
        <span class="stat-label">Description</span>
    </div>
    <!-- more stats -->
</div>
```

### 11. Agenda Items
For the agenda slide specifically.

```html
<div class="agenda">
    <div class="agenda-item">
        <span class="number">1</span>
        <span class="text">Section Title</span>
    </div>
</div>
```

### 12. Timeline
For chronological progressions.

```html
<div class="timeline">
    <div class="timeline-item">
        <span class="date">Mar 2023</span>
        <span class="event">Event description</span>
    </div>
    <div class="timeline-item highlight">  <!-- for current/emphasized -->
        ...
    </div>
</div>
```

### 13. Code Examples
For showing code or configuration.

```html
<div class="code-example">
    <pre><code># Code here
with proper indentation</code></pre>
</div>
```

### 14. Source Citations
Always at the bottom of slides with external data.

```html
<p class="source">Author et al. (Year), "Title". publisher</p>
```

**Style:** Tiny italic text, tertiary color.

---

## Slide Details Structure

Speaker notes and references go in `.slide-details`:

```html
<div class="slide-details">
    <div class="detail-section detail-notes">
        <h4>Notes</h4>
        <p>Speaker notes here.</p>
    </div>
    <div class="detail-section detail-sources">
        <h4>Sources</h4>
        <ul>
            <li><a href="URL" target="_blank">Source Title</a> - Author (Year)</li>
        </ul>
    </div>
    <div class="detail-section detail-reading">
        <h4>Further Reading</h4>
        <ul>
            <li><a href="URL" target="_blank">Resource</a> - Description</li>
        </ul>
    </div>
</div>
```

For simple notes without structure:
```html
<div class="slide-details">
    Plain text notes without sections.
</div>
```

---

## SVG Diagrams

For complex visual explanations, use inline SVG with hover tooltips:

```html
<div class="svg-diagram">
    <svg viewBox="0 0 900 550" xmlns="http://www.w3.org/2000/svg">
        <g class="hoverable" data-tooltip="Explanation text">
            <rect ... class="hover-target"/>
            <text ...>Label</text>
        </g>
    </svg>
</div>
```

**Key classes:**
- `.phase-box` — Main process boxes
- `.secondary-box` — Supporting elements
- `.label-phase` — Bold phase labels (18px, 700 weight)
- `.label-desc` — Descriptions under phases
- `.label-small` — Small labels
- `.arrow-line` — Connector arrows

---

## Images

External images (charts, screenshots) use these patterns:

```html
<!-- Chart with source -->
<div class="scaling-chart">
    <img src="filename.png" alt="Descriptive alt text" class="scaling-img">
</div>
<p class="source">Attribution (Year)</p>

<!-- Tweet/screenshot -->
<img src="tweet.png" alt="Description" class="tweet-img">
```

---

## Writing Conventions

### Tone
- **Direct and concise** — No fluff, respect audience time
- **Dark humor okay, never campy** — Match the roguelike vibe
- **Epistemically honest** — Acknowledge uncertainty when appropriate

### Quotes
- Use quotes to anchor ideas from respected sources
- Always attribute with `— Author Name, Source`
- Link to sources when possible (in slide-details if not inline)

### Callouts
- One sentence maximum
- Capture the "so what" of the slide
- Often ends slides as the takeaway

### Lists
- Bold lead phrase when items have structure: `<strong>Concept:</strong> explanation`
- Keep items parallel in structure
- 4-6 items maximum per list

---

## Citation Conventions

### On-Slide Citations (`.source`)

On-slide citations link directly to the external source (opens in new tab).

**Format:** `<p class="source"><a href="URL" target="_blank">Display Text</a></p>`

| Source Type | Format | Example |
|-------------|--------|---------|
| Paper | `Author (Year)` | `Hoffmann et al. (2022)` |
| Paper (named) | `Author, "Short Title" (Year)` | `Kaplan et al., "Scaling Laws" (2020)` |
| Book | `"Title" (Publisher, Year)` | `"The Scaling Era" (Stripe Press, 2025)` |
| Org report | `Org, "Short Title" (Year)` | `METR, "Measuring AI Ability" (2025)` |
| Blog/Essay | `Author, "Title" (Year)` | `Gwern, "The Scaling Hypothesis" (2020)` |

**Rules:**
- Year always in parentheses at end
- No domain names on-slide (keep text clean)
- No prefixes like "Further reading:" — just cite
- Always use `target="_blank"` to open in new tab

```html
<p class="source"><a href="https://arxiv.org/abs/2203.15556" target="_blank">Hoffmann et al. (2022)</a></p>
```

### Chart/Image Attributions (`.chart-attribution`)

```html
<p class="chart-attribution">Chart: <a href="URL" target="_blank">Author Name</a></p>
```

Link directly to the source. Keep on-slide text minimal.

### Quote Attributions (`.attribution`)

In `.quote-box`, use em-dash `—` not hyphen:

```html
<p class="attribution">— Name, role/context</p>
<p class="attribution">— <a href="#cite-key">Name</a>, "Source Title"</p>
```

| Context | Format | Example |
|---------|--------|---------|
| Person + role | `— Name, role` | `— Dario Amodei, CEO of Anthropic` |
| Person + source | `— Name, "Source"` | `— Dwarkesh Patel, "The Scaling Era"` |
| Linked | `— <a href="URL" target="_blank">Name</a>` | Opens source in new tab |

### Sources Appendix (Slide 50)

The appendix provides a consolidated reference of all sources, organized by type:

```html
<section class="slide" data-slide="50" data-section="appendix">
    <div class="slide-content">
        <h2>Sources</h2>
        <div class="sources-list">
            <h3>Papers</h3>
            <ul class="citations">
                <li id="cite-hoffmann-2022" class="cite-paper">
                    <a href="https://arxiv.org/abs/2203.15556" target="_blank">Training Compute-Optimal Large Language Models</a>
                    — Hoffmann et al. (2022)
                </li>
                <!-- more papers -->
            </ul>

            <h3>Books</h3>
            <ul class="citations">
                <li id="cite-patel-2025" class="cite-book">
                    <a href="https://press.stripe.com/scaling" target="_blank">The Scaling Era</a>
                    — Dwarkesh Patel (Stripe Press, 2025)
                </li>
            </ul>

            <h3>Essays & Blogs</h3>
            <ul class="citations">
                <li id="cite-gwern-2020" class="cite-blog">
                    <a href="https://gwern.net/scaling-hypothesis" target="_blank">The Scaling Hypothesis</a>
                    — Gwern (2020)
                </li>
            </ul>
        </div>
    </div>
</section>
```

**Purpose:**
- Consolidated reference for post-presentation review
- All sources in one place with full titles and links
- Organized by type (Papers, Books, Blogs, Charts)

**Note:** On-slide citations link directly to sources (new tab). The appendix is supplementary.

---

## Interactive Elements

### Hoverable tooltips (SVG)
```html
<g class="hoverable" data-tooltip="Explanation appears on hover">
```

### Term definitions
```html
<span class="term" data-tip="Definition text">Technical term</span>
```

---

## Common Patterns

### Slide with quote + bullet elaboration
1. `<h2>` title
2. `.quote-box` with attributed quote
3. `.big-list` expanding on the quote's implications
4. `.callout` as takeaway

### Slide with data visualization
1. `<h2>` title
2. `.lead` context sentence
3. `.split-content` with image left, explanation right
4. `.source` citation

### Section transition slide
1. `.section-title` (mega size)
2. `.section-subtitle` (secondary color)
3. Optional `.footnote` for definitions

---

## Checklist for New Slides

- [ ] Uses appropriate `data-slide` number and `data-section`
- [ ] Title is concise (< 8 words ideal)
- [ ] Content fits without scrolling
- [ ] Has speaker notes in `.slide-details`
- [ ] External claims have sources
- [ ] Ends with callout or clear takeaway
- [ ] Images have descriptive alt text
- [ ] Links open in new tab (`target="_blank"`)
