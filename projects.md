---
layout: base
title: Projects
use_container: false
---

<div class="main-content">
    <h1>Projects</h1>
    <p>A collection of my game development and design projects.</p>
    
    <div class="projects-list">
        {% for project in site.projects %}
        <div class="project-card">
            {% if project.thumbnail %}
            <img src="{{ project.thumbnail }}" alt="{{ project.title }}" class="project-thumbnail">
            {% endif %}
            <div class="project-card-content">
                <h3><a href="{{ project.url }}">{{ project.title }}</a></h3>
                <p>{{ project.description }}</p>
                {% if project.tags %}
                <div class="project-card-tags">
                    {% for tag in project.tags limit:3 %}
                    <span class="tag">{{ tag }}</span>
                    {% endfor %}
                </div>
                {% endif %}
            </div>
        </div>
        {% endfor %}
    </div>
</div> 