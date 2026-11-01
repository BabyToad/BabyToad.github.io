---
layout: base
title: Talks
permalink: /talks/
description: Talks on AI, game design, and making games by Jonas Heinke.
---

<h1 class="page-title">Talks</h1>

<p>Talks and guest lectures on AI, game design, and making games, with decks and write-ups.</p>

<div class="post-list talks-list">
    {% assign talks = site.data.talks | sort: 'date' | reverse %}
    {% for talk in talks %}
    <article class="post-row talk-row">
        <div class="talk-date">
            <time datetime="{{ talk.date | date: '%Y-%m-%d' }}">{{ talk.date | date: "%Y-%m-%d" }}</time>
            {% if talk.date_label %}<span>{{ talk.date_label | escape }}</span>{% endif %}
        </div>
        <div>
            <h2>{{ talk.title | escape }}</h2>
            <p class="talk-meta">{% if talk.venue %}{{ talk.venue | escape }}{% if talk.city %}, {{ talk.city | escape }}{% endif %}{% else %}Venue not recorded{% endif %} · {{ talk.format | escape }} · {{ talk.language | escape }}</p>
            <p>{{ talk.summary | escape }}</p>
            {% if talk.update %}
            <p class="talk-note"><a href="{{ talk.update.post_url | relative_url }}">December update</a>: {{ talk.update.date | date: "%Y-%m-%d" }}, {{ talk.update.venue | escape }} {{ talk.update.city | escape }}. The deck below is this updated version.</p>
            {% endif %}
            <div class="talk-links">
                <a href="{{ talk.deck_url | relative_url }}">Deck</a>
                {% if talk.post_url %}<a href="{{ talk.post_url | relative_url }}">Write-up</a>{% endif %}
            </div>
        </div>
    </article>
    {% endfor %}
</div>

<p class="talks-teaching"><a href="{{ '/teaching/' | relative_url }}">Teaching</a>: Game Engines &amp; Coding 1, Macromedia Leipzig, winter 2026/27.</p>
