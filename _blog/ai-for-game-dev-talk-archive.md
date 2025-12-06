---
layout: post
title: "AI for Game Developers: Mundane Utility Talk Archive"
date: 2025-06-13
description: "Archive and resource hub for my Nerdicon talk on practical AI applications in game development"
tags: [ai, game-dev, talks, mundane-utility, tools]
toc: true
visibility: public
---

I gave a talk at Nerdicon about using AI practically in game development - focusing on the mundane but genuinely useful applications rather than the hype. This post serves as an archive and resource hub for that presentation.

## Talk Resources

- [Interactive Transformer Visualization Demo](/transformer-viz) - See how AI actually processes information
- [Presentation Slides](/assets/pdf/Nerdicon%20-%20GameDev%20AI%20Primer.pdf) - PDF Archive ([Google Slides version](https://docs.google.com/presentation/d/1py5OaeMQ1CTOBtJJUp90x5flgmFufpsSBYelNcXud_8/edit?usp=sharing))
- [Lancer Analysis Chat History (Analysis)](https://chatgpt.com/share/6848a299-049c-8000-a851-fe576862cebe)
- [Lancer Analysis Chat History (Compression)](https://chatgpt.com/share/684725da-ff84-8000-bdbb-92a9a56fc458)

## Core Concept: Mundane Utility

The talk focused on AI's practical applications for indie game developers - the boring but essential tasks that AI handles well today. No promises of AGI or creative breakthroughs, just tools that save time on repetitive work.

## Practical AI Use Cases for Game Development

### Content Generation & Validation
- **Text Generation**: Lore variations, dialog snippets, tooltips, item descriptions
- **Localization**: Quick translation drafts for multiple languages
- **Style Validation**: Checking if content matches your game's tone and theme
- **Synthetic Focus Groups**: Testing content reception at scale

### Code & Technical Tasks
- **Code Completion**: GitHub Copilot for routine programming tasks
- **Documentation**: Automated API docs and code comments
- **Bug Discovery**: Generate 50 edge cases for feature testing
- **Pseudocode Generation**: Turn design specs into implementation outlines

### Production Efficiency
- **Asset Organization**: Batch renaming and labeling of game assets
- **Placeholder Assets**: Quick generation via Meshy AI (with manual fixes)
- **Animation Prototypes**: DeepMotion for rough animation passes

### Design & Analysis
- **Rubber Duck Debugging**: Explain your design problems to AI
- **Statistical Analysis**: Models excel at finding patterns in playtesting data
- **Balance Testing**: Simulate thousands of combat scenarios (see Lancer example)
- **Design Document Processing**: Transform natural language specs into state machines

### Marketing & Business
- **Store Page Copy**: Steam descriptions and feature lists
- **Devlog Writing**: Draft updates and patch notes
- **Social Media Content**: Platform-specific promotional text

## Key Takeaways

1. **AI is a prediction engine** - It excels when working close to its training data
2. **Context is everything** - The more specific context you provide, the better the output
3. **Manage it like a smart intern** - Clear instructions, review output, iterate with feedback
4. **Use the right tool**: 
  - Hard problems = Reasoning models (Claude Opus, GPT-o3, Gemini 2.5 Pro)
  - Simple tasks = Cheaper, faster models

## The Future is Already Here

- AI costs are dropping 10x every year
- Current capabilities are the worst they'll ever be
- New features coming: better agents, test-time compute, fine-tuning

The message: **Use the dang thing.** Pick a benchmark task you're good at, test AI against it, and integrate it where it helps.

## Sources & Further Reading

### Research Papers & Reports
- METR (2025, March 19). [Measuring AI Ability to Complete Long Tasks](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/). *"The length of tasks that generalist frontier model agents can complete autonomously with 50% reliability has been doubling approximately every 7 months for the last 6 years."*
- Kwa, T. et al. (2025). [Measuring AI Ability to Complete Long Tasks](https://arxiv.org/abs/2503.14499). arXiv preprint arXiv:2503.14499.
- Epoch AI (2025, March 12). [LLM inference prices have fallen rapidly but unequally across tasks](https://epoch.ai/data-insights/llm-inference-price-trends). *"Prices declining between 9x per year and 900x per year, with a median of 50x per year."*
- Cottier, B., Snodin, B., Owen, D., & Adamczewski, T. (2025). [Trends in AI Supercomputers](https://epoch.ai/blog/trends-in-ai-supercomputers). Epoch AI. *"AI supercomputers double in performance every 9 months."*
- Stanford HAI (2025). [The 2025 AI Index Report](https://hai.stanford.edu/ai-index/2025-ai-index-report). *"Inference cost for a system performing at the level of GPT-3.5 dropped over 280-fold between November 2022 and October 2024."*
- Andreessen Horowitz (2024). [Taming the Tail: Adventures in Improving AI Economics](https://a16z.com/taming-the-tail-adventures-in-improving-ai-economics/). *"For LLM of equivalent performance, the inference cost is decreasing by 10x every year."*

### Environmental Impact Studies
- Ren, S. et al. (2023). [Making AI Less "Thirsty": Uncovering and Addressing the Secret Water Footprint of AI Models](https://arxiv.org/pdf/2304.03271). UC Riverside. *Original research on AI water consumption.*
- Altman, Sam (2025, June 10). ["The Gentle Singularity"](https://blog.samaltman.com). OpenAI Blog. *"The average query uses about 0.34 watt-hours... It also uses about 0.000085 gallons of water; roughly one fifteenth of a teaspoon."*
- Bloomberg (2025, May 8). [The AI Boom Is Draining Water From the Areas That Need It Most](https://www.bloomberg.com/graphics/2025-ai-impacts-data-centers-water-data/). *"More than 160 new AI data centers have sprung up across the US in the past three years in places with high competition for scarce water resources."*

### Books
- Bostrom, Nick (2014). *Superintelligence: Paths, Dangers, Strategies*. Oxford University Press.
- Yudkowsky, Eliezer & Soares, Nate (2025). *If Anyone Builds It, Everyone Dies*. [Forthcoming]

### Online Resources & Blogs
- [AI-2027.com](https://ai-2027.com) - Predictions and analysis of near-term AI development
- [LessWrong](https://lesswrong.com) - Rationality and AI safety community
- [Don't Worry About the Vase](https://thezvi.substack.com) - Zvi Mowshowitz's blog on AI and rationality
- [Dwarkesh Patel Podcast](https://www.dwarkeshpatel.com/podcast) - In-depth interviews with AI researchers
- [One Useful Thing](https://www.oneusefulthing.org/) - Ethan Mollick's practical AI applications blog

### AI Tools for Game Development
- [Claude](https://claude.ai) (Anthropic) - Reasoning model for complex tasks ($20/month Pro)
- [ChatGPT](https://openai.com) - OpenAI's models including o3 reasoning ($20/month Plus)
- [Gemini 2.5 Pro](https://ai.google.dev) - Google's advanced model (Free tier available)
- [GitHub Copilot](https://github.com/features/copilot) - Code completion ($10/month, free tier with 2000 completions)
- [Meshy AI](https://meshy.ai) - 3D asset generation for games
- [DeepMotion](https://deepmotion.com) - AI-powered animation
- [Google AI Studio](https://aistudio.google.com) - Large-scale data analysis
- [DeepL API](https://www.deepl.com/pro-api) - Professional translation (~€1-2 per language for indie games)
- [Ludo.ai](https://ludo.ai) - Game design assistant and market research

### Industry Reports & Analysis
- McKinsey (2023). [Unleashing developer productivity with generative AI](https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/unleashing-developer-productivity-with-generative-ai). *"Developers complete coding tasks up to twice as fast with AI assistance."*
- Game Developer Conference (2024). [State of the Game Industry Report](https://gdconf.com/news/gdc-2024-state-game-industry-devs-discuss-layoffs-generative-ai-and-more). Survey of developer AI adoption.
- Creative Bloq (2024). [A year on, have indie game devs changed their views on AI?](https://www.creativebloq.com/3d/video-game-design/how-indie-game-dev-opinions-on-generative-ai-have-changed). Industry sentiment analysis.

### Technical Benchmarks
- [Epoch AI Data Hub](https://epoch.ai/data) - Comprehensive database of AI model capabilities and trends
- [Papers with Code](https://paperswithcode.com) - ML benchmarks and implementations
- [Artificial Analysis](https://artificialanalysis.ai) - Independent LLM performance benchmarking

### Critical Perspectives
- Aftermath (2024). ['An Overwhelmingly Negative And Demoralizing Force': What It's Like Working For A Company That's Forcing AI On Its Developers](https://aftermath.site/ai-video-game-development-art-vibe-coding-midjourney).
- ACM (2024). ["I'm a Solo Developer but AI is My New Ill-Informed Co-Worker": Envisioning and Designing Generative AI to Support Indie Game Development](https://dl.acm.org/doi/10.1145/3677082).

---

*For questions or discussions about AI in game development, reach out at: heinke.jonas@googlemail.com*

*Visit [playinsightstudios.com](https://playinsightstudios.com) for more resources.*