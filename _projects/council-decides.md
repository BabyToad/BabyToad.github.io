---
layout: project
title: Evil (The) Gathering
description: A deck builder with roguelike and pack opening elements where you plot evil schemes for the Council members.
status: completed
version: 1.0.0
tags: [game-dev, typescript, deck-builder, roguelike, web-game, game-jam]
thumbnail: /assets/images/projects/council_decides_thumb.png
show_thumbnail: false
demo_url: /assets/games/council-decides/
github_url: https://github.com/BabyToad/council_decides
show_repo: true
last_modified_at: 2025-10-05
---

# Evil (The) Gathering

A deck builder with roguelike and pack opening elements. As an intern in the DespicableWe Inc., you are tasked with plotting evil schemes for the Council members. For this, you'll have a wide range of card types at your disposal. Each card has an Evil Value (called "EP" for "Evil Points") as well as a unique card effect. In order to assemble the ultimate plan, you'll have to combine your cards in clever ways to activate combos that can give EXORBITANT amounts of points. But beware: every 5 turns a quota has to be met in order to progress. If you fail, you're out. But if you surpass your given quota, a nice bonus waits for you, which you can spend for card packs, containing more – maybe even Legendary – new cards for your deck.

Can you master the art of evilness and become the ultimate criminal?

## Play the Game

Experience the game directly in your browser:

<div class="demo-container" style="margin: 2rem 0; text-align: center;">
    <iframe 
        src="/assets/games/council-decides/" 
        width="800" 
        height="600" 
        frameborder="0"
        style="border: 1px solid #ddd; border-radius: 8px; max-width: 100%;"
        title="Evil (The) Gathering Game">
    </iframe>
    <p style="text-align: center; margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
        <a href="/assets/games/council-decides/" target="_blank">Open Game in New Tab</a>
    </p>
</div>

## Game Features

- **Deck Building** - Collect and manage cards with unique effects
- **Roguelike Elements** - Progressive difficulty with strategic decision-making
- **Pack Opening** - Unlock new cards through pack purchases
- **Combo System** - Chain card effects for massive point multipliers
- **Quota System** - Meet targets every 5 turns or face elimination
- **Legendary Cards** - Rare and powerful cards to discover

## Technical Features

- Component-based architecture with TypeScript
- Responsive design for all screen sizes
- Advanced card synergy system with visual feedback
- Pack opening animations and cutscenes
- Modern UI with comic book aesthetic
- Mobile-optimized touch interface

## Tech Stack

- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **CSS Custom Properties** - Consistent theming
- **Component Architecture** - Modular, maintainable code
- **Responsive Grid/Flexbox** - Adaptive layouts
- **Vitest** - Testing framework



## Game Jam Entry

This project was created during the "Doppelter Questpresso" Game Jam by the InfoFSR Leipzig under the topic "The Council decides". The jam focuses on collaborative game development with workshops and a relaxed atmosphere for learning and creating games.

## Credits

**Development Team:**
- **Jonas Heinke** – Programming and Systems-Design
- **Leon Noel Micheel** – Writing, Card- and Systems-Design

**Additional Credits:**
- **Emilia Weigelt** – Character-Design and Art
- **Marjan Blan** (unsplash.com) – Crumpled paper graphic for the Itch.io page

## Development Tools

The game includes several powerful development and analysis tools:

### Card Synergy Visualizer
An interactive node graph that visualizes the complex relationships between cards. Built with D3.js, it shows:
- **Interactive Network Graph** - Visual representation of card synergies and effects
- **Filtering System** - Filter by color, type, and tags to explore specific card relationships
- **Card Details** - Click any card to see detailed information and its connections
- **Real-time Analysis** - Shows how many cards each card buffs and receives buffs from

### Developer Tools Panel
Built-in debugging tools accessible in-game (press backtick ` to toggle):
- **Currency Manipulation** - Add/remove currency for testing
- **Deck Management** - Add/remove cards, modify deck composition
- **Game State Control** - Skip turns, modify quotas, trigger events
- **Card Database Browser** - Browse all cards with search and filtering

### Static Card Testing
- **Card Data Export** - Automated script to export card database for analysis
- **Synergy Analysis** - Comprehensive testing of card interactions and effects
- **Balance Testing** - Tools to verify card power levels and game balance

#### Interactive Tools
- **[Card Synergy Visualizer](/assets/games/council-decides/card-synergy-visualizer.html)** - Interactive D3.js node graph showing card relationships and synergies
- **[Card Synergy Report](/assets/games/council-decides/card-synergy-report.html)** - Comprehensive analysis of card balance, connectivity, and design recommendations

## Special Features

- **Softy Mode**: If you aren't evil enough, you can enter softy mode by hitting `SHIFT+CTRL+D`
- **Comic Book Aesthetic**: Inspired by Silver Age comic book styling

