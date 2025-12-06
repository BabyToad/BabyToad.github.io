/**
 * Storage module for SRS progress and statistics
 * Uses localStorage for persistence
 */

const STORAGE_KEYS = {
    PROGRESS: 'srs-progress',
    STATS: 'srs-stats',
    SETTINGS: 'srs-settings'
};

/**
 * Get all card progress from localStorage
 * @returns {Object} Map of cardId -> progress state
 */
export function getProgress() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
        return data ? JSON.parse(data) : {};
    } catch (e) {
        console.error('Failed to load SRS progress:', e);
        return {};
    }
}

/**
 * Save progress for a single card
 * @param {string} cardId - The card identifier
 * @param {Object} state - The FSRS card state to save
 */
export function saveCardProgress(cardId, state) {
    const progress = getProgress();
    progress[cardId] = {
        due: state.due.toISOString(),
        stability: state.stability,
        difficulty: state.difficulty,
        reps: state.reps,
        lapses: state.lapses,
        state: state.state,
        lastReview: new Date().toISOString(),
        scheduledDays: state.scheduled_days
    };

    try {
        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    } catch (e) {
        console.error('Failed to save SRS progress:', e);
    }
}

/**
 * Get progress for a specific card
 * @param {string} cardId - The card identifier
 * @returns {Object|null} The card's progress state or null if new
 */
export function getCardProgress(cardId) {
    const progress = getProgress();
    return progress[cardId] || null;
}

/**
 * Get statistics from localStorage
 * @returns {Object} Statistics object
 */
export function getStats() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.STATS);
        return data ? JSON.parse(data) : getDefaultStats();
    } catch (e) {
        console.error('Failed to load SRS stats:', e);
        return getDefaultStats();
    }
}

/**
 * Get default stats object
 * @returns {Object} Default statistics
 */
function getDefaultStats() {
    return {
        currentStreak: 0,
        longestStreak: 0,
        lastReviewDate: null,
        totalReviews: 0,
        correctReviews: 0,
        reviewsByDate: {}
    };
}

/**
 * Save statistics to localStorage
 * @param {Object} stats - Statistics object
 */
export function saveStats(stats) {
    try {
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
        console.error('Failed to save SRS stats:', e);
    }
}

/**
 * Record a review in statistics
 * @param {boolean} correct - Whether the review was correct (Good or Easy)
 */
export function recordReview(correct) {
    const stats = getStats();
    const today = new Date().toDateString();

    // Update totals
    stats.totalReviews++;
    if (correct) {
        stats.correctReviews++;
    }

    // Update daily count
    if (!stats.reviewsByDate[today]) {
        stats.reviewsByDate[today] = 0;
    }
    stats.reviewsByDate[today]++;

    // Update streak
    updateStreak(stats, today);

    // Prune old daily data (keep last 90 days)
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);
    for (const date of Object.keys(stats.reviewsByDate)) {
        if (new Date(date) < cutoff) {
            delete stats.reviewsByDate[date];
        }
    }

    saveStats(stats);
    return stats;
}

/**
 * Update streak based on review date
 * @param {Object} stats - Statistics object (mutated)
 * @param {string} today - Today's date string
 */
function updateStreak(stats, today) {
    const lastReview = stats.lastReviewDate;

    if (!lastReview) {
        // First ever review
        stats.currentStreak = 1;
    } else if (lastReview === today) {
        // Already reviewed today, no change to streak
    } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (lastReview === yesterdayStr) {
            // Reviewed yesterday, continue streak
            stats.currentStreak++;
        } else {
            // Missed more than one day, reset streak
            stats.currentStreak = 1;
        }
    }

    stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak);
    stats.lastReviewDate = today;
}

/**
 * Get number of reviews today
 * @returns {number} Reviews completed today
 */
export function getReviewsToday() {
    const stats = getStats();
    const today = new Date().toDateString();
    return stats.reviewsByDate[today] || 0;
}

/**
 * Clear all progress (for reset functionality)
 */
export function clearAllProgress() {
    try {
        localStorage.removeItem(STORAGE_KEYS.PROGRESS);
        localStorage.removeItem(STORAGE_KEYS.STATS);
        localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    } catch (e) {
        console.error('Failed to clear SRS data:', e);
    }
}

/**
 * Get user settings from localStorage
 * @returns {Object} Settings object with defaults
 */
export function getSettings() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return data ? JSON.parse(data) : { tagFilter: 'all' };
    } catch (e) {
        return { tagFilter: 'all' };
    }
}

/**
 * Save user settings to localStorage
 * @param {Object} settings - Settings object
 */
export function saveSettings(settings) {
    try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
        console.error('Failed to save SRS settings:', e);
    }
}

/**
 * Export all data for backup
 * @returns {Object} All SRS data
 */
export function exportData() {
    return {
        progress: getProgress(),
        stats: getStats(),
        exportedAt: new Date().toISOString()
    };
}

/**
 * Import data from backup
 * @param {Object} data - Exported data object
 */
export function importData(data) {
    if (data.progress) {
        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(data.progress));
    }
    if (data.stats) {
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(data.stats));
    }
}
