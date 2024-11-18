---
layout: essay
title: The Golden Triangle
description: A Stars Without Number campaign setting
status: in-progress
confidence: speculative
tags: [rpg, stars-without-number, worldbuilding, game-design, campaign-setting, swn] 
abstract: A comprehensive documentation of a Stars Without Number campaign setting.
---

# The Golden Triangle

This is a living document compiling the Stars Without Number campaign setting and house rules I am using for my own gaming.
Things get changed, added, and removed as I run the campaign. But at anytime this document should represent the current state of the campaign setting. 
The document is intended to illustrate my design process and offer notes on why I made certain design decisions. Hopefully it will be useful to my future self and others.

{% for part in site.golden_triangle_parts %}
<div class="essay-part" data-expanded="true" id="part-{{ part.title | slugify }}">
  <div class="essay-part-header">
    <span class="expand-icon">▼</span>
    {{ part.title }}
  </div>
  <div class="essay-part-content" markdown="1">
{{ part.content }}
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