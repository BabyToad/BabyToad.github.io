---
layout: project
title: SWN Golden Triangle Character Sheet
description: A custom Roll20 character sheet for Stars Without Number with corporate dystopia aesthetics and faction management.
status: complete
tags: [rpg, stars-without-number, roll20, web-dev, swn]
show_thumbnail: true
thumbnail: /assets/images/projects/swn-sheet-thumb.png
repo_url: https://github.com/BabyToad/swn-golden-triangle-sheet
show_repo: true
last_modified_at: 2025-12-29
---

# SWN Golden Triangle Character Sheet

<div class="project-intro">
    <p>A heavily customized Roll20 character sheet for <em>Stars Without Number</em>, designed for our Golden Triangle campaign. Features a diegetic "corporate document" aesthetic inspired by ALIENS and Blade Runner, plus a custom Faction management tab.</p>
</div>

## Visual Design: Hylix Ventross Corporation

The sheet reimagines character management as corporate personnel files from the in-universe Hylix Ventross Corporation. Key design elements:

- **Header**: "HYLIX VENTROSS CORPORATION / Personnel Management System v3.0"
- **Color Palette**: Amber terminal glow, rust accents, cream paper, teal highlights
- **Typography**: Monospace fonts for data fields, condensed sans-serif for headers
- **Aesthetic**: Worn corporate dystopia meets Nusantaran-Arabic geometric patterns

![Character sheet overview](/assets/images/projects/swn-sheet-character.png)

## Custom Features

### Faction Management Tab

A complete faction tracking system for player-run organizations:

- **Overview**: Faction name, base of operations, treasury
- **Economy**: Auto-calculated income/upkeep/net from turf and assets
- **Heat Tracker**: 5 customizable regions with color-coded danger levels (green/yellow/orange/red)
- **Turf**: Repeating section for territory (name, region, income, upkeep, notes)
- **Assets**: Repeating section for equipment/vehicles/property
- **People**: NPC tracking with BitD-style magnitude scale and OSE morale loyalty

![Faction management tab](/assets/images/projects/swn-sheet-faction.png)

### Stress & Panic System

Mothership RPG-inspired stress mechanics:

- **Stress/Max Display**: Compact tracker in Resources section
- **Visual Warnings**: Input fields change color as stress approaches max
- **Panic Roll**: Click "Stress" label to roll 2d10 + stress - max
- **Roll Template**: Color-coded results from Laser Focus (good) to Heart Attack (critical)

## Technical Details

**Stack**: Pug (HTML templating), SCSS, TypeScript for sheet workers

**Key Patterns**:
- CSS attribute selectors for value-based styling (heat colors, stress warnings)
- Hidden inputs + sibling selectors for toggle states
- Repeating sections with auto-calculation via sheet workers

**Roll20 Compatibility Notes**:
- No `@import` for external fonts (use web-safe fonts only)
- No Unicode in CSS `content:` properties (use ASCII equivalents)
- Expanded CSS format for reliable pasting (compressed single-line truncates)

## Links

- [GitHub Repository](https://github.com/BabyToad/swn-golden-triangle-sheet)
- [Original SWN Sheet](https://github.com/roll20/roll20-character-sheets/tree/master/Stars_Without_Number_Revised) (base we forked from)
