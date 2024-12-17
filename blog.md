---
layout: default
title: Blog
description: Thoughts on game design, development, and other topics
---

<div class="content-container">
    <header class="page-header">
        <h1>Blog</h1>
        <p class="subtitle">{{ page.description }}</p>
    </header>

    <div class="blog-posts">
        {% assign posts = site.blog | sort: 'date' | reverse %}
        {% for post in posts %}
        <article class="post-preview">
            <header>
                <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
                <div class="post-meta">
                    <time datetime="{{ post.date | date_to_xmlschema }}">
                        {{ post.date | date: "%B %d, %Y" }}
                    </time>
                    {% if post.tags %}
                    <div class="post-tags">
                        {% for tag in post.tags %}
                        <span class="tag">{{ tag }}</span>
                        {% endfor %}
                    </div>
                    {% endif %}
                </div>
            </header>
            
            {% if post.description %}
            <p class="post-description">{{ post.description }}</p>
            {% endif %}
            
            <a href="{{ post.url }}" class="read-more">Read more →</a>
        </article>
        {% endfor %}
    </div>

    {% if posts.size == 0 %}
    <div class="no-posts">
        <p>No blog posts yet. Check back soon!</p>
    </div>
    {% endif %}
</div> 