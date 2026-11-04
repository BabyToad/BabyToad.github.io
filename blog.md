---
layout: base
title: Blog
description: Essays and project notes by Jonas Heinke on roleplaying games, game design, and AI.
use_container: false
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
                    <a href="{{ post.url }}">
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
                    {% include tag.html tag=tag %}
                    {% endfor %}
                </div>
                {% endif %}
            </div>
        </article>
        {% endfor %}
    </div>
</div>
