---
layout: project
title: Isometric Game Engine
description: A TypeScript-based isometric game engine with centralized configuration management and comprehensive development tools.
status: in-progress
version: 0.5.1
confidence: medium
tags:
  - TypeScript
  - Game Engine
  - WordPress
  - Interactive
  - Development Tools
last_modified_at: 2024-12-22
thumbnail: /assets/images/projects/iso_engine_thumb.png
demo_url: /assets/iso-engine/
github_url: https://github.com/babytoad/isometric-game-engine
show_repo: true
---

# Isometric Game Engine

A professional TypeScript-based isometric game engine designed for WordPress integration, featuring centralized configuration management and comprehensive development tools.

See it in Action here: [lust-auf-zahnarzt.de/ecke-tour/](https://lust-auf-zahnarzt.de/ecke-tour/) or check out the [Demo](/assets/iso-engine/).

## About the Project

The Isometric Game Engine is a complete rendering system built with modern web technologies. It provides a robust foundation for creating interactive isometric experiences with proper depth sorting, resource management, and scene transitions.

### Key Features

- **Centralized Configuration System** - Single sources of truth for all settings via `MasterGameConfig` and `SceneRegistry`
- **TypeScript Architecture** - Full type safety and modern development experience
- **Professional Development Tools** - Scene switcher, dev watermark, and debug utilities
- **Comprehensive Audio System** - Background music and interactive sound effects (SFX)
- **WordPress Integration** - Seamless plugin integration with asset path resolution
- **Event-Driven Scripting** - 12+ action types for interactive elements
- **Advanced Resource Management** - Image preloading, caching, and fallback support

## Live Demo

Experience the engine in action with my interactive workspace:

<div class="demo-container" style="margin: 2rem 0; text-align: center;">
    <iframe 
        src="/assets/iso-engine/" 
        width="700" 
        height="700" 
        frameborder="0"
        style="border: 1px solid #ddd; border-radius: 8px; max-width: 100%;"
        title="Isometric Game Engine Demo">
    </iframe>
    <p style="text-align: center; margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
        <a href="/assets/iso-engine/" target="_blank">Open Demo in New Tab</a> • Press Ctrl+Shift+S for scene switcher
    </p>
</div>

## Technical Highlights

### Architecture

- **Single Source of Truth Configuration** - All settings managed centrally in `MasterGameConfig.ts` and `SceneRegistry.ts`
- **Environment-Specific Builds** - Standalone, WordPress, and development configurations
- **Zero Production Impact** - Development tools completely excluded from production builds
- **Build-Time Scene Management** - Enable/disable scenes for specific builds

### Dev Tools

- **Scene Switcher** - Press `Ctrl+Shift+S` to switch between scenes
- **Dev Watermark** - Visual indicator showing development mode
- **Enhanced Console Logging** - Detailed debugging output
- **Scene Validation** - Automatic integrity checking

### WordPress Integration

Seamless integration with WordPress through:

- Plugin architecture with proper asset path resolution
- Configuration via `window.ISO_Game_Config`
- Media library integration for assets
- Responsive design for different screen sizes

## Usage Examples

### Basic Implementation

```typescript
import { Game } from './src/core/Game';
import { MasterGameConfig } from './src/config/MasterGameConfig';

// Use pre-configured settings (recommended)
const config = MasterGameConfig.getStandaloneConfig({
  debug: true
});

const container = document.getElementById('game-container');
const game = new Game(config, container);

await game.initialize();
game.start();
```

### Scene Configuration

```json
{
  "name": "workspace_scene",
  "width": 800,
  "height": 600,
  "tileSize": 32,
  "background": "workspace_bg.png",
  "music": "ambient_workspace.mp3",
  "elements": [
    {
      "id": "interactive-desk",
      "type": "object",
      "x": 10,
      "y": 5,
      "interactable": true,
      "properties": {
        "sprite": "desk.png",
        "dialog": "A cluttered workspace desk"
      },
      "sfx": {
        "click": "desk_interaction.wav"
      }
    }
  ]
}
```

## Current Status

- ✅ Complete TypeScript implementation
- ✅ WordPress plugin integration
- ✅ Comprehensive audio system
- ✅ Development tools and debugging
- ✅ Scene management and transitions
- ✅ Resource management and caching
- ✅ Event-driven scripting system

### Future Enhancements

- Enhanced mobile touch controls
- Additional scene transition effects
- Extended scripting action library
- Performance optimizations for large scenes

## Repository

The complete source code, documentation, and examples are available on GitHub:

[View on GitHub](https://github.com/babytoad/isometric-game-engine)
