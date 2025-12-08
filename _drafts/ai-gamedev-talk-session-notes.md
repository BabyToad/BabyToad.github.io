# AI Game Dev Talk 2025 - Session Notes

## Context
Preparing for a talk at Jonas's alma mater on December 19, 2025 - an update to the Nerdicon talk from June 2025.

## What We Did This Session

### 1. Restructured the Talk
Moved from a muddled 8-section structure to a cleaner 6-section flow:

1. **Foundation** - How AI actually works (transformer, training phases, prediction engine framing)
2. **Straight Lines on a Graph** - Scaling laws & forecasts (the key insight that separates informed observers)
3. **Theory of Mind** - How to work with AI (communication bottleneck, AI as peer, adopt ambition)
4. **Mundane Utility** - Practical applications (content, code, design, accessibility, real examples)
5. **Broader Context** - Ethics & considerations (clear thinking not prescriptions, AI art perspectives, portfolio honesty)
6. **Call to Action** - What to do next (personal benchmarking as centerpiece, five takeaways)

Key change: Theory of Mind now comes BEFORE Mundane Utility (mental model first, then applications).

### 2. Rebuilt the Slide Deck
- 38 slides total (was 36)
- Added content from "The Scaling Era" Stripe Press zine (bird's-eye view diagram, Dario Amodei quote)
- Personal Benchmarking now has its own slide as the centerpiece of Call to Action
- Added all necessary CSS for new HTML elements

### 3. Fact-Checked Timeline (Slide 16)
Corrected the frontier model timeline:
- Mar 2023: GPT-4
- Mar 2024: Claude 3 Opus
- Sep 2024: o1 (reasoning models)
- Dec 2024: Gemini 2.0
- Aug 2025: GPT-5
- Nov 2025: GPT-5.1, Claude Opus 4.5
- Dec 2025: Gemini 3 Pro

Big error caught: Claude Opus 4.5 was listed as "Nov 2024" but is actually Nov 2025.

## Key Ideas We Were Exploring

### From the ai_primer.md notes:
- **The communication bottleneck shift**: With frontier models, output quality is limited by YOUR communication clarity, not model capability
- **AI as peer/collaborator**: "Brilliant colleague having their first day" - knows patterns, doesn't know your context
- **Org management principles translate**: Unit tests, clear specs, context management - all apply to AI
- **Personal benchmarking**: Pick something you're good at evaluating, test periodically, stay calibrated
- **Adopt ambition & agency**: "It would be useful if X. AI, how can we do X?"
- **Keep your brain on**: Don't abdicate thinking, verify assumptions, own the result
- **Classical liberal approach to ethics**: Help students think clearly, not prescribe positions

### The Scaling Era insights we integrated:
- Bird's-eye view of ML: compute/data → pretraining → post-training → inference → output
- Dario Amodei's "zen koan": "The models just want to learn"
- Scaling laws as the key predictive framework
- 50x/year cost decline, 2x capability every 7 months

## Where This Was Heading

### Immediate next steps:
1. Test the rebuilt presentation in browser (visual review)
2. Check slides for content overflow/fit issues
3. Possibly add more concrete examples from Jonas's projects
4. Consider whether any slides need trimming or combining

### Potential refinements discussed but not implemented:
- The ML flow diagram (slide 5) could be made more visual/polished
- Could add an actual graph visualization for the scaling curve (slide 12)
- Personal benchmarking slide could include a concrete example task
- Resources slide could be updated with more specific links

### Open questions:
- Is 38 slides too many for 45-60 minutes + Q&A?
- Does the "Broader Context" section feel rushed at only 4 slides?
- Should there be more interactive elements or demos?

## Files Changed
- `assets/talks/ai-gamedev-2025/index.html` - Complete rebuild with new structure
- `assets/talks/ai-gamedev-2025/style.css` - Added styles for new HTML elements
- `assets/talks/ai-gamedev-2025/slides.js` - Unchanged (still works)
- `_blog/2025-12-19-ai-gamedev-talk-2025-update.md` - Blog post about the talk

## Reference Material
- `ZINE-Scaling_Era-singles.pdf` - Stripe Press zine (not committed, local only)
- `_drafts/ai_primer.md` - Jonas's notes on AI understanding framework
