---
layout: base
title: Learn
description: Spaced repetition review system for long-term retention
use_container: false
srs: true
math: true
---

<div class="srs-container">
  <!-- Header -->
  <div class="srs-header">
    <h1>Daily Review</h1>
    <div class="srs-progress">
      <span class="srs-due-count">Loading...</span>
      <span class="srs-streak"></span>
    </div>
  </div>

  <!-- Filters -->
  <div class="srs-filters">
    <label for="srs-tag-filter">Filter by tag:</label>
    <select id="srs-tag-filter">
      <option value="all">All tags</option>
    </select>
  </div>

  <!-- Card Area -->
  <div class="srs-card-area">
    <div class="srs-card">
      <div class="srs-card-front"></div>
      <div class="srs-card-back"></div>
    </div>
    <button class="srs-show-answer">Show Answer</button>
  </div>

  <!-- Rating Buttons -->
  <div class="srs-rating-buttons">
    <button data-rating="1" class="srs-btn-again">
      <span class="srs-btn-label">Again</span>
      <span class="srs-interval-hint"></span>
    </button>
    <button data-rating="2" class="srs-btn-hard">
      <span class="srs-btn-label">Hard</span>
      <span class="srs-interval-hint"></span>
    </button>
    <button data-rating="3" class="srs-btn-good">
      <span class="srs-btn-label">Good</span>
      <span class="srs-interval-hint"></span>
    </button>
    <button data-rating="4" class="srs-btn-easy">
      <span class="srs-btn-label">Easy</span>
      <span class="srs-interval-hint"></span>
    </button>
  </div>

  <!-- Empty State -->
  <div class="srs-empty">
    <div class="srs-empty-icon"><span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span></div>
    <p class="srs-empty-title">All done for now</p>
    <p class="srs-next-due"></p>
  </div>

  <!-- Stats Panel -->
  <div class="srs-stats">
    <button class="srs-stats-toggle">
      <span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg></span> Stats
    </button>
    <div class="srs-stats-panel">
      <div class="srs-stats-grid">
        <div class="srs-stat">
          <span class="srs-stat-value" id="stat-streak">0</span>
          <span class="srs-stat-label">Day Streak</span>
        </div>
        <div class="srs-stat">
          <span class="srs-stat-value" id="stat-today">0</span>
          <span class="srs-stat-label">Reviewed Today</span>
        </div>
        <div class="srs-stat">
          <span class="srs-stat-value" id="stat-total">0</span>
          <span class="srs-stat-label">Total Cards</span>
        </div>
        <div class="srs-stat">
          <span class="srs-stat-value" id="stat-retention">-</span>
          <span class="srs-stat-label">Retention Rate</span>
        </div>
      </div>
      <div class="srs-stats-actions">
        <button class="srs-reset-progress" title="Reset all progress (cannot be undone)">
          <span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></span> Reset Progress
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Keyboard shortcuts hint -->
<div class="srs-keyboard-hint">
  <span>Keyboard: <kbd>Space</kbd> show answer, <kbd>1-4</kbd> rate</span>
</div>

<!-- Inject card data from Jekyll -->
<script>
  window.FLASHCARD_DATA = {{ site.data.flashcards | jsonify }};
</script>
