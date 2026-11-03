---
layout: project
title: Six Springs Three Rivers
description: "A saint in a painted wayside shrine. She watches your pointer, rings the bell, takes the bowl and drops it if you poke her, and her words appear on the wall in water. Work in progress, running in the browser on a local 2D character system called Dalang."
status: WIP
tags: [wip, animation, three-js, character, ai, interactive]
thumbnail: /assets/images/projects/six-springs-thumb.jpg
image: /assets/images/projects/six-springs-thumb.jpg
show_thumbnail: true
demo_url: /six-springs/
show_repo: false
last_modified_at: 2026-11-03
date: 2026-11-03
---

<div class="project-intro">
    <p>A saint in a painted wayside shrine. Move your pointer and she watches it. Ring the bell, offer the bowl, feed the frog, poke her. Her words appear on the wall.</p>
</div>

**[Enter the shrine](/six-springs/)**. It has sound; there is a mute button, and it runs on a phone, though best on a desktop.

*Work in progress. The mix, the voice takes and the hands are still being worked on.*

## What it is

Six Springs Three Rivers is a character from my Throne and Wheel campaign. She is drawn as a vector puppet and animated by hand-keyed poses: every frame is a pose vector turned into a drawing, with no video model in the loop. The shrine is one painting, split by depth into a small three.js stage, so her shadow, the bell, the bowl and the frog share one light with the painted room.

Everything reacts to what actually happened. The bowl clanks as hard as it really landed, the bell strikes at the real turning points of its swing, the music stops playing when she speaks and damps its strings when the bowl falls. The animation system underneath is called Dalang, after the puppet master in wayang.

It started from [a tweet by Araminta about a rigged-puppet animation workflow](https://x.com/araminta_k/status/2117267137614205029), and grew from there.

## How it was made

Directed by me, built by Claude Opus 5.5 and GPT-6 Astra working in separate lanes and reviewing each other's work. The art is AI-generated: the painting and her parts sheets came from image models, the water loops are moved through the painting's own brushwork. Her voice is ElevenLabs (the Aki voice), reading lines written for her. Ambience and sound effects are ElevenLabs Sound Effects. The zither piece is original, played live from CC0 samples (VCSL, VSCO 2 CE). Fonts are Yatra One and Inknut Antiqua (OFL), and the stage runs on three.js (MIT).

<p><small>This page's text was drafted by Claude and has not yet been rewritten by Jonas.</small></p>
