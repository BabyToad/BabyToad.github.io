---
layout: project
title: HIGH WATER
description: "A physics brawler where the building is the other enemy. Built in Godot in one jam week with a studio of about twenty AI agents; a talk and an archive of the decision boards document how."
status: complete
tags: [godot, game-dev, brawler, ai, game-jam, process]
thumbnail: /assets/images/projects/high-water-thumb.png
show_thumbnail: true
demo_url: https://limeminister.itch.io/high-water
show_repo: false
last_modified_at: 2026-10-05
---

# HIGH WATER

<div class="project-intro">
    <p>A Streets of Rage brawler with Smash physics, where the building is the other enemy. Every wall is masonry, every pier holds something up, every thug is a projectile. Made for the Vierfacher Questpresso jam (theme: <em>Destroy the System!</em>), October 2026.</p>
</div>

**[Play it on itch.io](https://limeminister.itch.io/high-water)** · **[The talk](/high-water/talk/)** · **[The decision boards](/high-water/boards/)**

## What it is

You are TIDEMARK, a High Water contractor on a Restoration of Title job in Tower Three of Babel: clear the Petty Vermin off their floors and bring the building down around them. A three-punch string with hitstop on every contact, gravity gloves, a railgun your fists charge, and a building simulation underneath. Power, gas, fire, water and load paths chain into each other: a spark in a flooded canal shocks everyone standing in it.

## How it was made

HIGH WATER was built in one week by me together with **Studio Hitstop**, a crew of about twenty named AI coding agents: Claude agents with their own lanes (enemies, rigs, UI, levels, water, sound, music, VFX, release) and two Codex members, one reviewing every batch and one on Web performance. I directed, made the calls and played every build.

The characters are voxel models written as code, every sound effect is synthesised, the music is FM scores rendered by our own synthesiser, and the UI is drawn in code. No generative image, audio or voice models were used. The jam banned AI-generated assets; we disclosed everything and were disqualified, which was a fair call for a jam built to keep the field even for amateurs.

## The record

- **[The talk](/high-water/talk/):** a retrospective for game developers. The three theses: organisation is the bottleneck once humans and agents work together; artifacts are communication and must run both ways; canonical documents are shared memory. Plus review, what went wrong, and a dense Godot appendix.
- **[The decision boards](/high-water/boards/):** the interactive HTML boards the agents built so I could choose between options, archived with what was picked.

By the numbers: 1,036 commits in six working days, 24 independent review rounds, 39 decision boards, about 140 headless check scenes.
