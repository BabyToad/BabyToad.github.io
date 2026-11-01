---
layout: base
title: Thoughts
description: Short observations and experiments by Jonas Heinke on games, AI, and things worth sharing.
permalink: /thoughts/
image_alternates: true
player: true
---

<section class="thoughts-timeline">
    <header class="thoughts-header">
        <h1 class="page-title">Thoughts</h1>
        <p class="thoughts-intro">Short musings, observations, and things I wanted to say somewhere.</p>
    </header>

    <div class="thoughts-feed">
        {% assign sorted_thoughts = site.thoughts | sort: 'date' | reverse %}
        {% for thought in sorted_thoughts %}
        <article class="thought-row" aria-label="{{ thought.title | escape }}">
            <header class="thought-date">
                <time datetime="{{ thought.date | date_to_xmlschema }}">
                    {{ thought.date | date: "%Y-%m-%d" }}
                </time>
                {% if thought.context %}
                <span class="thought-context">{{ thought.context }}</span>
                {% endif %}
            </header>

            <div class="thought-entry">
                <div class="thought-content">
                    {{ thought.content }}
                </div>

                {% include thought-images.html item=thought figure_class="thought-image" %}

                {% if thought.sources %}
                <div class="thought-sources">
                    {% for source in thought.sources %}
                    <a href="{{ source.url }}" target="_blank" rel="noopener">{{ source.title }}</a>{% unless forloop.last %} · {% endunless %}
                    {% endfor %}
                </div>
                {% endif %}

                <div class="thought-actions">
                    <a href="{{ thought.url }}" class="thought-permalink" aria-label="Permalink: {{ thought.title | escape }}">Permalink &rarr;</a>
                </div>
            </div>
        </article>
        {% endfor %}
    </div>
</section>
