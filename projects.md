---
layout: base
title: Projects
use_container: false
---

<div class="projects-index">
    <h1 class="page-title">Projects</h1>
    <p class="page-intro">A collection of my game development and design projects.</p>

    <div class="project-grid">
        {% for project in site.projects %}
        <article class="project-card">
            <a class="project-thumb" href="{{ project.url }}">
                {% if project.thumbnail %}
                <img src="{{ project.thumbnail | relative_url }}" alt="{{ project.title }}" data-dither loading="lazy">
                {% else %}
                <span class="placeholder">{{ project.title }}</span>
                {% endif %}
            </a>
            <div class="project-body">
                {% if project.status %}
                {% assign s = project.status | downcase %}
                {% if s contains 'release' or s contains 'complet' %}
                <div class="project-status released">{% if s contains 'release' %}Released{% else %}Complete{% endif %}</div>
                {% else %}
                <div class="project-status wip">In Development</div>
                {% endif %}
                {% endif %}
                <h3><a href="{{ project.url }}">{{ project.title }}</a></h3>
                <p>{{ project.description }}</p>
                {% if project.tags and project.tags != empty %}
                <div class="tags">
                    {% for tag in project.tags limit:3 %}
                    <span class="tag">{{ tag }}</span>
                    {% endfor %}
                </div>
                {% endif %}
            </div>
        </article>
        {% endfor %}
    </div>
</div>
