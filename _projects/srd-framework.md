---
layout: project
title: "AD&D 2E SRD & Ask the Archives"
description: "A searchable AD&D 2nd Edition rules reference with an AI-powered question-answering system."
status: released
tags: [astro, ai, claude, ad&d, ttrpg, web-dev]
thumbnail: /assets/images/projects/srd-framework-thumb.png
show_thumbnail: true
demo_url: https://srd-framework.vercel.app
last_modified_at: 2026-03-27
---

# AD&D 2E SRD & Ask the Archives

<div class="project-intro">
    <p>A searchable reference for Advanced Dungeons & Dragons 2nd Edition — 391 pages from the core rulebooks, indexed with full-text search and an AI agent that answers rules questions by actually looking things up rather than guessing from memory.</p>
</div>

## The SRD

AD&D 2E's rules are scattered across three dense rulebooks from 1989-1995. During play, looking up a rule means flipping through the PHB, DMG, and Monstrous Manual while everyone waits. The SRD puts all of it in one searchable place.

**391 pages** from the Player's Handbook, Dungeon Master's Guide, and supplementary material, converted to clean markdown and rendered as a static site. Client-side search via [Pagefind](https://pagefind.app/) makes it instant — type a few characters and results appear without a server round-trip.

Built with [Astro 5](https://astro.build/), deployed on Vercel. The core site is fully static — no JavaScript required to read the rules.

## Ask the Archives

The real experiment is the AI layer. "Ask the Archives" is a sidebar where you can type a natural-language question and get an answer grounded in the actual SRD content.

The key design decision: **the AI answers by searching, not by remembering.** Claude Sonnet has been trained on D&D content and could answer rules questions from memory, but training data gets things wrong — especially for AD&D 2E, where the rules are notoriously specific and full of exceptions. Instead, the agent is given three tools:

- **semantic_search** — finds relevant passages by meaning (embedding similarity over 4,723 chunks)
- **keyword_search** — finds exact matches for specific terms, table names, page references
- **read_page** — reads the full text of a specific SRD page

When you ask "How does THAC0 work?", Claude doesn't recite from training data. It searches the SRD, reads the relevant chapter, and writes an answer with citations you can verify. If no tools are used, the UI warns you the answer came from training data and may not be accurate.

### How It Looks in Practice

Ask about THAC0 and you'll see status updates as the agent works: "Searching: THAC0 attack rolls" → "Reading: PHB Chapter 9" → then a detailed answer with worked examples and a reference to the exact section. The whole thing streams in real-time.

## Why I Built This

We run a biweekly AD&D 2E campaign using the [Frozen Frontier](/projects/for-want-of-fuel/) rules and the table spends too much time looking things up. I wanted a reference that was faster than a PDF and smarter than Ctrl+F. The SRD alone would have been useful. The AI agent was a chance to test whether you could build a tool-using AI that's actually trustworthy for rules lookup — one that shows its work and admits when it's guessing.

## Technical Details

- **Astro 5** static site + Vercel serverless for the AI endpoint
- **Pagefind** for client-side full-text search (zero-config, ~50KB)
- **Claude Sonnet** as the reasoning model, with tool-use for SRD search
- **OpenAI text-embedding-3-small** for semantic search (174 MB embedding index, 4,723 chunks)
- **AI SDK v6** for streaming responses back to the client
- **Redis** for rate limiting (cost control — each query is ~$0.10-0.21)
- **Password-gated** — it's for friends, not the public internet
