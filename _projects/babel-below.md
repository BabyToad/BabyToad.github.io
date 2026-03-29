---
layout: project
title: Babel Below
description: "A tactical roguelike translating tabletop RPG mechanics into grid-based combat. Into the Breach meets Cyberpunk 2077."
status: wip
tags: [godot, game-dev, roguelike, tactics, cyberpunk]
thumbnail: /assets/images/projects/babel-below-thumb.png
show_thumbnail: true
github_url: https://github.com/BabyToad/babel-below
show_repo: true
demo_url: https://babelbelow.vercel.app
last_modified_at: 2026-03-27
---

# Babel Below

<div class="project-intro">
    <p>A tactical roguelike that translates <a href="/projects/mondnacht/">Forged in the Dark</a> tabletop mechanics into grid-based combat. Into the Breach meets Cyberpunk 2077, built in Godot 4.6.</p>
</div>

## The Pitch

Babel Below is set in the same universe as *Dark City, Shining Babel* — our Blades in the Dark hack about runners surviving a 2070 Southeast Asian megacity. The tabletop game plays as a heist-and-consequences cycle. The video game translates that into tactical grid combat with permadeath.

You lead a crew of augmented criminals through procedurally generated districts of Babel. Each mission is a "score" — infiltrate, fight, grab the objective, get out before the heat gauge fills. Between missions, you manage stress, maintain your cybernetic augments, deal with entanglements from your last job, and try not to die.

**15-30 minute runs. Permadeath via Trauma. The city always wins eventually.**

## What's Built

The game is in active development, currently at Sprint 1b (Combat Depth). Here's what works:

### Combat
- **Hex grid** with A* pathfinding, line-of-sight, and fog of war
- **FitD dice system** — roll Xd6 take highest, with crits, partial success, and consequences
- **6 enemy AI behaviors**: chase, ranged, shield wall, support/heal, overwatch, and static guard
- **8 enemy types** with faction-specific pools (corporate security, gang enforcers, drones)
- **Environmental interactions**: destructible cover, hazard tiles, hackable terminals, alarm triggers
- **Heat gauge** — fills from loud actions, triggers reinforcements at 4, elite response at 6, mission failure at 8

### Characters
- **3 playbooks**: Street Warrior (combat), Hacker (tech), Murk (stealth/violence)
- **Stress & Trauma** — spend stress to push rolls or resist consequences, but overflow means permanent trauma. Four traumas and you're retired.
- **Augments** — cybernetic and biological upgrades that require maintenance. Skip the maintenance and they might fail mid-mission.

### Infrastructure
- **Narrative engine** with 8 NPCs and 36 storylets driven by prerequisite evaluation and clocks
- **Audio system** — 53 sound effects, 9 music tracks, heat-reactive layers that intensify as missions escalate
- **Debug console** with 60+ commands (including an LLM helper for development)
- **659 tests** across 30 test suites
- **CRT/LCD visual aesthetic** — 5-layer post-processing stack for that stolen-corporate-cyberdeck look

## What's Next

- **Sprint 2**: Mission objectives beyond "kill everyone" — extraction, sabotage, data heist. Disengagement rolls for getting out alive.
- **Sprint 3**: Economy and advancement — BabelCoin flow, crew upgrades, entanglements between missions
- **Sprint 4**: Second district (The Town), tutorial, audio polish, HTML5 export

## Built With

- **Godot 4.6** + GDScript
- **Claude Code** agent swarms — the project uses a conductor/worktree model where multiple Claude agents work on different systems in parallel, coordinated through shared status files and interface contracts
- **AI art generation** for portraits, tokens, environments, and the cityscape
- **ElevenLabs** for sound effects
- **Suno** for the soundtrack
