/**
 * SRS Main Entry Point
 * Initializes all modules and coordinates the review flow
 */

import { loadCards, getAllTags, filterByTag } from './cards.js';
import { saveCardProgress, recordReview, clearAllProgress, getCardProgress, getSettings, saveSettings } from './storage.js';
import { initFSRS, createEmptyCard, reconstructCard, isDue, sortByPriority, Rating } from './fsrs.js';
import { initUI, populateTags, setTagFilter, updateHeader, showCard, revealAnswer, getNewCardState, isCorrectRating, showEmptyState, setupEventListeners, showLoading, showError } from './ui.js';
import { getSummary, updateStatsPanel, getCurrentStreak } from './stats.js';

// Application state
let allCards = [];          // All cards from JSON (expanded)
let filteredCards = [];     // Cards after tag filter
let dueCards = [];          // Cards that are currently due
let currentIndex = 0;       // Current position in dueCards
let sessionReviews = 0;     // Reviews this session
let currentTag = 'all';     // Current tag filter

// Configuration
const MAX_CARDS_PER_SESSION = 20;
const MAX_NEW_CARDS_PER_DAY = 10;

/**
 * Main initialization
 */
async function init() {
    // Initialize UI first
    initUI();
    showLoading();

    // Load FSRS algorithm
    const fsrsLoaded = await initFSRS();
    if (!fsrsLoaded) {
        showError('Failed to load spaced repetition algorithm. Check your connection.', init);
        return;
    }

    // Load cards from Jekyll data
    allCards = loadCards();

    if (allCards.length === 0) {
        showError('No flashcards found. Add cards to _data/flashcards.json');
        return;
    }

    // Load saved tag filter
    const settings = getSettings();
    currentTag = settings.tagFilter;

    // Populate tag filter and restore selection
    const tags = getAllTags(allCards);
    populateTags(tags);
    setTagFilter(currentTag);

    // Setup event handlers
    setupEventListeners({
        onShowAnswer: handleShowAnswer,
        onRate: handleRate,
        onFilterChange: handleFilterChange,
        onReset: handleReset
    });

    // Start review session
    startSession();
}

/**
 * Start or restart a review session
 */
function startSession() {
    currentIndex = 0;
    sessionReviews = 0;

    // Apply tag filter
    filteredCards = filterByTag(allCards, currentTag);

    // Build list of cards with their FSRS state
    const now = new Date();

    const cardsWithState = filteredCards.map(card => {
        const stored = getCardProgress(card.id);
        const fsrsCard = reconstructCard(stored);
        return { cardData: card, fsrsCard, isNew: !stored };
    });

    // Separate due cards and new cards
    const dueNow = cardsWithState.filter(c => !c.isNew && isDue(c.fsrsCard, now));
    const newCards = cardsWithState.filter(c => c.isNew);

    // Sort due cards by priority (most overdue first)
    sortByPriority(dueNow, now);

    // Limit new cards per day
    const newCardsToShow = newCards.slice(0, MAX_NEW_CARDS_PER_DAY);

    // Combine: due cards first, then new cards
    dueCards = [...dueNow, ...newCardsToShow];

    // Cap total cards per session
    if (dueCards.length > MAX_CARDS_PER_SESSION) {
        dueCards = dueCards.slice(0, MAX_CARDS_PER_SESSION);
    }

    // Update UI
    updateDisplay();

    // Show first card or empty state
    if (dueCards.length > 0) {
        showNextCard();
    } else {
        showEmptyState(cardsWithState);
    }
}

/**
 * Show the next card in the queue
 */
function showNextCard() {
    if (currentIndex >= dueCards.length) {
        // Session complete
        const cardsWithState = filteredCards.map(card => {
            const stored = getCardProgress(card.id);
            const fsrsCard = reconstructCard(stored);
            return { cardData: card, fsrsCard };
        });
        showEmptyState(cardsWithState);
        return;
    }

    const current = dueCards[currentIndex];
    showCard(current.cardData, current.fsrsCard);
}

/**
 * Update the header and stats display
 */
function updateDisplay() {
    const remaining = dueCards.length - currentIndex;
    const streak = getCurrentStreak();

    updateHeader(remaining, streak);

    // Update stats panel
    const cardsWithState = filteredCards.map(card => {
        const stored = getCardProgress(card.id);
        const fsrsCard = reconstructCard(stored);
        return { cardData: card, fsrsCard };
    });
    const summary = getSummary(allCards, dueCards.slice(currentIndex));
    updateStatsPanel(summary);
}

/**
 * Handle "Show Answer" button click
 */
function handleShowAnswer() {
    revealAnswer();
}

/**
 * Handle rating button click
 * @param {number} rating - Rating (1-4)
 */
function handleRate(rating) {
    const current = dueCards[currentIndex];
    if (!current) return;

    // Get new card state from FSRS
    const newState = getNewCardState(rating);

    // Save progress
    saveCardProgress(current.cardData.id, newState);

    // Record in statistics
    const correct = isCorrectRating(rating);
    recordReview(correct);

    // Update the card in our list (for correct sorting if we revisit)
    current.fsrsCard = newState;

    // Move to next card
    sessionReviews++;
    currentIndex++;

    // Update display and show next
    updateDisplay();
    showNextCard();
}

/**
 * Handle tag filter change
 * @param {string} tag - Selected tag
 */
function handleFilterChange(tag) {
    currentTag = tag;
    saveSettings({ tagFilter: tag });
    startSession();
}

/**
 * Handle reset progress
 */
function handleReset() {
    clearAllProgress();
    startSession();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
