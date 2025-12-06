---
title: Tag Glossary
order: 13
---

# Tag Glossary

*Tags modify how weapons and systems function, creating unique tactical options.*

## Weapon Tags

<div class="tag-category">
    <h3>Combat Tags</h3>
    <div class="tag-list">
        {% for tag in site.data.tags.weapon_tags.combat %}
        {%- assign t = tag[1] -%}
        <div class="tag-entry" id="tag-{{ tag[0] }}">
            <div class="tag-name">{{ t.name }}</div>
            <div class="tag-description">{{ t.description }}</div>
            <div class="tag-example"><em>Example:</em> {{ t.example }}</div>
        </div>
        {% endfor %}
    </div>
</div>

<div class="tag-category">
    <h3>Area Effect Tags</h3>
    <div class="tag-list">
        {% for tag in site.data.tags.weapon_tags.area_effect %}
        {%- assign t = tag[1] -%}
        <div class="tag-entry" id="tag-{{ tag[0] }}">
            <div class="tag-name">{{ t.name }}</div>
            <div class="tag-description">{{ t.description }}</div>
            <div class="tag-example"><em>Example:</em> {{ t.example }}</div>
        </div>
        {% endfor %}
    </div>
</div>

<div class="tag-category">
    <h3>Special Effect Tags</h3>
    <div class="tag-list">
        {% for tag in site.data.tags.weapon_tags.special_effect %}
        {%- assign t = tag[1] -%}
        <div class="tag-entry" id="tag-{{ tag[0] }}">
            <div class="tag-name">{{ t.name }}</div>
            <div class="tag-description">{{ t.description }}</div>
            <div class="tag-example"><em>Example:</em> {{ t.example }}</div>
        </div>
        {% endfor %}
    </div>
</div>

## Fitting Tags

<div class="tag-category">
    <h3>Combat Tags</h3>
    <div class="tag-list">
        {% for tag in site.data.tags.fitting_tags.combat %}
        {%- assign t = tag[1] -%}
        <div class="tag-entry" id="tag-{{ tag[0] }}">
            <div class="tag-name">{{ t.name }}</div>
            <div class="tag-description">{{ t.description }}</div>
            <div class="tag-example"><em>Example:</em> {{ t.example }}</div>
        </div>
        {% endfor %}
    </div>
</div>

<div class="tag-category">
    <h3>Movement Tags</h3>
    <div class="tag-list">
        {% for tag in site.data.tags.fitting_tags.movement %}
        {%- assign t = tag[1] -%}
        <div class="tag-entry" id="tag-{{ tag[0] }}">
            <div class="tag-name">{{ t.name }}</div>
            <div class="tag-description">{{ t.description }}</div>
            <div class="tag-example"><em>Example:</em> {{ t.example }}</div>
        </div>
        {% endfor %}
    </div>
</div>

<div class="tag-category">
    <h3>Support Tags</h3>
    <div class="tag-list">
        {% for tag in site.data.tags.fitting_tags.support %}
        {%- assign t = tag[1] -%}
        <div class="tag-entry" id="tag-{{ tag[0] }}">
            <div class="tag-name">{{ t.name }}</div>
            <div class="tag-description">{{ t.description }}</div>
            <div class="tag-example"><em>Example:</em> {{ t.example }}</div>
        </div>
        {% endfor %}
    </div>
</div>

<div class="tag-category">
    <h3>System Tags</h3>
    <div class="tag-list">
        {% for tag in site.data.tags.fitting_tags.system %}
        {%- assign t = tag[1] -%}
        <div class="tag-entry" id="tag-{{ tag[0] }}">
            <div class="tag-name">{{ t.name }}</div>
            <div class="tag-description">{{ t.description }}</div>
            <div class="tag-example"><em>Example:</em> {{ t.example }}</div>
        </div>
        {% endfor %}
    </div>
</div>