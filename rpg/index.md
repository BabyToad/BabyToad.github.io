---
layout: default
title: RPG Blog
---

<div class="rpg-blog">
    <header class="page-header">
        <h1>RPG Design & Theory</h1>
        <p>Exploring game design through the lens of tabletop RPGs</p>
    </header>

    <!-- Debug section -->
    <div class="debug-info">
        <p>Number of posts: {{ site.rpg_blog.size }}</p>
        <h3>All Posts:</h3>
        <ul>
        {% for post in site.rpg_blog %}
            <li>{{ post.title }} - {{ post.date | date: "%Y-%m-%d" }}</li>
        {% endfor %}
        </ul>
    </div>

    <div class="post-grid">
        {% for post in site.rpg_blog reversed %}
        <article class="post-card">
            <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
            <div class="post-meta">
                <time>{{ post.date | date: "%B %d, %Y" }}</time>
                {% if post.tags %}
                <div class="post-tags">
                    {% for tag in post.tags limit:3 %}
                    <span class="tag">{{ tag }}</span>
                    {% endfor %}
                </div>
                {% endif %}
            </div>
            {% if post.excerpt %}
            <p class="post-excerpt">{{ post.excerpt }}</p>
            {% endif %}
        </article>
        {% endfor %}
    </div>
</div>
