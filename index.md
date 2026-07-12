---
layout: base
title: Steak Knives and Bagels
description: Personal website showcasing projects and skills
---

<header class="intro-section">
    <h1>I am Jonas and<br>this is my website.</h1>
    <p>I write about roleplaying games, game design, AI, and sometimes rationality.</p>
    <p>This page hosts my projects, essays, and occasional thoughts on other topics that catch my interest.</p>
    <p class="quiet">I work at <a href="https://playinsightstudios.com/">PlayInsight Studios</a> and help run <a href="https://www.proludens.com/">Pro Ludens</a>.</p>
</header>

{% assign latest_thought = site.thoughts | sort: 'date' | reverse | first %}
{% if latest_thought %}
<div class="asterism">&#8258;</div>

<section class="latest-thought-section">
    <div class="section-label">Latest Thought</div>
    <article class="latest-thought">
        <div class="thought-body">
            {{ latest_thought.content }}
        </div>
        {% if latest_thought.image %}
        <figure class="latest-thought-image">
            <img src="{{ latest_thought.image }}" alt="{{ latest_thought.image_alt | default: '' }}" data-dither loading="lazy">
        </figure>
        {% endif %}
        {% if latest_thought.sources %}
        <div class="thought-sources">
            {% for source in latest_thought.sources %}
            <a href="{{ source.url }}" target="_blank" rel="noopener">{{ source.title }}</a>{% unless forloop.last %} · {% endunless %}
            {% endfor %}
        </div>
        {% endif %}
        <div class="thought-meta">
            <time datetime="{{ latest_thought.date | date_to_xmlschema }}">
                {{ latest_thought.date | date: "%B %d, %Y" }}
                {% if latest_thought.context %} · {{ latest_thought.context }}{% endif %}
            </time>
            <a href="/thoughts/" class="more">All thoughts &rarr;</a>
        </div>
    </article>
</section>
{% endif %}

<div class="asterism">&#8258;</div>

<section class="recent-posts-section">
    <div class="section-label">Recent Posts</div>
    {% assign recent_posts = site.blog | where: "visibility", "public" | sort: 'date' | reverse | limit:3 %}
    {% if recent_posts.size > 0 %}
    <div class="post-list">
        {% for post in recent_posts limit:3 %}
        <article class="post-row">
            <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y-%m-%d" }}</time>
            <div>
                <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
                {% if post.description %}
                <p>{{ post.description }}</p>
                {% endif %}
                {% if post.tags %}
                <div class="tags">
                    {% for tag in post.tags limit:3 %}
                    <span class="tag">{{ tag }}</span>
                    {% endfor %}
                </div>
                {% endif %}
            </div>
        </article>
        {% endfor %}
    </div>
    {% else %}
    <p>No blog posts yet.</p>
    {% endif %}
</section>

<section class="contact-section">
    <div class="section-label">Contact</div>
    <div class="contact-links">
        <a href="https://github.com/babytoad" class="social-link">
            <span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg></span> GitHub
        </a>
        <a href="https://www.linkedin.com/in/jonas-heinke/" class="social-link">
            <span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></span> LinkedIn
        </a>
    </div>
</section>
