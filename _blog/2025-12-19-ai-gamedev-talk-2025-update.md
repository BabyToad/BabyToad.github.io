---
layout: post
title: "AI for Game Developers: 2025 Update"
date: 2025-12-19
description: "Updated talk on practical AI for game development, featuring new models, refined insights, and an interactive presentation format"
tags: [ai, game-dev, talks, mundane-utility, tools, education]
toc: true
visibility: public
---

I'm returning to my alma mater today to give an updated version of my [AI for Game Developers talk](/blog/ai-for-game-dev-talk-archive) from earlier this year. Six months in AI is a lifetime - we've gone from GPT-4 to GPT-5.1, Claude Opus to Opus 4.5, and Gemini 2.0 to Gemini 3 Pro. More importantly, my understanding of how to *work with* these tools has evolved significantly.

## What's New in This Talk

### 1. Communication is the New Bottleneck

**The key insight:** With frontier models (Opus 4.5, GPT-5.1, Gemini 3 Pro), the quality of output is primarily limited by **your communication clarity**, not the model's capability.

This is a fundamental shift from even six months ago. I rarely do more QA with AI collaborators than I would with human collaborators now. The bottleneck moved from "can the model understand this?" to "did I communicate what I actually want?"

**Practical implication:** Better software engineering skills → Better AI output (because you can articulate requirements clearly)

### 2. AI as Peer/Collaborator

Treat AI like a brilliant colleague having their first day at your studio:

**They know:**
- General software engineering patterns
- Common best practices
- How things usually work

**They don't know:**
- Your specific codebase
- Your design constraints
- Your project context

This mental model has proven incredibly useful. Instead of commanding ("do X"), try consulting: *"You likely have more technical expertise here - what would you do and why?"*

Then verify assumptions, correct misconceptions, and iterate. Keep your brain on. Don't abdicate thinking.

### 3. Updated Model Landscape

**Frontier models matter more than ever:**
- **Capability > Speed > Cost** (in that order)
- $20/month for Claude Pro or ChatGPT Plus is the best investment you can make
- Frontier models save hours daily; cost difference is negligible vs your time

**Latest developments (as of Dec 2025):**
- GPT-5.1 with extended thinking and pro modes
- Claude Opus 4.5 with improved reasoning
- Gemini 3 Pro with multimodal capabilities
- All significantly better than their predecessors

### 4. Expanded Practical Applications

**New emphasis areas:**

**Accessibility** - Huge mundane utility gains:
- Auto-generated alt text for UI elements
- Audio description scripts for cutscenes
- Subtitle generation from voiceover
- Colorblind validation of color schemes
- Accessibility used to be expensive → Now it's cheap and easy

**Multi-modal AI tools:**
- Image generation (MidJourney, DALL-E, Stable Diffusion) for concept art, textures, UI mockups
- Audio generation (ElevenLabs, Suno) for temp VO and music sketches
- 3D/Animation (Meshy AI, DeepMotion) for rapid prototyping

**Quality control through unit tests:**
- Same QA principles for humans work for AI
- Write tests FIRST, then ask AI to implement
- Tests catch miscommunication before it becomes bugs
- With frontier models + tests, QA time ≈ same as human collaborators

### 5. Ethics & Clear Thinking

**New framing:** Classical liberal approach to AI ethics

Instead of prescribing what students should think, I help them think clearly:
- Present multiple perspectives fairly (AI art: both sides have legitimate arguments)
- Explain tradeoffs of different positions
- Provide tools for informed decision-making
- Trust students to form their own positions

**Portfolio guidance added:**
- How to present AI-assisted work honestly
- When and how to disclose AI use
- What employers expect re: AI literacy in 2025
- Highlighting unique human contributions alongside AI assistance

### 6. Personal Benchmarking Strategy

**The most actionable new takeaway:**

