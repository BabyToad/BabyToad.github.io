---
layout: essay
title: The Golden Triangle
description: A Stars Without Number campaign setting for Trade, Privateering and a New Age of Sail
status: in-progress
confidence: medium
tags: [rpg, stars-without-number, worldbuilding, game-design, campaign-setting, swn]
thumbnail: /assets/images/projects/GoldenTriangle_Thumb.png
abstract: A comprehensive documentation of a Stars Without Number campaign setting.
last_modified_at: 2024-12-06
---
{% for part in site.golden_triangle_parts %}
<div class="essay-part" data-expanded="true" id="part-{{ part.title | slugify }}">
  <div class="essay-part-header">
    <span class="expand-icon">▼</span>
    {{ part.title }}
  </div>
  <div class="essay-part-content">
    {{ part.content | markdownify }}
  </div>
</div>
{% endfor %}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const parts = document.querySelectorAll('.essay-part');
  
  parts.forEach(part => {
    const header = part.querySelector('.essay-part-header');
    const content = part.querySelector('.essay-part-content');
    const icon = part.querySelector('.expand-icon');
    
    header.addEventListener('click', () => {
      const isExpanded = part.getAttribute('data-expanded') === 'true';
      part.setAttribute('data-expanded', !isExpanded);
      content.style.display = isExpanded ? 'none' : 'block';
      icon.style.transform = isExpanded ? 'rotate(-90deg)' : 'rotate(0)';
    });
  });
});
</script>