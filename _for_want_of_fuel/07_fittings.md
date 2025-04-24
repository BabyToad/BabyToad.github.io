---
title: Frame Fittings
order: 7
---

# Frame Fittings

*Complete list of available fittings for frame customization and enhancement.*

## Fitting Categories
{% assign fittings = site.data.fittings %}

<div class="fitting-category">
    <h3>Combat Fittings</h3>
    <div class="fitting-list">
        <div class="fitting-item-row fitting-header">
            <div>Name</div>
            <div>Effect</div>
            <div>SP</div>
        </div>
        {% for fitting in fittings %}
        {%- assign f = fitting[1] -%}
        {% if f.category == "Combat" %}
        <div class="fitting-item-row">
            <div class="fitting-name" data-label="Name">{{ f.name }}</div>
            <div class="fitting-effect" data-label="Effect">{{ f.effect }}</div>
            <div class="fitting-sp" data-label="SP">{{ f.system_points }}</div>
        </div>
        {% endif %}
        {% endfor %}
    </div>
</div>

<div class="fitting-category">
    <h3>Tactical Fittings</h3>
    <div class="fitting-list">
        <div class="fitting-item-row fitting-header">
            <div>Name</div>
            <div>Effect</div>
            <div>SP</div>
        </div>
        {% for fitting in fittings %}
        {%- assign f = fitting[1] -%}
        {% if f.category == "Tactical" %}
        <div class="fitting-item-row">
            <div class="fitting-name" data-label="Name">{{ f.name }}</div>
            <div class="fitting-effect" data-label="Effect">{{ f.effect }}</div>
            <div class="fitting-sp" data-label="SP">{{ f.system_points }}</div>
        </div>
        {% endif %}
        {% endfor %}
    </div>
</div>

<div class="fitting-category">
    <h3>Mobility Fittings</h3>
    <div class="fitting-list">
        <div class="fitting-item-row fitting-header">
            <div>Name</div>
            <div>Effect</div>
            <div>SP</div>
        </div>
        {% for fitting in fittings %}
        {%- assign f = fitting[1] -%}
        {% if f.category == "Mobility" %}
        <div class="fitting-item-row">
            <div class="fitting-name" data-label="Name">{{ f.name }}</div>
            <div class="fitting-effect" data-label="Effect">{{ f.effect }}</div>
            <div class="fitting-sp" data-label="SP">{{ f.system_points }}</div>
        </div>
        {% endif %}
        {% endfor %}
    </div>
</div>

<div class="fitting-category">
    <h3>Systems Fittings</h3>
    <div class="fitting-list">
        <div class="fitting-item-row fitting-header">
            <div>Name</div>
            <div>Effect</div>
            <div>SP</div>
        </div>
        {% for fitting in fittings %}
        {%- assign f = fitting[1] -%}
        {% if f.category == "Systems" %}
        <div class="fitting-item-row">
            <div class="fitting-name" data-label="Name">{{ f.name }}</div>
            <div class="fitting-effect" data-label="Effect">{{ f.effect }}</div>
            <div class="fitting-sp" data-label="SP">{{ f.system_points }}</div>
        </div>
        {% endif %}
        {% endfor %}
    </div>
</div>

<div class="fitting-category">
    <h3>Utility Fittings</h3>
    <div class="fitting-list">
        <div class="fitting-item-row fitting-header">
            <div>Name</div>
            <div>Effect</div>
            <div>SP</div>
        </div>
        {% for fitting in fittings %}
        {%- assign f = fitting[1] -%}
        {% if f.category == "Utility" %}
        <div class="fitting-item-row">
            <div class="fitting-name" data-label="Name">{{ f.name }}</div>
            <div class="fitting-effect" data-label="Effect">{{ f.effect }}</div>
            <div class="fitting-sp" data-label="SP">{{ f.system_points }}</div>
        </div>
        {% endif %}
        {% endfor %}
    </div>
</div>

<div class="fitting-category">
    <h3>General Fittings</h3>
    <div class="fitting-list">
        <div class="fitting-item-row fitting-header">
            <div>Name</div>
            <div>Effect</div>
            <div>SP</div>
        </div>
        {% for fitting in fittings %}
        {%- assign f = fitting[1] -%}
        {% if f.category == "General" %}
        <div class="fitting-item-row">
            <div class="fitting-name" data-label="Name">{{ f.name }}</div>
            <div class="fitting-effect" data-label="Effect">{{ f.effect }}</div>
            <div class="fitting-sp" data-label="SP">{{ f.system_points }}</div>
        </div>
        {% endif %}
        {% endfor %}
    </div>
</div>

<div class="fitting-category">
    <h3>Drone Fittings</h3>
    <div class="fitting-list">
        <div class="fitting-item-row fitting-header">
            <div>Name</div>
            <div>Effect</div>
            <div>SP</div>
        </div>
        {% for fitting in fittings %}
        {%- assign f = fitting[1] -%}
        {% if f.category == "Drone" %}
        <div class="fitting-item-row">
            <div class="fitting-name" data-label="Name">{{ f.name }}</div>
            <div class="fitting-effect" data-label="Effect">{{ f.effect }}</div>
            <div class="fitting-sp" data-label="SP">{{ f.system_points }}</div>
        </div>
        {% endif %}
        {% endfor %}
    </div>
</div> 