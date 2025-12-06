/**
 * Card management module
 * Handles loading, parsing, and expanding cards from JSON data
 */

/**
 * Load and expand all cards from the global FLASHCARD_DATA
 * @returns {Array} Array of expanded card objects
 */
export function loadCards() {
    const data = window.FLASHCARD_DATA;
    if (!data || !data.cards) {
        console.error('No flashcard data found');
        return [];
    }

    const expandedCards = [];

    for (const card of data.cards) {
        const expanded = expandCard(card);
        expandedCards.push(...expanded);
    }

    return expandedCards;
}

/**
 * Expand a single card into one or more review cards
 * - Basic cards: 1 card
 * - Cloze cards: 1 card per {{blank}}
 * - Reversible cards: 2 cards (term->def and def->term)
 * @param {Object} card - Raw card from JSON
 * @returns {Array} Array of expanded cards
 */
function expandCard(card) {
    switch (card.type) {
        case 'basic':
            return [createBasicCard(card)];

        case 'cloze':
            return expandClozeCard(card);

        case 'reversible':
            return expandReversibleCard(card);

        default:
            console.warn(`Unknown card type: ${card.type}`);
            return [createBasicCard(card)];
    }
}

/**
 * Create a basic Q&A card
 * @param {Object} card - Raw card data
 * @returns {Object} Processed card
 */
function createBasicCard(card) {
    return {
        id: card.id,
        type: 'basic',
        front: card.front,
        back: card.back,
        tags: card.tags || [],
        source: card.source,
        created: card.created
    };
}

/**
 * Expand a cloze card into multiple cards (one per blank)
 * @param {Object} card - Raw cloze card
 * @returns {Array} Array of cloze cards
 */
function expandClozeCard(card) {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = [...card.text.matchAll(regex)];

    if (matches.length === 0) {
        console.warn(`Cloze card ${card.id} has no blanks`);
        return [{
            id: card.id,
            type: 'cloze',
            front: card.text,
            back: card.text,
            tags: card.tags || [],
            source: card.source,
            created: card.created
        }];
    }

    return matches.map((match, index) => {
        const answer = match[1];

        // Create front with this blank replaced by underscore
        let front = card.text;
        let blankNumber = 0;

        front = card.text.replace(regex, (m, content) => {
            if (blankNumber === index) {
                blankNumber++;
                return `<span class="srs-cloze-blank">[...]</span>`;
            }
            blankNumber++;
            return content; // Show other blanks as their content
        });

        // Create back with the answer highlighted
        blankNumber = 0;
        const back = card.text.replace(regex, (m, content) => {
            if (blankNumber === index) {
                blankNumber++;
                return `<span class="srs-cloze-answer">${content}</span>`;
            }
            blankNumber++;
            return content;
        });

        return {
            id: matches.length > 1 ? `${card.id}:c${index + 1}` : card.id,
            type: 'cloze',
            front: front,
            back: back,
            answer: answer,
            tags: card.tags || [],
            source: card.source,
            created: card.created
        };
    });
}

/**
 * Expand a reversible card into two cards
 * @param {Object} card - Raw reversible card
 * @returns {Array} Array of two cards
 */
function expandReversibleCard(card) {
    return [
        {
            id: `${card.id}:fwd`,
            type: 'reversible',
            direction: 'forward',
            front: `<span class="srs-term">${card.term}</span>`,
            back: card.definition,
            tags: card.tags || [],
            source: card.source,
            created: card.created
        },
        {
            id: `${card.id}:rev`,
            type: 'reversible',
            direction: 'reverse',
            front: `<span class="srs-definition">${card.definition}</span>`,
            back: card.term,
            tags: card.tags || [],
            source: card.source,
            created: card.created
        }
    ];
}

/**
 * Get all unique tags from a list of cards
 * @param {Array} cards - Array of cards
 * @returns {Array} Sorted array of unique tags
 */
export function getAllTags(cards) {
    const tags = new Set();
    for (const card of cards) {
        for (const tag of card.tags) {
            tags.add(tag);
        }
    }
    return [...tags].sort();
}

/**
 * Filter cards by tag
 * @param {Array} cards - Array of cards
 * @param {string} tag - Tag to filter by, or 'all' for no filter
 * @returns {Array} Filtered cards
 */
export function filterByTag(cards, tag) {
    if (tag === 'all') {
        return cards;
    }
    return cards.filter(card => card.tags.includes(tag));
}
