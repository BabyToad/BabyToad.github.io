---
layout: base
title: Projects
description: Games, tools, and experiments in digital and tabletop game design by Jonas Heinke.
use_container: false
---

<div class="projects-index">
    <h1 class="page-title">Projects</h1>
    <p class="page-intro">A collection of my game development and design projects.</p>

    <div class="project-grid">
        {% comment %}Pinned work has an explicit editorial order. The remaining
        keys sort by date (last_modified_at is the fallback), then slug for ties.
        Keep these as ISO dates so the string sort is chronological.{% endcomment %}
        {% assign featured_projects = site.projects | where: 'featured', true | sort: 'featured_order' %}
        {% comment %}Jekyll supplies site.time for undated collection items;
        treat that generated value as missing before applying the fallback.{% endcomment %}
        {%- capture project_keys -%}
            {%- for project in site.projects -%}
                {%- unless project.featured -%}
                    {%- assign project_date = project.date | default: project.last_modified_at -%}
                    {%- if project_date == site.time -%}{%- assign project_date = project.last_modified_at -%}{%- endif -%}
                    {{- project_date | date: '%Y-%m-%d' -}}|{{- project.slug -}},
                {%- endunless -%}
            {%- endfor -%}
        {%- endcapture -%}
        {% assign project_keys = project_keys | split: ',' | sort | reverse %}
        {% assign ordered_projects = featured_projects %}
        {% for key in project_keys %}
            {% assign slug = key | split: '|' | last %}
            {% assign match = site.projects | where: 'slug', slug %}
            {% assign ordered_projects = ordered_projects | concat: match %}
        {% endfor %}
        {% for project in ordered_projects %}
        <article class="project-card">
            <a class="project-thumb" href="{{ project.url }}">
                {% if project.thumbnail %}
                {% include responsive-image.html src=project.thumbnail alt=project.title dither=true sizes="(max-width: 680px) 100vw, (max-width: 1008px) 50vw, 360px" %}
                {% else %}
                <span class="placeholder">{{ project.title }}</span>
                {% endif %}
            </a>
            <div class="project-body">
                <div class="project-card-metadata">
                    <span class="project-status {{ project.status | slugify }}">{{ project.status }}</span>
                    {% include project-years.html project=project %}
                </div>
                <h3><a href="{{ project.url }}">{{ project.title }}</a></h3>
                <p>{{ project.description }}</p>
                {% if project.tags and project.tags != empty %}
                <div class="tags">
                    {% for tag in project.tags limit:3 %}
                    {% include tag.html tag=tag %}
                    {% endfor %}
                </div>
                {% endif %}
            </div>
        </article>
        {% endfor %}
    </div>

    <section class="experiments-section" aria-labelledby="experiments-title">
        <h2 id="experiments-title">Experiments</h2>
        <ul class="experiments-grid">
            {% for experiment in site.data.experiments %}
            <li class="experiment-card">
                <h3><a href="{{ experiment.url | relative_url }}">{{ experiment.title | escape }}</a></h3>
                <p>{{ experiment.description | escape }}</p>
            </li>
            {% endfor %}
        </ul>
    </section>
</div>
