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
- Tooltips display name, description, and example usage
- Mouse movement between tag and tooltip is smooth with no flickering
- Tooltips can be:
  - Dragged to reposition (automatically pins when dragging starts)
  - Pinned/unpinned via pin button
  - Closed via close button
  - Closed via double-click on header

### 2. Popup Management
- Clean, minimal UI with SVG icons
- Smooth transitions and hover effects
- Visual feedback for interactions:
  - Pin button highlights when popup is pinned
  - Hover effects on controls
  - Subtle animations for state changes
- Multiple popups can be open simultaneously
- Proper cleanup when popups are closed

### 3. Popup States
- **Temporary**: Shows while hovering over tag
- **Transitioning**: Brief delay when moving mouse to popup
- **Pinned**: Stays visible after:
  - Clicking pin button
  - Starting to drag popup
- **Closed**: Removes popup and cleans up references

### 4. Glossary Integration
- Clicking tags scrolls to glossary entry
- Glossary entries highlight when navigated to
- Bidirectional navigation between usage and definition

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
.tag-popup.sticky       // Pinned state
.tag-popup-header       // Draggable header
.tag-popup-title        // Tag name
.tag-popup-content      // Description
.tag-popup-example      // Usage example
.tag-popup-controls     // Control buttons container
.tag-popup-pin          // Pin/unpin button
.tag-popup-close        // Close button
```

## JavaScript Components

### 1. State Management
- Global `activePopups` WeakMap tracks popup-to-element relationships
- Proper cleanup on popup removal
- Debounced event handlers for smooth interactions

### 2. Event Handling
```javascript
// Tag events
mouseenter: Show popup with delay
mouseleave: Hide unpinned popup with delay

// Popup events
mouseenter: Keep popup visible
mouseleave: Hide if not pinned
mousedown: Start drag (auto-pins)
mousemove: Update position while dragging
mouseup: End drag

// Control events
pin click: Toggle pinned state
close click: Remove popup
header double-click: Close popup
```

## Best Practices

### Content Writing
1. Use consistent tag IDs
2. Include values where appropriate
3. Don't nest tags
4. Use tags sparingly for clarity

### Performance
- Popups are created on demand
- Event listeners are properly cleaned up
- Smooth animations with minimal reflows
- Efficient state tracking with WeakMap

### Accessibility
- Keyboard-friendly controls
- Clear visual feedback
- Descriptive tooltips on controls
- High contrast text and icons

## Future Improvements
1. Keyboard navigation for popups
2. Touch device optimizations
3. Tag categories in glossary
4. Search/filter functionality
5. Tag usage analytics
6. Position memory for pinned popups
7. Popup stacking order management 