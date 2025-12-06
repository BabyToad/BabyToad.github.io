---
layout: base
title: Learn
description: Spaced repetition review system for long-term retention
use_container: false
srs: true
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
    <div class="srs-empty-icon"><i class="fas fa-check-circle"></i></div>
    <p class="srs-empty-title">All done for now</p>
    <p class="srs-next-due"></p>
  </div>

  <!-- Stats Panel -->
  <div class="srs-stats">
    <button class="srs-stats-toggle">
      <i class="fas fa-chart-bar"></i> Stats
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
          <i class="fas fa-trash"></i> Reset Progress
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
