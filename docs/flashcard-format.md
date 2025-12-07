# Flashcard Format Specification

This document describes the format for adding flashcards to the spaced repetition system at `/learn`.

## File Location

Cards are stored in `_data/flashcards.json`.

## Card Types

### Basic (Question → Answer)
```json
{
  "id": "topic-001",
  "type": "basic",
  "front": "What is the question?",
  "back": "The answer.",
  "tags": ["topic"],
  "source": "Where this came from",
  "created": "2025-12-07"
}
```

### Cloze (Fill in the blank)
```json
{
  "id": "topic-002",
  "type": "cloze",
  "text": "The {{answer}} appears as a blank.",
  "tags": ["topic"],
  "source": "Source",
  "created": "2025-12-07"
}
```
- Multiple `{{blanks}}` create multiple cards automatically
- Each blank tests one concept

### Reversible (Term ↔ Definition)
```json
{
  "id": "topic-003",
  "type": "reversible",
  "term": "Term",
  "definition": "What it means",
  "tags": ["topic", "vocabulary"],
  "source": "Source",
  "created": "2025-12-07"
}
```
- Generates two cards: term→definition and definition→term

## Card Design Principles

1. **One fact per card** - Simpler cards are easier to remember
2. **No lists** - Break lists into individual cards
3. **Prefer cloze** - Better for definitions and facts than basic Q&A
4. **Use reversible** - For vocabulary and terms
5. **Add context** - Enough to disambiguate, but keep concise

## Math Support

Cards support KaTeX for mathematical notation:
- Inline math: `$E = mc^2$` renders as *E = mc²*
- Display math: `$$\int_0^1 x^2 dx$$` renders centered on its own line
- Works in front, back, text, term, and definition fields

Example:
```json
{
  "id": "math-001",
  "type": "basic",
  "front": "What is the quadratic formula?",
  "back": "$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$",
  "tags": ["math"],
  "source": "Algebra",
  "created": "2025-12-07"
}
```

## ID Convention

Use descriptive IDs: `topic-subtopic-NNN`
- `latin-verbs-001`
- `cs-algorithms-003`
- `history-rome-012`

## Common Tags

- `meta`, `learning` - About learning itself
- `latin`, `greek` - Classical languages
- `philosophy`, `vocabulary` - Philosophy terms
- `cs`, `algorithms`, `complexity` - Computer science
- `econ`, `micro`, `macro` - Economics fundamentals
- `game-theory`, `behavioral`, `information` - Advanced economics
- `welfare`, `trade` - Welfare and international economics
- `advanced` - Intermediate/advanced level concepts

Check existing cards in `_data/flashcards.json` for consistent tagging.

## Adding Cards

Append new cards to the `cards` array in `_data/flashcards.json`:

```json
{
  "version": 1,
  "cards": [
    // ... existing cards ...
    {
      "id": "new-card-001",
      "type": "basic",
      "front": "New question",
      "back": "New answer",
      "tags": ["topic"],
      "source": "Conversation about X",
      "created": "2025-12-07"
    }
  ]
}
```
