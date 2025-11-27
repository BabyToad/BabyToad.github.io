---
layout: base
title: Steak Knives and Bagels
description: Personal website showcasing projects and skills
---

<section class="intro-section">
    <p>I am Jonas and this is my website.</p>
    <p>I write about roleplaying games, game design, AI, and sometimes rationality.</p>
    
    <p>This page hosts my projects, essays, and occasional thoughts on other topics that catch my interest.</p>
    
</section>

{% assign latest_thought = site.thoughts | sort: 'date' | reverse | first %}
{% if latest_thought %}
<section class="latest-thought-section">
    <h2>Latest Thought</h2>
    <article class="latest-thought">
        <div class="latest-thought-content">
            {{ latest_thought.content }}
        </div>
        {% if latest_thought.image %}
        <figure class="latest-thought-image">
            <img src="{{ latest_thought.image }}" alt="{{ latest_thought.image_alt | default: '' }}" loading="lazy">
        </figure>
        {% endif %}
        {% if latest_thought.sources %}
        <div class="thought-sources">
            {% for source in latest_thought.sources %}
            <a href="{{ source.url }}" target="_blank" rel="noopener">{{ source.title }}</a>{% unless forloop.last %} · {% endunless %}
            {% endfor %}
        </div>
        {% endif %}
        <footer class="latest-thought-meta">
            <time datetime="{{ latest_thought.date | date_to_xmlschema }}">
                {{ latest_thought.date | date: "%B %d, %Y" }}
                {% if latest_thought.context %} · {{ latest_thought.context }}{% endif %}
            </time>
            <a href="/thoughts/" class="all-thoughts-link">All thoughts &rarr;</a>
        </footer>
    </article>
</section>
{% endif %}

<section class="recent-posts-section">
    <h2>Recent Posts</h2>
    <div class="posts-grid">
        {% assign recent_posts = site.blog | where: "visibility", "public" | sort: 'date' | reverse | limit:3 %}
        {% if recent_posts.size > 0 %}
            {% for post in recent_posts %}
            <div class="post-card">
                <div class="post-card-content">
                    <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
                    <time datetime="{{ post.date | date_to_xmlschema }}" class="post-date">
                        {{ post.date | date: "%B %d, %Y" }}
                    </time>
                    {% if post.description %}
                    <p>{{ post.description }}</p>
                    {% endif %}
                </div>
            </div>
            {% endfor %}
        {% else %}
            <p>No blog posts yet.</p>
        {% endif %}
    </div>
</section>

<section class="contact-section">
    <h2>Contact</h2>
    <div class="contact-links">
        <a href="https://github.com/babytoad" class="social-link">
            <i class="fab fa-github"></i> GitHub
        </a>
        <a href="https://linkedin.com/in/[your-profile]" class="social-link">
            <i class="fab fa-linkedin"></i> LinkedIn
        </a>
        <a href="https://discord.com/users/[your-discord-id]" class="social-link">
            <i class="fab fa-discord"></i> Discord
        </a>
    </div>
</section>

<footer>
    <p>© {{ 'now' | date: "%Y" }} {{ site.author }}. All rights reserved. That's boggle, baby.</p>
</footer> 