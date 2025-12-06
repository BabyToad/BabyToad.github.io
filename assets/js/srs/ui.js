/**
 * UI module for SRS
 * Handles rendering cards, managing review state, and user interactions
 */

import { Rating, getSchedulingOptions, formatInterval, getTimeUntilNextDue } from './fsrs.js';

// DOM element references
let elements = {};

// Current state
let currentCard = null;
let currentScheduling = null;
let isAnswerShown = false;

/**
 * Initialize UI elements
 */
export function initUI() {
    elements = {
        container: document.querySelector('.srs-container'),
        dueCount: document.querySelector('.srs-due-count'),
        streak: document.querySelector('.srs-streak'),
        tagFilter: document.getElementById('srs-tag-filter'),
        cardArea: document.querySelector('.srs-card-area'),
        card: document.querySelector('.srs-card'),
        cardFront: document.querySelector('.srs-card-front'),
        cardBack: document.querySelector('.srs-card-back'),
        showAnswer: document.querySelector('.srs-show-answer'),
        ratingButtons: document.querySelector('.srs-rating-buttons'),
        btnAgain: document.querySelector('.srs-btn-again'),
        btnHard: document.querySelector('.srs-btn-hard'),
        btnGood: document.querySelector('.srs-btn-good'),
        btnEasy: document.querySelector('.srs-btn-easy'),
        empty: document.querySelector('.srs-empty'),
        nextDue: document.querySelector('.srs-next-due'),
        statsToggle: document.querySelector('.srs-stats-toggle'),
        statsPanel: document.querySelector('.srs-stats-panel'),
        resetBtn: document.querySelector('.srs-reset-progress')
    };

    // Setup stats panel toggle
    if (elements.statsToggle && elements.statsPanel) {
        elements.statsToggle.addEventListener('click', () => {
            elements.statsPanel.classList.toggle('visible');
        });
    }
}

/**
 * Populate the tag filter dropdown
 * @param {Array} tags - Array of tag strings
 */
export function populateTags(tags) {
    if (!elements.tagFilter) return;

    // Clear existing options except "All"
    elements.tagFilter.innerHTML = '<option value="all">All tags</option>';

    for (const tag of tags) {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        elements.tagFilter.appendChild(option);
    }
}

/**
 * Set the tag filter dropdown value programmatically
 * @param {string} tag - Tag to select
 */
export function setTagFilter(tag) {
    if (elements.tagFilter) {
        elements.tagFilter.value = tag;
    }
}

/**
 * Update the header with due count and streak
 * @param {number} dueCount - Number of cards due
 * @param {number} streak - Current streak
 */
export function updateHeader(dueCount, streak) {
    if (elements.dueCount) {
        elements.dueCount.textContent = `${dueCount} card${dueCount !== 1 ? 's' : ''} due`;
    }
    if (elements.streak) {
        if (streak > 0) {
            elements.streak.innerHTML = `<i class="fas fa-fire"></i> ${streak} day${streak !== 1 ? 's' : ''}`;
            elements.streak.style.display = '';
        } else {
            elements.streak.style.display = 'none';
        }
    }
}

/**
 * Show a card for review
 * @param {Object} cardData - The card content data
 * @param {Object} fsrsCard - The FSRS card state
 */
export function showCard(cardData, fsrsCard) {
    currentCard = { data: cardData, fsrs: fsrsCard };
    isAnswerShown = false;

    // Calculate scheduling options
    currentScheduling = getSchedulingOptions(fsrsCard);

    // Show card area, hide empty state
    if (elements.cardArea) elements.cardArea.style.display = '';
    if (elements.empty) elements.empty.style.display = 'none';

    // Render front
    if (elements.cardFront) {
        elements.cardFront.innerHTML = cardData.front;
    }

    // Render back (hidden initially)
    if (elements.cardBack) {
        elements.cardBack.innerHTML = cardData.back;
        elements.cardBack.style.display = 'none';
    }

    // Show "Show Answer" button, hide rating buttons
    if (elements.showAnswer) elements.showAnswer.style.display = '';
    if (elements.ratingButtons) elements.ratingButtons.style.display = 'none';

    // Reset card flip state
    if (elements.card) elements.card.classList.remove('flipped');

    // Update interval hints on buttons
    updateIntervalHints();
}

/**
 * Update the interval hints on rating buttons
 */
