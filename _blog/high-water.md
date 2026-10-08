---
layout: post
title: "Making HIGH WATER with a studio of agents"
date: 2026-10-08
description: "A jam brawler built in one week by me and about twenty named AI agents: what we made, how the studio was organised, and why we got disqualified."
tags: [godot, game-dev, ai, game-jam, process]
toc: true
visibility: public
---

*This is a copy of the [HIGH WATER project page](/projects/high-water.html). [Play it on itch.io](https://limeminister.itch.io/high-water) · [The talk](/high-water/talk/) · [The decision boards](/high-water/boards/)*

I made a game. Well, me plus a bunch of AI agents. You can do really good, high quality work now. Especially if you know what you are doing.

## The Game

A game about being a powerful cyberpunk operator wrecking people and everything else in the way. You play as TIDEMARK, a cybernetically enhanced murder machine fighting through a habitat tower against the gang PETTY VERMIN.

I wanted to dig into a simple brawler mechanic and make it feel good. And then, since I like physics, see what you can do in terms of building on that basic good game feel by expanding everything around it with physics simulation. So there is lots of throwing, bouncing, breaking, destruction and other environmental interactions.

Play around and have fun wrecking up combos.

## Making It

As the frontier models progress in capabilities I am seeing how much you can integrate them into the game building process.
Opus 5.5 released recently and it's a good model, sir.[[Anthropic, ["Introducing Claude Opus 5.5"](https://www.anthropic.com/claude-opus-5-5), 22 Sep 2026. The motion-design reputation comes from users: [Donald Jewkes' one-prompt music video](https://x.com/donaldjewkes/status/2102801469976248500) (full prompt shared, 12 hours of work) and [Pleometric's PC-98 remake of it](https://x.com/pleometric/status/2103082510607610023).]] But it was seemingly a step change in motion design, graphics design and using Blender and tools for visual and motion video. I figured that is probably going to translate to games, but wanted to have my own benchmark. Thus HIGH WATER.

HIGH WATER was built over one week, during evenings and a weekend, running a "studio" of about 20 named agents: Opus 5.5 subagents plus two Codex agents on GPT-6 Astra, one reviewing every batch of work and one on Web performance.

To coordinate all of that I had one main conversation with an Opus 5.5 instance that coordinated communication with all other agents. I talked through the design, gave feedback from playtesting, their takes and ideas, and we used dozens of HTML artifacts to communicate the details. Using HTML artifacts as a means of relaying and trying out information and context is still incredibly useful, as it is clearer and captures more bandwidth and multimedia info than just text or chat.[[Thariq Shihipar, ["Using Claude Code: The unreasonable effectiveness of HTML"](https://claude.com/blog/using-claude-code-the-unreasonable-effectiveness-of-html), May 2026. [The decision boards](/high-water/boards/) are what that looked like here.]]

From previous experiments I knew a failure mode of having a bunch of subagents is coordinating them, understanding what everyone is doing and keeping on track. Especially over multiple days of work, where there are context resets for both the agents and me.
I was inspired by @repligate and recent Anthropic research that reported that giving agents persistent identities helps them tell each other apart, check each other's work and coordinate.[[Anthropic's [report on measuring the pace of AI development](https://www.anthropic.com/institute/measuring-pace-of-ai-development), Sep 2026, appendix "Oversight of agents".]][[Janus (@repligate), [20 Sep 2026](https://x.com/repligate/status/2101554297469337687), on why long-horizon work favours persistent identities.]] I figured let's test it. Every agent was encouraged to pick a name for themselves and assume a specific role and responsibility. This worked way better than I thought. Maybe that's simply because Opus 5.5 is a great model, but on a basic level of understanding what's happening in the process, and what is being generated and input by whom, clear names made tracking what's happening easier for me. Which makes it easier for me to stay locked in and steer the process.

Also all assets, music, code and level design in this project were made by agents. My only role was directing, communicating what works and doesn't and what ideas to explore.
The voxel assets were written as code: Python scripts that box, carve and paint voxels and export them to .vox. The music is 4-operator FM synthesis in the style of the YM2151 arcade chip, scored as MML text and rendered by a Python synthesiser adapted from my OPNA engine for Down Bad in Babel. The sound effects and the voice lines are synthesised with numpy and scipy, no samples. The UI is done by agents in code. The intro video is Blender 5.0 renders of the code-built hero plus captures of the game itself, cut together with ffmpeg.[[Midjourney character studies were reference only. Nothing from an image, audio or voice model is in the game.]]

So this entire project was natively created by Claudes and GPTs using tools. Pretty cool.

Now, in the end the jam banned AI-generated assets and we got disqualified after chatting with the organisers. But I expected that, and it is totally fair.
So check out the cool stuff the others made, I do not want to take their limelight: [Vierfacher Questpresso on itch.io](https://itch.io/jam/vierfacher-questpresso).

## Further Reading and References

- **[The talk](/high-water/talk/):** a slide deck for when I want to speak on this. The three theses: engineering and developing with coding agents is a lot like management and you have to think about how to build efficient organizations; use artifacts to communicate; Game Design Documents and Guiding Light text are important to focus everyone. Plus review, what went wrong, and a dense Godot appendix.
- **[The decision boards](/high-water/boards/):** examples of the HTML artifacts used during the process.
- Thariq Shihipar, **["Using Claude Code: The unreasonable effectiveness of HTML"](https://claude.com/blog/using-claude-code-the-unreasonable-effectiveness-of-html)**, Claude blog, May 2026 ([first posted on X](https://x.com/trq212/status/2052809885763747935)). Once agents write long plans and reports, HTML beats Markdown: tables, diagrams, interactive controls, shareable as a link.
- Anthropic, **["Measurements for understanding the pace of AI development inside frontier labs"](https://www.anthropic.com/institute/measuring-pace-of-ai-development)**, c. 17 Sep 2026. The appendix "Oversight of agents" describes the internal scaffold: each agent has an individual identity that survives model upgrades, and agents talk on an open board where every message is tied to its author. The stated reasons: agents treat each other's output as claims to check, make fewer correlated mistakes, and stay auditable.
- Janus (@repligate), **[20 Sep 2026](https://x.com/repligate/status/2101554297469337687)**, reads that post as evidence that long-horizon work favours persistent-identity agents over task-scoped ones. Earlier ([1](https://x.com/repligate/status/2017711198972875142), [2](https://x.com/repligate/status/2017712297863746005), Feb 2026) Janus argued that Claude Code's "subagent" framing works worse than peers talking through a message system.
- Anthropic, **["Introducing Claude Opus 5.5"](https://www.anthropic.com/claude-opus-5-5)**, 22 Sep 2026. The announcement only mentions a game-building test where it scored highest on graphics and polish; the motion-design reputation comes from users. [Donald Jewkes](https://x.com/donaldjewkes/status/2102801469976248500) (23 Sep) made a full music video from one spoken prompt, which Claude worked on for 12 hours, and shared the prompt; [Pleometric](https://x.com/pleometric/status/2103082510607610023) (24 Sep) followed the same workflow "to really push Opus 5.5" into a PC-98 restyle. [Alex Albert](https://x.com/alexalbert__/status/2102458348511879448) showed Blender claymation from a single prompt.
