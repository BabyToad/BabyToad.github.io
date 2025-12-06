Create flashcards from the current conversation for spaced repetition learning.

## Instructions

Review the recent conversation and identify key concepts, facts, vocabulary, or insights worth memorizing. Generate flashcards following these principles:

### Card Design Principles (from Wozniak's 20 Rules)

1. **Minimum Information**: One fact per card - simpler cards are easier to remember
2. **No Lists**: Never ask for unordered lists; break into individual cards
3. **Prefer Cloze**: Use fill-in-the-blank for definitions and facts
4. **Use Reversible**: For vocabulary and terms, create cards that work both directions
5. **Add Context**: Include enough context to disambiguate, but keep it concise
6. **Personalize**: Reference the conversation context when relevant

### Card Types

**Basic** (Question → Answer):
```json
{
  "type": "basic",
  "front": "Clear, specific question",
  "back": "Concise answer"
}
```

**Cloze** (Fill in the blank):
```json
{
  "type": "cloze",
  "text": "Sentence with {{answer}} as blank"
}
```
- Multiple `{{blanks}}` create multiple cards automatically
- Only blank one concept at a time per blank

**Reversible** (Term ↔ Definition):
```json
{
  "type": "reversible",
  "term": "Term or vocabulary word",
  "definition": "Clear definition"
}
```
- Automatically generates both term→definition and definition→term cards

### Output Format

Generate cards in this exact JSON format:

```json
{
  "cards": [
    {
      "id": "unique-id-here",
      "type": "basic|cloze|reversible",
      "front": "...",
      "back": "...",
      "tags": ["topic1", "topic2"],
      "source": "Brief description of source conversation",
      "created": "YYYY-MM-DD"
    }
  ]
}
```

### After Generating

1. Show the generated cards to the user for review
2. Ask if any cards should be modified or removed
3. Offer to append them to `_data/flashcards.json`

### ID Generation

Use a descriptive ID format: `topic-subtopic-NNN` (e.g., `latin-verbs-001`, `cs-algorithms-003`)

### Tag Conventions

Common tags used in this collection:
- `meta`, `learning` - About learning itself
- `latin`, `greek` - Classical languages
- `philosophy`, `vocabulary` - Philosophy terms
- `cs`, `algorithms`, `complexity` - Computer science
- `history`, `econ` - History and economics

Check existing cards in `_data/flashcards.json` for consistent tagging.
