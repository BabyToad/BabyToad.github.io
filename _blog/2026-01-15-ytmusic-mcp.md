---
layout: post
title: "Claude Code Operates My YouTube Music"
date: 2026-01-15
description: "Building an MCP server to let Claude Code control YouTube Music playback, search, and queue management. Thoughts on scaffolding for LLM workflows."
tags: [ai, claude-code, mcp, side-project, automation]
visibility: public
---

## Claude Code operates my YouTube Music

A recent experiment in claudeomating little personal things on my PC via Claude Code has given me the option to simply write: "I am working on @Project, put together a playlist fitting and hit play."

Claude Code then controls YouTube Music in Chrome, and via MCP server puts together the playlists.

Getting this to work was a bit of a struggle because YouTube does not provide too much in terms of API controls for YouTube Music. There are existing libraries but in the spirit of testing what Claude Code and Opus 4.5 can do I settled on building something myself.

The solution was Chrome Extension + MCP Server + WebSocket Bridge + a Skill.md for Claude.

### The Process
Claude works best when you can build a closed feedback loop. In SWE that means setting up TDD, linters and debug tools. Always worth it.

Here the best tool was Claude Chrome to give it access to the YouTube Music page and figure it out. Claude Chrome helps a lot as a hacky solution for it to figure out how the page works. But Claude Chrome is really not the best for navigating User Interfaces built for humans. To get something durable we had to figure out the site structure via some experimenting and write JavaScript to automate the clicks.

This took some human in the loop iterative testing, with me giving Claude feedback on things it couldn't quite make out with only the Screenshot tool.
Things got to working pretty quickly after that.

### Claude Scaffolding
I have begun to approach a lot of my software interaction as thinking about what harness or scaffold I need to build for Claude to let it operate the software in my stead.

So once you are done with building the scaffolding use it a bunch, and make notes. Claude too will be pretty good at figuring out the workflow kinks and then you just write it all into a Skill.md.
That gives you Scaffold plus Skill and with a day of work you have something pretty useful. When things don't work just ask Claude to fix them. In the future I should experiment with writing recursive Skill.md that allow Claude to file feature or bug reports, and then to allow it to update the Skill.md with new workflow learnings.

When you reverse that thought it becomes clear that you can make your own software more useful if you build with agentic LLMs in mind, it will be way more usable out of the box if you QA not just for humans but also for LLMs.


## Technical Documentation (by Opus 4.5)

YouTube Music doesn't want to be automated. No API, deeply nested web components, confirmation dialogs when you navigate during playback. The architecture chains Claude Code → MCP server (stdio) → WebSocket → Chrome extension → YouTube Music page. The hard parts were all about YouTube Music's implicit assumptions: queue state lives in the page and dies on navigation, search results mix content types with different menu options, and the beforeunload dialog blocks all browser automation.

### What Was Built
- MCP (Model Context Protocol) server that lets Claude Code control YouTube Music
- Chrome extension (Manifest V3) that runs on music.youtube.com
- WebSocket bridge connecting the two (port 8766)
- ~1400 lines of code total across 4 main files

### Architecture
```
Claude Code <-> MCP Server (stdio) <-> WebSocket (port 8766) <-> Chrome Extension <-> YouTube Music
```

### Components

| Component | Tech | Lines |
| --- | --- | --- |
| Chrome extension content script | JavaScript | 730 |
| MCP server | TypeScript | 334 |
| WebSocket bridge | TypeScript | 240 |
| Type definitions | TypeScript | 110 |

### Dependencies
- @modelcontextprotocol/sdk ^1.0.0
- ws ^8.18.0 (WebSocket library)
- TypeScript 5.x

### Tools Implemented (17 total)
**Playback**: play, pause, next, previous, set_volume, like, dislike
**Search/Queue**: search, add_to_queue, play_next
**Debug**: status, now_playing, get_search_state, get_page_info, get_debug_logs, clear_search_state

### Key Technical Decisions

**State machine for search**
- Problem: Page navigation loses context
- Solution: Persist state in sessionStorage, process on each page load
- States: IDLE -> NAVIGATING_TO_SEARCH -> EXTRACTING_VIDEO_ID -> NAVIGATING_TO_WATCH -> STARTING_PLAYBACK -> COMPLETE

**In-page search for queue**
- Problem: URL navigation clears the queue
- Solution: Type in search box instead of navigating, preserves queue context

**Song vs Album filtering**
- Problem: "Add to queue" only works on songs, not albums/artists/videos
- Solution: Check for "Song" in subtitle text before clicking menu

**Beforeunload popup**
- Problem: YouTube Music shows "Leave site?" when navigating during playback
- Solution: Pause video before any navigation

### Bugs Encountered and Fixed
1. Queue commands clicking on albums (no "Add to queue" option) - fixed with song filtering
2. "Leave site?" popup blocking Chrome automation - fixed by pausing before navigation
3. Queue clearing on navigation - fixed with in-page search approach

### How Claude Code Was Used
- Wrote all code (TypeScript, JavaScript)
- Debugged via Chrome extension tools (mcp__claude-in-chrome__)
- Iterative testing: run command -> check Chrome -> fix -> repeat
- Created documentation (CLAUDE.md)
- Created skill file for future use (/ytmusic)

### Setup Required
1. Build MCP server: `npm install && npm run build`
2. Load Chrome extension (developer mode, load unpacked)
3. Open YouTube Music in Chrome
4. Add MCP config to .mcp.json

### Limitations Discovered
- Extension must be in focused tab for queue commands to work reliably
- Only works with songs (albums need separate handling)
- YouTube Music DOM structure could change and break selectors