function updateIntervalHints() {
    if (!currentScheduling) return;

    const hints = {
        btnAgain: currentScheduling[Rating.Again]?.interval || '',
        btnHard: currentScheduling[Rating.Hard]?.interval || '',
        btnGood: currentScheduling[Rating.Good]?.interval || '',
        btnEasy: currentScheduling[Rating.Easy]?.interval || ''
    };

    for (const [key, interval] of Object.entries(hints)) {
        const btn = elements[key];
        if (btn) {
            const hint = btn.querySelector('.srs-interval-hint');
            if (hint) hint.textContent = interval;
        }
    }
}

/**
 * Reveal the answer
 */
export function revealAnswer() {
    isAnswerShown = true;

    // Show back
    if (elements.cardBack) elements.cardBack.style.display = '';

    // Flip card
    if (elements.card) elements.card.classList.add('flipped');

    // Hide "Show Answer", show rating buttons
    if (elements.showAnswer) elements.showAnswer.style.display = 'none';
    if (elements.ratingButtons) elements.ratingButtons.style.display = '';
}

/**
 * Get the new card state for a given rating
 * @param {number} rating - Rating (1-4)
 * @returns {Object} New FSRS card state
 */
export function getNewCardState(rating) {
    if (!currentScheduling || !currentScheduling[rating]) {
        throw new Error('No scheduling available');
    }
    return currentScheduling[rating].card;
}

/**
 * Check if a rating is "correct" (Good or Easy)
 * @param {number} rating - Rating (1-4)
 * @returns {boolean} True if correct
 */
export function isCorrectRating(rating) {
    return rating >= Rating.Good;
}

/**
 * Show the empty state (no cards due)
 * @param {Array} allCards - All cards for calculating next due
 */
export function showEmptyState(allCards) {
    currentCard = null;
    currentScheduling = null;

    // Hide card area, show empty state
    if (elements.cardArea) elements.cardArea.style.display = 'none';
    if (elements.ratingButtons) elements.ratingButtons.style.display = 'none';
    if (elements.empty) elements.empty.style.display = '';

    // Calculate time until next review
    if (elements.nextDue) {
        const timeUntil = getTimeUntilNextDue(allCards);
        if (timeUntil) {
            elements.nextDue.textContent = `Next review in ${timeUntil}`;
        } else {
            elements.nextDue.textContent = 'Add more cards to continue learning!';
        }
    }
}

/**
 * Set up event listeners
 * @param {Object} callbacks - Object with onShowAnswer, onRate, onFilterChange, onReset
 */
export function setupEventListeners(callbacks) {
    // Show answer button
    if (elements.showAnswer) {
        elements.showAnswer.addEventListener('click', () => {
            callbacks.onShowAnswer?.();
        });
    }

    // Rating buttons
    const ratingBtns = document.querySelectorAll('.srs-rating-buttons button[data-rating]');
    ratingBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const rating = parseInt(btn.dataset.rating, 10);
            callbacks.onRate?.(rating);
        });
    });

    // Tag filter
    if (elements.tagFilter) {
        elements.tagFilter.addEventListener('change', (e) => {
            callbacks.onFilterChange?.(e.target.value);
        });
    }

    // Reset button
    if (elements.resetBtn) {
        elements.resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                callbacks.onReset?.();
            }
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ignore if typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.code === 'Space' && !isAnswerShown && currentCard) {
            e.preventDefault();
            callbacks.onShowAnswer?.();
        } else if (isAnswerShown && currentCard) {
            const keyRatings = {
                'Digit1': Rating.Again,
                'Numpad1': Rating.Again,
                'Digit2': Rating.Hard,
                'Numpad2': Rating.Hard,
                'Digit3': Rating.Good,
                'Numpad3': Rating.Good,
                'Digit4': Rating.Easy,
                'Numpad4': Rating.Easy
            };

            if (keyRatings[e.code]) {
                e.preventDefault();
                callbacks.onRate?.(keyRatings[e.code]);
            }
        }
    });
}

/**
 * Show a loading state
 */
export function showLoading() {
    if (elements.cardFront) {
        elements.cardFront.innerHTML = '<span class="srs-loading">Loading...</span>';
    }
}

/**
 * Show an error state with optional retry
 * @param {string} message - Error message
 * @param {Function} retryCallback - Optional callback for retry button
 */
export function showError(message, retryCallback = null) {
    if (elements.cardFront) {
        let html = `<span class="srs-error">${message}</span>`;
        if (retryCallback) {
            html += `<br><button class="srs-retry-btn">Try Again</button>`;
        }
        elements.cardFront.innerHTML = html;

        if (retryCallback) {
            elements.cardFront.querySelector('.srs-retry-btn')
                ?.addEventListener('click', retryCallback);
        }
    }
    // Hide show answer button on error
    if (elements.showAnswer) elements.showAnswer.style.display = 'none';
}
