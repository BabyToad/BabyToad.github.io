/**
 * Statistics module for SRS
 * Handles streak tracking, retention calculations, and display
 */

import { getStats, getReviewsToday } from './storage.js';

/**
 * Calculate retention rate
 * @returns {number|null} Retention rate as percentage, or null if no reviews
 */
export function getRetentionRate() {
    const stats = getStats();
    if (stats.totalReviews === 0) return null;
    return Math.round((stats.correctReviews / stats.totalReviews) * 100);
}

/**
 * Get current streak
 * @returns {number} Current streak in days
 */
export function getCurrentStreak() {
    const stats = getStats();

    // Check if streak is still valid (reviewed today or yesterday)
    if (!stats.lastReviewDate) return 0;

    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (stats.lastReviewDate === today || stats.lastReviewDate === yesterdayStr) {
        return stats.currentStreak;
    }

    // Streak is broken
    return 0;
}

/**
 * Get longest streak
 * @returns {number} Longest streak in days
 */
export function getLongestStreak() {
    const stats = getStats();
    return stats.longestStreak;
}

/**
 * Get reviews today count
 * @returns {number} Number of reviews completed today
 */
export function getTodayCount() {
    return getReviewsToday();
}

/**
 * Get review history for last N days
 * @param {number} days - Number of days to look back
 * @returns {Array} Array of {date, count} objects
 */
export function getReviewHistory(days = 30) {
    const stats = getStats();
    const history = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();

        history.push({
            date: dateStr,
            count: stats.reviewsByDate[dateStr] || 0
        });
    }

    return history;
}

/**
 * Generate a simple ASCII heatmap of recent activity
 * @param {number} days - Number of days to show
 * @returns {string} ASCII heatmap
 */
export function generateHeatmap(days = 30) {
    const history = getReviewHistory(days);
    const maxCount = Math.max(...history.map(h => h.count), 1);

    const levels = [' ', '░', '▒', '▓', '█'];

    return history.map(h => {
        const level = Math.floor((h.count / maxCount) * (levels.length - 1));
        return levels[level];
    }).join('');
}

/**
 * Get summary statistics
 * @param {Array} allCards - All cards in the system
 * @param {Array} dueCards - Cards currently due
 * @returns {Object} Summary stats
 */
export function getSummary(allCards, dueCards) {
    const stats = getStats();

    return {
        totalCards: allCards.length,
        dueCount: dueCards.length,
        reviewedToday: getTodayCount(),
        currentStreak: getCurrentStreak(),
        longestStreak: getLongestStreak(),
        retention: getRetentionRate(),
        totalReviews: stats.totalReviews
    };
}

/**
 * Update the stats panel in the DOM
 * @param {Object} summary - Summary stats object
 */
export function updateStatsPanel(summary) {
    const elements = {
        streak: document.getElementById('stat-streak'),
        today: document.getElementById('stat-today'),
        total: document.getElementById('stat-total'),
        retention: document.getElementById('stat-retention')
    };

    if (elements.streak) {
        elements.streak.textContent = summary.currentStreak;
    }
    if (elements.today) {
        elements.today.textContent = summary.reviewedToday;
    }
    if (elements.total) {
        elements.total.textContent = summary.totalCards;
    }
    if (elements.retention) {
        elements.retention.textContent = summary.retention !== null
            ? `${summary.retention}%`
            : '-';
    }
}
