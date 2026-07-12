---
layout: base
title: Blog
description: Thoughts on game design, development, and other topics
use_container: false
preview_popup: true
---

<div class="content-container">
    <h1 class="page-title">Blog</h1>
    <div class="post-list">
        {% assign visible_posts = site.blog | where: "visibility", "public" | sort: 'date' | reverse %}
        {% for post in visible_posts %}
        <article class="post-row">
            <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y-%m-%d" }}</time>
            <div>
                <h3>
                    <a href="{{ post.url }}"
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
                </h3>
                {% if post.description %}
                <p>{{ post.description }}</p>
                {% endif %}
                {% if post.tags %}
                <div class="tags">
                    {% for tag in post.tags limit:4 %}
                    <span class="tag">{{ tag }}</span>
                    {% endfor %}
                </div>
                {% endif %}
            </div>
        </article>
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
