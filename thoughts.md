---
layout: base
title: Thoughts
description: Short musings, observations, and things I wanted to say somewhere
permalink: /thoughts/
---

<section class="thoughts-timeline">
    <header class="thoughts-header">
        <h1>Thoughts</h1>
        <p class="thoughts-intro">Short musings, observations, and things I wanted to say somewhere.</p>
    </header>

    <div class="thoughts-feed">
        {% assign sorted_thoughts = site.thoughts | sort: 'date' | reverse %}
        {% for thought in sorted_thoughts %}
        <article class="thought-card">
            <header class="thought-card-header">
                <time datetime="{{ thought.date | date_to_xmlschema }}">
                    {{ thought.date | date: "%b %d, %Y" }}
                </time>
                {% if thought.context %}
                <span class="thought-context">{{ thought.context }}</span>
                {% endif %}
            </header>

            <div class="thought-card-content">
                {{ thought.content }}
            </div>

            {% if thought.image %}
            <figure class="thought-card-image">
                <img src="{{ thought.image }}" alt="{{ thought.image_alt | default: 'Thought image' }}" loading="lazy">
            </figure>
            {% endif %}

            {% if thought.sources %}
            <div class="thought-sources">
                {% for source in thought.sources %}
                <a href="{{ source.url }}" target="_blank" rel="noopener">{{ source.title }}</a>{% unless forloop.last %} · {% endunless %}
                {% endfor %}
            </div>
            {% endif %}

            <footer class="thought-card-footer">
                <a href="{{ thought.url }}" class="thought-permalink" title="Permalink" aria-label="Permalink">
                    <span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span>
                </a>
            </footer>
        </article>
        {% endfor %}
    </div>
</section>
