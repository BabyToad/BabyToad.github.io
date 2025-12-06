/**
 * FSRS Algorithm Wrapper
 * Wraps the ts-fsrs library for spaced repetition scheduling
 */

// These will be set after dynamic import
let fsrsModule = null;
let scheduler = null;

// FSRS Rating enum values
export const Rating = {
    Again: 1,
    Hard: 2,
    Good: 3,
    Easy: 4
};

// FSRS State enum values
export const State = {
    New: 0,
    Learning: 1,
    Review: 2,
    Relearning: 3
};

/**
 * Initialize the FSRS module by loading from CDN
 * @returns {Promise<boolean>} True if loaded successfully
 */
export async function initFSRS() {
    try {
        fsrsModule = await import('https://cdn.jsdelivr.net/npm/ts-fsrs@4/+esm');

        // Create scheduler with our configuration
        scheduler = fsrsModule.fsrs({
            request_retention: 0.9,     // 90% target retention
            maximum_interval: 365,       // Max 1 year between reviews
            enable_fuzz: true,           // Add randomness to prevent clustering
            enable_short_term: true      // Enable short-term scheduling for learning cards
        });

        console.log('FSRS initialized successfully');
        return true;
    } catch (e) {
        console.error('Failed to load FSRS:', e);
        return false;
    }
}

/**
 * Create a new empty card for FSRS
 * @param {Date} now - Current time
 * @returns {Object} Empty FSRS card
 */
export function createEmptyCard(now = new Date()) {
    if (!fsrsModule) {
        throw new Error('FSRS not initialized');
    }
    return fsrsModule.createEmptyCard(now);
}

/**
 * Reconstruct a card from stored progress
 * @param {Object} stored - Stored progress data
 * @returns {Object} FSRS card object
 */
export function reconstructCard(stored) {
    if (!stored) {
        return createEmptyCard();
    }

    return {
        due: new Date(stored.due),
        stability: stored.stability,
        difficulty: stored.difficulty,
        elapsed_days: 0, // Will be calculated
        scheduled_days: stored.scheduledDays || 0,
        reps: stored.reps,
        lapses: stored.lapses,
        state: stored.state,
        last_review: stored.lastReview ? new Date(stored.lastReview) : undefined
    };
}

/**
 * Get scheduling options for a card
 * Returns the next intervals for each rating option
 * @param {Object} card - FSRS card object
 * @param {Date} now - Current time
 * @returns {Object} Scheduling options for each rating
 */
export function getSchedulingOptions(card, now = new Date()) {
    if (!scheduler) {
        throw new Error('FSRS not initialized');
    }

    const scheduling = scheduler.repeat(card, now);

    return {
        [Rating.Again]: {
            card: scheduling[fsrsModule.Rating.Again].card,
            log: scheduling[fsrsModule.Rating.Again].log,
            interval: formatInterval(scheduling[fsrsModule.Rating.Again].card.scheduled_days)
        },
        [Rating.Hard]: {
            card: scheduling[fsrsModule.Rating.Hard].card,
            log: scheduling[fsrsModule.Rating.Hard].log,
            interval: formatInterval(scheduling[fsrsModule.Rating.Hard].card.scheduled_days)
        },
        [Rating.Good]: {
            card: scheduling[fsrsModule.Rating.Good].card,
            log: scheduling[fsrsModule.Rating.Good].log,
            interval: formatInterval(scheduling[fsrsModule.Rating.Good].card.scheduled_days)
        },
        [Rating.Easy]: {
            card: scheduling[fsrsModule.Rating.Easy].card,
            log: scheduling[fsrsModule.Rating.Easy].log,
            interval: formatInterval(scheduling[fsrsModule.Rating.Easy].card.scheduled_days)
        }
    };
}

/**
 * Schedule a card after a review
 * @param {Object} card - FSRS card object
 * @param {number} rating - Rating (1-4)
 * @param {Date} now - Current time
 * @returns {Object} New card state and log
 */
export function scheduleCard(card, rating, now = new Date()) {
    if (!scheduler) {
        throw new Error('FSRS not initialized');
    }

    const scheduling = scheduler.repeat(card, now);
    const fsrsRating = fsrsModule.Rating[Object.keys(Rating).find(k => Rating[k] === rating)];

    return scheduling[fsrsRating];
}

/**
 * Check if a card is due for review
 * @param {Object} card - FSRS card object
 * @param {Date} now - Current time
 * @returns {boolean} True if card is due
 */
export function isDue(card, now = new Date()) {
    return card.due <= now;
}

/**
 * Calculate overdue days for a card
 * @param {Object} card - FSRS card object
 * @param {Date} now - Current time
 * @returns {number} Days overdue (negative if not yet due)
 */
export function getOverdueDays(card, now = new Date()) {
    const diff = now - card.due;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Sort cards by review priority
 * Priority: overdue cards first (by how overdue), then by retrievability
 * @param {Array} cards - Array of {cardData, fsrsCard} objects
 * @param {Date} now - Current time
 * @returns {Array} Sorted array
 */
export function sortByPriority(cards, now = new Date()) {
    return cards.sort((a, b) => {
        const aOverdue = getOverdueDays(a.fsrsCard, now);
        const bOverdue = getOverdueDays(b.fsrsCard, now);

        // Both overdue: more overdue first
        if (aOverdue > 0 && bOverdue > 0) {
            return bOverdue - aOverdue;
        }

        // One overdue: overdue first
        if (aOverdue > 0) return -1;
        if (bOverdue > 0) return 1;

        // Neither overdue: earlier due date first
        return a.fsrsCard.due - b.fsrsCard.due;
    });
}

/**
 * Format an interval in days to human-readable string
 * @param {number} days - Interval in days
 * @returns {string} Formatted interval
 */
export function formatInterval(days) {
    if (days < 1/24/60) {
        return '< 1m';
    }
    if (days < 1/24) {
        const mins = Math.round(days * 24 * 60);
        return `${mins}m`;
    }
    if (days < 1) {
        const hours = Math.round(days * 24);
        return `${hours}h`;
    }
    if (days < 30) {
        const d = Math.round(days);
        return `${d}d`;
    }
    if (days < 365) {
        const months = Math.round(days / 30);
        return `${months}mo`;
    }
    const years = Math.round(days / 365 * 10) / 10;
    return `${years}y`;
}

/**
 * Get time until next due card
 * @param {Array} cards - Array of {cardData, fsrsCard} objects
 * @param {Date} now - Current time
 * @returns {string|null} Formatted time until next review, or null if none
 */
export function getTimeUntilNextDue(cards, now = new Date()) {
    if (cards.length === 0) return null;

    // Find the earliest due card that's not yet due
    let earliest = null;
    for (const card of cards) {
        if (card.fsrsCard.due > now) {
            if (!earliest || card.fsrsCard.due < earliest.fsrsCard.due) {
                earliest = card;
            }
        }
    }

    if (!earliest) return null;

    const diff = earliest.fsrsCard.due - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
        const days = Math.floor(hours / 24);
        return `${days} day${days > 1 ? 's' : ''}`;
    }
    if (hours > 0) {
        return `${hours}h ${mins}m`;
    }
    return `${mins} min${mins > 1 ? 's' : ''}`;
}
