# Slide Design Skill

Use this skill when creating or modifying slides in `assets/talks/ai-gamedev-2025/`.

## Design Philosophy

**Typography-first.** Emphasis comes from font weight and size, not color. The design is warm, readable, and optimized for projector display.

**Whitespace does the work.** Generous spacing, clean borders, no decoration. Every element earns its place.

**One main visual per slide.** Pick 1-2 components. Don't stack everything.

---

## Color Palette

### Backgrounds
| Variable | Hex | Use |
|----------|-----|-----|
| `--bg-base` | #f8f8f7 | Slide background (warm paper white) |
| `--bg-surface` | #ffffff | Cards, elevated elements |
| `--bg-muted` | #f0f0ef | Subtle backgrounds, code blocks |

### Text
| Variable | Hex | Use |
|----------|-----|-----|
| `--text-primary` | #1a1a1a | Main text (near-black) |
| `--text-secondary` | #555555 | Supporting text, descriptions |
| `--text-tertiary` | #888888 | Meta, captions, annotations |

### Accent & Semantic
| Variable | Hex | Use |
|----------|-----|-----|
| `--accent` | #1a56db | Links, highlights (use sparingly) |
| `--positive` | #047857 | Good examples, success |
| `--negative` | #b91c1c | Bad examples, warnings |

---

## Typography

### Font Stacks
- **Sans-serif**: System fonts (`-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`)
- **Monospace**: `"SF Mono", "Cascadia Code", "Consolas", monospace` - for code, technical terms, file paths

### Size Scale (responsive clamp values)
| Variable | Use |
|----------|-----|
| `--text-mega` | Section titles, Q&A header |
| `--text-huge` | Slide titles (h1) |
| `--text-large` | Slide subtitles (h2) |
| `--text-title` | Key insight text, lead paragraphs |
| `--text-body` | Main content, list items |
| `--text-small` | Secondary content, descriptions |
| `--text-tiny` | Meta, sources, footnotes |

### Weight Usage
- **400**: Body text, descriptions
- **500**: Lead paragraphs, emphasis
- **600**: Headings (h2, h3)
- **700**: Main titles, strong emphasis
- **800**: Numbers, section titles

---

## Spacing Scale

Use CSS custom properties:
```
--s1: 0.35rem    (tight)
--s2: 0.7rem     (small)
--s3: 1rem       (base)
--s4: 1.5rem     (medium)
--s5: 2rem       (large)
--s6: 2.5rem
--s7: 3rem
--s8: 4rem       (section breaks)
```

---

## Component Library

### When to Use Each

| Component | Use Case |
|-----------|----------|
| `key-insight` | One main takeaway per slide (bordered box, centered) |
| `callout` | Anchor at bottom - summary or "so what" |
| `big-list` | 3-5 bullet points with bold leads |
| `code-example` | Code snippets, file contents |
| `quote-box` | Attributed quotes |
| `split-content` | Two-column comparisons |
| `task-cards` | Grid of related items (3x2) |
| `design-loop` | Sequential process (horizontal flow) |
| `bold-statement` | Philosophy/mindset slides (large centered text) |
| `svg-diagram` | Complex flows, architecture |
| `file-tree` | Directory structures |

### Slide Structure Pattern
```
h2 (title)
  └── lead or key-insight (optional - pick one)
  └── main content (one component)
  └── callout (anchor/summary)
```

---

## SVG Guidelines

### Colors
- **Strokes**: `var(--text-tertiary)` for lines, `var(--text-primary)` for emphasis
- **Fills**: Usually `none`. Use `var(--bg-muted)` for boxes
- **Accent**: `var(--accent)` for interactive/highlighted elements only

### Line Weights
- 1-1.5px for connection lines, arrows
- 2px for box borders, emphasis
- Use `stroke-dasharray` for optional/config elements

### Hover States
```css
.hoverable:hover .flow-box {
    stroke: var(--accent);
    stroke-width: 2;
}
```

### Text in SVGs
- `.label-phase`: 18px, bold, primary color (key stages)
- `.label-medium`: 14px, mono, secondary (box labels)
- `.label-small`: 15px, mono, secondary (inputs)
- `.label-desc`: 11px, italic, tertiary (descriptions)

---

## Layout Principles

1. **Vary visual treatment across a section** - Avoid 3+ slides with same structure
2. **One main visual** - Don't combine key-insight + big-list + diagram
3. **Callout anchors** - Most slides end with a callout summary
4. **Responsive** - Components stack vertically on mobile

---

## Don'ts

- **No emojis** - Use tasteful SVG icons if needed, or rely on typography
- **No color for emphasis** - Use font-weight instead
- **No decorative elements** - Everything serves communication
- **No stacking key-insight boxes** - One per slide maximum
- **No pure black (#000)** - Use near-black (#1a1a1a)
- **No generic icons** - If using SVGs, they should be diagram elements, not decoration

---

## Adding a New Slide

1. Identify the **one thing** this slide communicates
2. Pick **one component** that best conveys it
3. Write the **h2 title** (clear, concise)
4. Add **lead text** if needed for context
5. Add **callout** to anchor the bottom
6. Check: Does this look different from the previous 2 slides?

---

## File Locations

- HTML: `assets/talks/ai-gamedev-2025/index.html`
- CSS: `assets/talks/ai-gamedev-2025/style.css`
- JS: `assets/talks/ai-gamedev-2025/slides.js`
- Images: `assets/talks/ai-gamedev-2025/*.png`
