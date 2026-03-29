---
layout: post
title: "Ask the Archives: AI Rules Lookup for AD&D 2E"
date: 2026-03-27
description: "Building an AI agent that answers AD&D 2E rules questions by searching the actual books — not by guessing from training data. Architecture notes on embedding search, Claude Sonnet tool use, and making AI trustworthy for reference work."
tags: [ai, claude-code, web-dev, ad&d, ttrpg, side-project]
visibility: public
---

<!-- TODO: Write the personal section in your own voice. Topics to cover:
  - The problem: AD&D 2E rules scattered across books, stopping play to look things up
  - The solution: clean searchable SRD + AI that answers by searching, not memorizing
  - The "Ask" experience: walk through asking a question, watching it search and reason
  - Design choices: password gate (cost control for friends), Astro (static + islands), Claude Sonnet (tool use quality)
  - Scaffolding pattern: build tools and data, let AI operate them (same as ytmusic-mcp, obsidian-archive)
  - Reflection on the approach
-->

I have finally gotten around to playing some AD&D 2E. It's good fun and I can see it being the sweet spot of simple chassis to adapt and hack for my group's playstyle. There is enough to solve most design problems you may run into when doing sandbox dnd, but not so much that it prohibits general problem solving freedom.

Learning a new system is always mentally taxing and involves a lot of lookup. If there is just one rulebook you get the pdf and CTRL+F. But that doesn't scale great across multiple pdfs and word search has limits. Furthermore I like to houserule a lot of things, so I find myself searching my houserule docs plus the 10+ AD&D 2E docs.

Modern software should help us here. So I set out to spin up a well organised SRD framework for all my campaigns, where I can upload all setting, houserules and otherwise related material. I can then index, organise and make it searchable. Primarily to speed up myself but also to make things easier for the players at the table. And with modern webdesign we can make it look nice too.

So I scraped all AD&D 2E pdfs, processed them into Markdown files and organised them. Now they are nice and searchable.

And while I was at it I tried adding an AI agent that can now access the well organised "database", so I added "agentic search". A simple agent loop that can execute search queries on the database and then read the relevant parts, allowing you to ask natural language questions from the rules.

It's nothing fancy but it works quite well as a proof-of-concept. In practice I have the SRD on my local machine and have Claude Code perform the agentic search, but for my players and people less inclined towards CLI ergonomics this is working pretty well, I think.

---

## Technical Documentation (by Opus)

The interesting engineering problem was making an AI agent trustworthy enough for rules reference work. The architecture prioritizes verifiability: every answer should trace back to a specific SRD page, and the user should know when the AI is guessing.

### Architecture

```
Client (Astro island)
  → POST /api/ask { question }
  → Vercel Edge Middleware (cookie auth)
  → Node.js Serverless Function
    → OpenAI embedding (question → vector)
    → Cosine similarity over 4,723 chunks
    → Claude Sonnet agentic loop (up to 8 tool calls)
      Tools: semantic_search, keyword_search, read_page
    → Stream plain text back to client
```

The SRD content is chunked into 4,723 passages and embedded with OpenAI's `text-embedding-3-small`. The embedding index is 174 MB, committed via Git LFS. At query time, the serverless function loads the index into memory (cached between invocations on warm starts), embeds the incoming question, and runs cosine similarity to find relevant chunks.

### The Agent Loop

Claude Sonnet receives the question plus three tools. The system prompt instructs it to search before answering and to cite specific pages. A typical query makes 2-4 tool calls:

1. **semantic_search** with the question → returns top-K chunks with titles and snippets
2. **read_page** on the most relevant result → returns full page text
3. Optionally **keyword_search** for specific terms the semantic search missed
4. Compose the answer with citations

The `streamText` function from AI SDK v6 handles the agentic loop. Each tool call is defined with a Zod schema for input validation and an `execute` function that runs the search. The model decides when to stop searching and start writing.

### AI SDK v6 Migration

The project started on AI SDK v4 and hit every breaking change in v6:

- `parameters` → `inputSchema` in tool definitions
- `maxSteps` → `stopWhen: maxSteps(N)` for agentic loops
- `toDataStreamResponse()` → `pipeTextStreamToResponse()` (the data stream protocol was removed)
- Tool generics simplified (no more `tool<any, any>()`)

The data stream protocol removal was the biggest change. v4/v5 sent structured JSON events (tool calls, text deltas, metadata). v6 defaults to plain text streaming, which is simpler but loses tool visibility on the client. The plan is to switch to `pipeUIMessageStreamToResponse` to get structured events back for showing search status.

### Embedding Pipeline

Built locally, not in CI:

```bash
npx tsx scripts/build-embeddings.ts
```

The script reads all markdown source files, chunks them using a custom splitter (respects heading boundaries, targets ~500 tokens per chunk), embeds each chunk via OpenAI, and writes the full index to `src/ask/embeddings.json`. This runs once when the SRD content changes.

**Stats:**
- 391 source pages → 4,723 chunks
- 174 MB embedding index (1,536-dimension vectors)
- Build time: ~5 minutes (rate-limited by OpenAI API)

### Auth and Rate Limiting

The SRD is gated behind a simple password check. Vercel Edge Middleware intercepts all `/adnd-2e/*` and `/api/ask` routes. No cookie → redirect to login. The login form POSTs to `/api/srd-auth`, which SHA-256 hashes the input and compares against `SRD_GATE_HASH`. Match → set `srd-auth` cookie → 303 redirect.

Rate limiting uses Redis (Vercel KV). Each IP gets a request counter with a sliding window. This is cost protection, not security — the gate password is shared among friends, and any one person running expensive queries in a loop would be a social problem, not a technical one.

### Test Coverage

74 tests across 5 files covering the serverless handler, all three tool execute functions, rate limiting, cookie parsing, IP extraction, and edge cases like zero-magnitude cosine similarity vectors. The middleware has its own test suite for auth routing.

### What's Next

The current UI streams plain text. Planned improvements:

- **Rich markdown rendering** — Claude outputs tables, headings, blockquotes; currently rendered as plaintext
- **Tool visibility** — show what the agent searched and read, warn when answering from training data
- **Semantic caching** — cache Q&A pairs by embedding similarity to avoid re-running expensive queries
- **Clickable citations** — convert "PHB Chapter 9" references into links to the actual SRD pages
