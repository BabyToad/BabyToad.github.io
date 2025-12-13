---
layout: project
title: Schneekugel
description: A fractal snow globe puzzle game. Navigate nested worlds by finding the correct snowflake gate and reach depth 100 to win.
status: in-progress
tags: [game-dev, godot, puzzle, game-jam]
show_thumbnail: false
demo_url: "/assets/games/schneekugel/schneekugel-godot.html"
show_repo: false
last_modified_at: 2024-12-13
---

# Schneekugel (Snow Globe World)

<div class="project-intro">
    <p><em>Schneekugel</em> is a fractal snow globe puzzle game where you navigate through nested worlds by finding the correct snowflake gate. Each snowflake contains another world inside. Reach depth 100 to win.</p>
</div>

<div class="project-links">
    <h2 class="project-link demo">
        <a href="{{ page.demo_url }}" target="_blank" rel="noopener noreferrer">
            <i class="fas fa-gamepad"></i> Play Schneekugel
        </a>
    </h2>
</div>

## How to Play

**Controls:**
- **Arrow Keys**: Move
- **Space**: Start game / Confirm
- **Escape**: Zoom out to parent world

**Goal:** Find the correct snowflake gate to descend deeper into the fractal worlds. The correct snowflake matches the boundary's fractal pattern (Koch snowflake iterations) and pulses in sync with the music. Wrong gates send you back 1-5 levels.

## Mechanics

As you go deeper, the challenge increases:

- **Depth 0-9:** Static snowflakes, quick reveal (2-3 seconds)
- **Depth 10-19:** Snowflakes drift and bounce off walls
- **Depth 20+:** Ice shards cross the arena, knockback on contact
- **Depth 30+:** More shards, faster movement

The correct snowflake is hidden at first. Wait and watch - it gradually reveals itself by pulsing brighter and in sync with the boundary/music. But waiting is risky when shards are flying.

## Features

- Koch snowflake fractal generation (boundaries and gates)
- Nested world navigation with zoom in/out transitions
- 6 color palettes cycling with depth
- Beat-synced pulse system (120 BPM)
- Progressive reveal mechanic
- Wandering snowflakes and ice shard hazards
- Cosmic shader background

## Development

Built with Godot 4.5.1 and GDScript. This is a work-in-progress game jam project.

**Status:** Playable but unfinished. Missing sound effects, victory screen, and additional enemy types planned for later depths.
