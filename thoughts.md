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
                <a href="{{ thought.url }}" class="thought-permalink" title="Permalink">
                    <i class="fas fa-link"></i>
                </a>
            </footer>
        </article>
        {% endfor %}
    </div>
</section>
