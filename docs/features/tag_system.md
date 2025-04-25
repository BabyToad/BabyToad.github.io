# Tag System Documentation

## Overview
The tag system is a dynamic feature that provides interactive tooltips and glossary functionality for game mechanics terms in For Want of Fuel. It processes special tag syntax in the content and converts them into interactive elements with hover effects, tooltips, and glossary links.

## Implementation Details

### Data Structure
Tags are defined in `_data/tags.json` with the following structure:
```json
{
  "weapon_tags": {
    "category": {
      "tag_id": {
        "name": "Display Name",
        "description": "Tag description",
        "example": "Usage example"
      }
    }
  },
  "fitting_tags": {
    // Similar structure for fitting tags
  }
}
```

### Tag Syntax
Tags are written in content using the following syntax:
```
[[tag:tag_id]]           // Basic tag
[[tag:tag_id value]]     // Tag with value (e.g., [[tag:blast 2]])
```

### Processing Pipeline
1. Content with tag syntax is processed by Jekyll
2. JavaScript initializes on page load:
   - Parses tag data from hidden element
   - Converts tag syntax to interactive elements
   - Sets up event listeners for interactions

## Features

### 1. Interactive Tooltips
- Hover over tag to show tooltip
- Tooltips show name, description, and example
- 1-second hover makes tooltip sticky
- Progress bar indicates hover duration
- Sticky tooltips can be:
  - Dragged to reposition
  - Closed via close button
  - Closed via double-click on header

### 2. Glossary Integration
- Clicking tags scrolls to glossary entry
- Glossary entries highlight when navigated to
- Bidirectional navigation between usage and definition

### 3. Visual Feedback
- Hover effects on tags
- Progress bar for sticky behavior
- Highlight animation in glossary
- Drag handles for sticky tooltips

## CSS Classes

### Tag Elements
```css
.tag-highlight           // Base tag styling
.tag-highlight.hovering  // Active hover state
```

### Tooltip Elements
```css
.tag-popup              // Base popup container
.tag-popup.visible      // Visible state
.tag-popup.sticky       // Sticky state
.tag-popup-header       // Tooltip header
.tag-popup-title        // Tag name
.tag-popup-content      // Description
.tag-popup-example      // Usage example
```

## JavaScript Components

### 1. Initialization
```javascript
document.addEventListener('DOMContentLoaded', () => {
    processTagSyntax();  // Convert syntax to elements
    processTags();       // Set up interactions
});
```

### 2. Tag Processing
- `processTagSyntax()`: Converts [[tag:x]] syntax to HTML elements
- `processTags()`: Sets up event listeners for all tag elements
- `createPopup()`: Generates tooltip DOM structure
- `showTagPopup()`: Displays and positions tooltip

## Event Handling

### Mouse Events
- `mouseenter`: Show tooltip
- `mouseleave`: Hide non-sticky tooltip
- `click`: Navigate to glossary
- `dblclick`: Close sticky tooltip

### Tooltip Dragging
- `mousedown`: Start drag
- `mousemove`: Update position
- `mouseup`: End drag

## Maintenance

### Adding New Tags
1. Add tag definition to `_data/tags.json`
2. Use [[tag:new_tag]] syntax in content
3. Tags are automatically processed

### Modifying Tag Behavior
- Edit CSS in `assets/css/components/for-want-of-fuel.css`
- Modify JavaScript in layout file for interaction changes

### Common Issues
1. **Tag Not Found**: Check tag ID in `tags.json`
2. **Tooltip Positioning**: Adjust position calculation in `showTagPopup()`
3. **Mobile Display**: Check media queries in CSS

## Best Practices

### Content Writing
1. Use consistent tag IDs
2. Include values where appropriate
3. Don't nest tags
4. Use tags sparingly for clarity

### Performance
- Tags are processed on page load
- Tooltips are created/destroyed as needed
- Sticky tooltips persist until manually closed

### Accessibility
- Tags are keyboard navigable
- Color contrast meets WCAG standards
- Tooltips include semantic markup

## Future Improvements
1. Keyboard navigation for tooltips
2. Touch device optimizations
3. Tag categories in glossary
4. Search/filter functionality
5. Tag usage analytics 