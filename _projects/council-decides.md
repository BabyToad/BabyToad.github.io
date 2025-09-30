---
layout: project
title: Council Decides
description: A Balatro-style card game where you play as an amateur super villain presenting schemes to the League of Ultimate Evil.
status: in-progress
version: 0.0.0
tags: [game-dev, typescript, card-game, balatro, web-game, game-jam]
thumbnail: /assets/images/projects/council_decides_thumb.png
show_thumbnail: false
demo_url: /assets/games/council-decides/
github_url: https://github.com/BabyToad/council_decides
show_repo: true
last_modified_at: 2024-12-22
---

# Council Decides

A Balatro-style card game where you play as an amateur super villain presenting schemes to the League of Ultimate Evil. This is a work in progress entry for the [Doppelter Questpresso Game Jam](https://itch.io/jam/doppelter-questpresso).

## Game Concept

You are an amateur super villain who must present schemes to the council (League of Ultimate Evil) by playing combinations of cards to achieve target scores each round. The game combines strategic card play with progressive difficulty as you work your way up the villain hierarchy.

## Card Types

- **Henchman** - Buff each other, work well with gear
- **Location** - Buff all cards of a specific type  
- **Crime** - Core scoring cards for your schemes
- **Gear** - Buff henchmen (e.g., Goon + Baseball Bat synergy)

## Gameplay

- Start with 7 cards in hand
- Play up to 3 cards per turn
- Achieve target score to win the round
- Cards synergize for bonus points
- Target scores increase each round
- Keep unplayed cards, discard played ones

## Technical Features

- Component-based architecture with TypeScript
- Responsive design for all screen sizes
- Card synergy system with visual feedback
- Progressive difficulty with increasing targets
- Modern UI with glassmorphism effects
- Mobile-optimized touch interface

## Tech Stack

- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **CSS Custom Properties** - Consistent theming
- **Component Architecture** - Modular, maintainable code
- **Responsive Grid/Flexbox** - Adaptive layouts
- **Vitest** - Testing framework

## Play the Game

Experience the game directly in your browser:

<div class="demo-container" style="margin: 2rem 0; text-align: center;">
    <iframe 
        src="/assets/games/council-decides/" 
        width="800" 
        height="600" 
        frameborder="0"
        style="border: 1px solid #ddd; border-radius: 8px; max-width: 100%;"
        title="Council Decides Game">
    </iframe>
    <p style="text-align: center; margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
        <a href="/assets/games/council-decides/" target="_blank">Open Game in New Tab</a>
    </p>
</div>

## Game Jam Entry

This project was created for the [Doppelter Questpresso Game Jam](https://itch.io/jam/doppelter-questpresso), a week-long game development event hosted by Questpresso and the University of Leipzig. The jam focuses on collaborative game development with workshops and a relaxed atmosphere for learning and creating games.