Pick a benchmark task you're good at evaluating, then:
1. Choose a task in your domain (e.g., "generate 10 balanced weapon stats")
2. Test periodically (every 3-6 months) with latest models
3. Evaluate quality (you're the expert)
4. Adjust AI usage as capabilities improve

Don't rely on hype or lab benchmarks. Test what matters to YOUR work. Stay calibrated to the frontier without noise.

## Interactive Presentation Format

This time, I've built an **interactive slide presentation** hosted directly on this site:

### [▶️ View the Full Presentation](/assets/talks/ai-gamedev-2025/)

**Features:**
- Keyboard navigation (arrows, space, home, end)
- Fullscreen mode (press F)
- Presenter mode with notes and timer (press P)
- Progressive reveals for key insights
- Mobile-friendly with touch gestures
- Printable to PDF for reference

**Navigation tips:**
- Arrow keys or space: Next slide
- F: Toggle fullscreen
- P: Toggle presenter mode (shows notes and timer)
- Home/End: Jump to first/last slide
- Click links to external demos and resources

## Core Philosophy: Mundane Utility

The talk continues to focus on **mundane but genuinely useful** applications:

✅ Tasks AI handles well *today*
✅ Tools that save time on repetitive work
✅ Practical workflows for indie developers
❌ AGI hype
❌ Creative replacement fantasies
❌ Vague promises of future capabilities

## What Hasn't Changed

**The fundamentals still hold:**

1. **AI is a prediction engine** - Transformers excel at pattern matching at scale
2. **Context is everything** - Specific context → Better output
3. **Scaling laws work** - 2x compute → Predictable performance gains
4. **Costs keep falling** - 50x/year median price decline continues
5. **Capabilities keep growing** - Task length doubling every 7 months (6 years of data)

## Key Resources

### From This Talk
- [Interactive Presentation](/assets/talks/ai-gamedev-2025/) - Full slide deck with presenter notes
- [Transformer Visualization](/transformer-viz) - How AI actually processes information
- [Original Talk Archive](/blog/ai-for-game-dev-talk-archive) - June 2025 version with extensive sources

### Practical Tools (Updated Dec 2025)
- [Claude Pro](https://claude.ai) - $20/month, best for complex reasoning
- [ChatGPT Plus](https://openai.com) - $20/month, GPT-5.1 with thinking modes
- [Gemini Advanced](https://one.google.com/about/gemini-advanced) - Gemini 3 Pro access
- [GitHub Copilot](https://github.com/features/copilot) - $10/month code completion
- [Cursor](https://cursor.sh) - AI-first code editor
- [Claude Code](https://claude.com/code) - Full-feature implementation tool

### Learning Resources
- [One Useful Thing](https://www.oneusefulthing.org/) - Ethan Mollick's practical AI blog
- [AI-2027.com](https://ai-2027.com) - Near-term predictions and analysis
- [Epoch AI](https://epoch.ai) - Data-driven AI research
- [Dwarkesh Patel Podcast](https://www.dwarkeshpatel.com/podcast) - AI researcher interviews

## What's Different in 6 Months?

**Model capabilities:**
- Longer context windows (2M+ tokens now common)
- Better reasoning (o-series thinking, Claude's extended thinking)
- Multi-modal improvements (image understanding, generation)
- Agent capabilities (multi-hour autonomous tasks)

**My workflow changes:**
- Less debugging of AI output, more communicating requirements
- More trust in AI architectural suggestions (with verification)
- Heavier use of Claude Code for full-feature implementation
- Personal benchmarks help me track real capability vs hype

**Industry shifts:**
- AI literacy becoming expected in game dev hiring
- More studios adopting AI tools openly
- Clearer ethical guidelines emerging
- Better understanding of when NOT to use AI

## Unsolved Problems: Opportunity Space

Things that SHOULD be possible but aren't quite there yet:

- **Automated playtesting** - AI playing your game, modeling player behavior
- **Dynamic QA** - AI finding edge cases you didn't think of
- **Adaptive difficulty** - Real-time player skill modeling
- **Procedural narrative** - AI GM for emergent storytelling
- **Asset consistency** - Multi-modal AI maintaining visual style across generation

These are research opportunities for students. Early adopters will have significant advantages.

## Call to Action

**Five concrete takeaways:**

1. **Get involved** - Use the dang thing. Experiment. Build intuition.
2. **Maintain your benchmark** - Track capability growth in YOUR domain over time
3. **Stay current** - Models update every 2-4 months; year-old knowledge is outdated
4. **Think clearly** - Form your own positions on ethics, usage, disclosure
5. **Adopt ambition** - "It would be useful if X. AI, how can we do X?"

## Broader Context

**Things to be aware of (not panic about):**

**Economic:**
- Labor market transformation in creative industries
- Productivity growth acceleration
- Infrastructure buildout (data centers, energy, water)

**Safety:**
- X-risk considerations (existential safety)
- Mundane harms (bias, misinformation, copyright)
- Environmental impact (energy, water consumption)

**Societal:**
- Education system adaptation needed
- Copyright and legal frameworks evolving
- Human-AI collaboration patterns emerging
- Disclosure norms still being established

**The message:** Stay informed, think critically, make conscious choices about your AI use.

## Questions & Feedback

I'll be at the talk for Q&A, but you can also reach me:
- Email: [heinke.jonas@googlemail.com](mailto:heinke.jonas@googlemail.com)
- Portfolio: [playinsightstudios.com](https://playinsightstudios.com)
- Project examples: [For Want of Fuel](/for-want-of-fuel) (used AI extensively)

---

*This presentation represents my current understanding as of December 2025. Given how fast AI moves, expect this to be outdated by mid-2026. That's why personal benchmarking matters - it keeps you calibrated to the frontier.*

*The source code for the interactive presentation is available in the [site repository](https://github.com/BabyToad/BabyToad.github.io/tree/main/assets/talks/ai-gamedev-2025) if you want to adapt it for your own talks.*
