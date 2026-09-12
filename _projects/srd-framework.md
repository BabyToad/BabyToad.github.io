---
layout: project
title: "SRD Framework"
description: "A multi-system tabletop RPG reference built for humans in a browser and agents over HTTP: searchable SRDs, price ledgers, spell databases and seeded random tables."
status: released
tags: [astro, ttrpg, ad&d, swn, wwn, agents, web-dev]
thumbnail: /assets/images/projects/srd-framework-thumb.png
show_thumbnail: true
demo_url: https://srd-framework.vercel.app
last_modified_at: 2026-09-12
---

# SRD Framework

<div class="project-intro">
    <p>One reference site for the systems my tables play: Stars Without Number (The Golden Triangle), Worlds Without Number, AD&D 2nd Edition and my own Throne and Wheel rules. Searchable, static, and deliberately readable by AI agents as well as people.</p>
</div>

## What it is

Rules for a campaign end up scattered across rulebooks, house-rule documents and half-remembered rulings. The SRD Framework puts each system in one place as clean markdown, rendered with [Astro](https://astro.build/) and searched client-side with [Pagefind](https://pagefind.app/). No server is needed to read a rule.

Beyond the text there are tools: price ledgers for OSE and Throne and Wheel, a spell database, treasure and random-table generators, and system maps for the Golden Triangle. Anything random takes a seed and reports it, so a result can be cited and re-rolled.

## Built for agents too

The part I care most about is that the site is a first-class citizen for language models, not an afterthought:

- Every content page has a markdown sibling. Append `.md` to any page URL, or send `Accept: text/markdown`, and you get the source instead of the HTML at roughly a tenth of the tokens.
- `/llms.txt` indexes the systems, tools, API and conventions; `/llms-full.txt` carries the public systems in one file.
- The random-table API is described in `/openapi.json` and answers 4xx errors with instructions for what to do next.
- Gated systems serve a login page that explains how an agent authenticates, and a manifest whose links already carry the caller's token, for harnesses that can follow links but not build URLs.

## Ask the Archives, retired

The first version of this project was an AD&D 2E SRD with "Ask the Archives", a tool-using Claude agent that answered rules questions by searching the books rather than reciting training data. It worked, and it taught me how to make an AI answer verifiable. It was removed in June 2026: the cost per question was real, and once the site itself was agent-readable, any model with a fetch tool could do the same lookup without a bespoke endpoint. The write-up survives in the [blog post](/blog/ask-the-archives/).

## Technical Details

- **Astro 5** static site on Vercel, edge middleware for auth and content negotiation
- **Pagefind** for client-side full-text search
- Content synced from my Obsidian vault; wiki-links resolved to site paths at sync time
- Seeded random tables and price ledgers as JSON, served both to pages and to the API
- Licensed material (WWN, AD&D) is password-gated for friends; the Golden Triangle system is public
