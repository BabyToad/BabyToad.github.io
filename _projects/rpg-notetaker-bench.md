---
layout: project
classes: wide-content rpg-bench-page
title: "RPG Notetaker Bench"
description: "Comparing AI models' ability to process and organize RPG session transcripts"
date: 2025-01-11
tags: [AI, RPG, Benchmarking, D&D]
permalink: /projects/rpg-notetaker-bench/
---

# RPG Notetaker Bench

A comprehensive comparison of how different AI models process and organize tabletop RPG session transcripts. This benchmark analyzes a 2.5-hour D&D session transcript processed by six different AI models, comparing their approaches to note-taking, organization, and information extraction.

## The Session: "Dicing With Death #225"

**Session Details:**
- **Date:** June 26, 2025
- **Duration:** 2h 37m
- **Participants:** Neal (GM), Ryan (Phoenix the Warlock)
- **System:** D&D
- **Campaign:** Dragon politics and intrigue in Arcadia

## AI Model Comparison

Each model was tasked with converting the raw transcript into organized session notes. Click through the different versions to see how each AI approached the task:

<div class="rpg-bench-navigator">
  <div class="model-tabs">
    <button class="tab-button active" onclick="showModel('original')">Original Transcript</button>
    <button class="tab-button" onclick="showModel('gpt41')">GPT-4.1</button>
    <button class="tab-button" onclick="showModel('gpt4o')">GPT-4o</button>
    <button class="tab-button" onclick="showModel('gpt4o-mini')">GPT-4o Mini</button>
    <button class="tab-button" onclick="showModel('o1-mini')">O1-Mini</button>
    <button class="tab-button" onclick="showModel('o3-mini')">O3-Mini</button>
    <button class="tab-button" onclick="showModel('o4-mini')">O4-Mini</button>
  </div>
  
  <div class="model-info">
    <div id="info-original" class="model-details active">
      <h3>Original Transcript</h3>
      <p><strong>Size:</strong> 116KB, 5,522 lines</p>
      <p><strong>Format:</strong> Raw audio transcript with timestamps</p>
      <p>The unprocessed transcript directly from the recording, including all the natural speech patterns, interruptions, and cross-talk that occur during live play.</p>
    </div>
    
    <div id="info-gpt41" class="model-details">
      <h3>GPT-4.1 Processing</h3>
      <p><strong>Size:</strong> 10KB, 205 lines</p>
      <p><strong>Approach:</strong> Comprehensive scene-by-scene breakdown with detailed NPC ledgers</p>
      <p>Creates highly structured notes with scene summaries, character tracking, and forward-looking session preparation notes.</p>
    </div>
    
    <div id="info-gpt4o" class="model-details">
      <h3>GPT-4o Processing</h3>
      <p><strong>Size:</strong> 3.1KB, 72 lines</p>
      <p><strong>Approach:</strong> Concise summary format</p>
      <p>Focuses on the essential plot points and key moments, creating a streamlined overview of the session.</p>
    </div>
    
    <div id="info-gpt4o-mini" class="model-details">
      <h3>GPT-4o Mini Processing</h3>
      <p><strong>Size:</strong> 4.2KB, 88 lines</p>
      <p><strong>Approach:</strong> Balanced summary with key highlights</p>
      <p>Provides a middle-ground approach between comprehensive detail and concise summarization.</p>
    </div>
    
    <div id="info-o1-mini" class="model-details">
      <h3>O1-Mini Processing</h3>
      <p><strong>Size:</strong> 7.5KB, 203 lines</p>
      <p><strong>Approach:</strong> Analytical breakdown with strategic insights</p>
      <p>Emphasizes the tactical and strategic elements of the session, with detailed combat analysis.</p>
    </div>
    
    <div id="info-o3-mini" class="model-details">
      <h3>O3-Mini Processing</h3>
      <p><strong>Size:</strong> 12KB, 147 lines</p>
      <p><strong>Approach:</strong> Formatted sections with processing metadata</p>
      <p>Creates visually distinct sections with clear headers and includes processing statistics.</p>
    </div>
    
    <div id="info-o4-mini" class="model-details">
      <h3>O4-Mini Processing</h3>
      <p><strong>Size:</strong> 6.4KB, 124 lines</p>
      <p><strong>Approach:</strong> Narrative-focused organization</p>
      <p>Emphasizes story flow and character development over mechanical details.</p>
    </div>
  </div>
</div>

<div class="rpg-content-viewer">
  <iframe id="content-frame" src="/assets/rpg_notetaker_bench/display.html?file=original" width="100%" frameborder="0"></iframe>
</div>


<script>
function showModel(modelId) {
  // Update tabs
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`button[onclick="showModel('${modelId}')"]`).classList.add('active');
  
  // Update info panels
  document.querySelectorAll('.model-details').forEach(panel => panel.classList.remove('active'));
  document.getElementById(`info-${modelId}`).classList.add('active');
  
  // Update iframe
  const fileMap = {
    'original': 'original',
    'gpt41': 'gpt_4.1',
    'gpt4o': 'gpt_4o', 
    'gpt4o-mini': 'gpt_4o_mini',
    'o1-mini': 'o1_mini',
    'o3-mini': 'o3_mini',
    'o4-mini': 'o4_mini'
  };
  
  document.getElementById('content-frame').src = `/assets/rpg_notetaker_bench/display.html?file=${fileMap[modelId]}`;
}
</script>

<style>
.rpg-bench-navigator {
  margin: 2rem 0;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.model-tabs {
  display: flex;
  flex-wrap: wrap;
  background: var(--surface-color);
  border-bottom: 1px solid var(--border-color);
}

.tab-button {
  flex: 1;
  min-width: 120px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  border-right: 1px solid var(--border-color);
}

.tab-button:last-child {
  border-right: none;
}

.tab-button:hover {
  background: var(--hover-color);
}

.tab-button.active {
  background: var(--primary-color);
  color: white;
}

.model-info {
  position: relative;
  min-height: 120px;
  padding: 1rem;
}

.model-details {
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  pointer-events: none;
}

.model-details.active {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.model-details h3 {
  margin: 0 0 0.5rem 0;
  color: var(--primary-color);
}

.model-details p {
  margin: 0.25rem 0;
}

.rpg-content-viewer {
  margin: 2rem 0;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.rpg-content-viewer iframe {
  display: block;
  width: 100%;
  min-height: 600px;
}

@media (max-width: 768px) {
  .model-tabs {
    flex-direction: column;
  }
  
  .tab-button {
    flex: none;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }
  
  .tab-button:last-child {
    border-bottom: none;
  }
}
</style> 