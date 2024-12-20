---
layout: default
title: Blog
description: Thoughts on game design, development, and other topics
---

<div class="content-container">
    <h1>Newest</h1>
    <div class="blog-posts">
        {% assign visible_posts = site.blog | where: "visibility", "public" | sort: 'date' | reverse %}
        {% for post in visible_posts %}
        <div class="post-entry">
            • <a href="{{ post.url }}" 
                 data-preview="true"
                 data-title="{{ post.title }}"
                 data-date="{{ post.date | date: '%Y-%m-%d' }}"
                 data-description="{{ post.description }}"
                 data-tags="{{ post.tags | join: ', ' }}">
                {{ post.title }}
            </a>
            {% if post.type == "review" %}
            <span class="post-type">review</span>
            {% endif %}
        </div>
        {% endfor %}
    </div>
</div>

<div class="preview-popup" id="preview-popup">
    <div class="preview-header">
        <h3 class="preview-title"></h3>
        <time class="preview-date"></time>
    </div>
    <div class="preview-description"></div>
    <div class="preview-tags"></div>
</div> 