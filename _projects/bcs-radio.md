---
layout: project
title: BCS Radio
description: "A pirate radio station from the Golden Triangle sector — AI-generated music, DJ breaks, and a cyberpunk visualizer."
status: released
tags: [next-js, ai-music, creative-coding, golden-triangle]
thumbnail: /assets/images/projects/bcs-radio-thumb.png
show_thumbnail: true
demo_url: https://bcs-radio.vercel.app
last_modified_at: 2026-03-27
---

# BCS Radio

<div class="project-intro">
    <p><em>Bonebox No Kips</em> is a pirate radio station broadcasting from somewhere the Fifth Bureau can't reach. Twelve AI-generated tracks, two AI-voiced DJs, and a cyberpunk visualizer — all built as a companion piece to our <a href="/projects/golden-triangle/">Stars Without Number campaign</a>.</p>
</div>

## What It Is

BCS Radio is an in-universe pirate radio station from the Golden Triangle, our long-running Stars Without Number campaign. The station is hosted by two DJs — **Zafir** (loud, excitable, slang-heavy) and **Kendi** (deadpan, one-word-response energy) — who riff on campaign events between tracks.

Every track ties to something that actually happened at the table. "Catfish Wrangler" is about the time the crew went grave-robbing on Celeva. "Release the Tox-Men" is about when they found sealed monsters underground and gave them the passwords. "Eighty-Eight Cuts" is the captain's theme — a man carrying forty thousand ghosts in his nervous system who uses an ancient god-artifact to check ore futures.

## The Music

Twelve tracks generated with [Suno](https://suno.com), each in a different genre blending Middle Eastern, Southeast Asian, and electronic music:

| # | Track | Style |
|---|-------|-------|
| 1 | Catfish Wrangler (Baha's Theme) | Lo-fi reggaeton, gamelan |
| 2 | Not Truly Occult | Dark Arabic trap, 808s |
| 3 | Seven Stress | Arabic deep house, ney flute |
| 4 | Night Heart Hustle | Afro-Arabic house, oud groove |
| 5 | Release the Tox-Men | Middle Eastern EDM, festival |
| 6 | Souk Runner | Middle Eastern DnB, breakbeat |
| 7 | Seven Stress (Shanty Cut) | Space shanty, crew vocals |
| 8 | Terminator Troll (Smuggle the Truck) | Industrial bass, cyberpunk |
| 9 | Eighty-Eight Cuts (Blackwell's Theme) | Dark French electro, grime, erhu |
| 10 | Chrome and Acid (Ryze's Theme) | Industrial Arabic house, hard synth |
| 11 | Thirteen Reasons (Zheo's Theme) | Lo-fi Arabic minimal, dark comedy |
| 12 | Wild Bunch (Garrick's Theme) | Industrial military hip-hop, Arabic scales |

## The DJ Breaks

Between tracks, Zafir and Kendi banter about campaign events, deliver fake ads for in-universe corporations (Glory Pharmaceuticals, the Counters Guild), and drop station IDs. All voiced with [ElevenLabs](https://elevenlabs.io/) TTS — Zafir in an energetic male voice, Kendi in a flat, laconic female voice.

The full radio session plays as a continuous broadcast: cold open, twelve tracks with DJ breaks between each, and a sign-off. About 45 minutes of content.

## How It Works

- **Next.js 15** static export — no server needed, plays entirely in the browser
- **Web Audio API** for the visualizer — frequency analysis drives the animated bars
- **Deep-linking** — share a link to a specific track and it starts playing from there
- **Responsive** — works on mobile, adjusts layout for smaller screens

The whole thing was built in a few Claude Code sessions: one for the music generation prompts, one for the ElevenLabs DJ recordings, and one for the web app itself.
