---
title: Frame Weapons
order: 6
---

# Frame Weapons

*Complete list of available weapons for frame customization.*

## Weapon Categories
{% assign weapons = site.data.weapons %}

<div class="weapon-category">
    <h3>Melee Weapons</h3>
    <div class="weapon-list">
        <div class="weapon-item-row weapon-header">
            <div>Name</div>
            <div>Range</div>
            <div>Damage</div>
            <div>Type</div>
            <div>Tags</div>
            <div>Special</div>
            <div>HP</div>
        </div>
        {% for weapon in weapons %}
        {%- assign w = weapon[1] -%}
        {% if w.category == "Melee" %}
        <div class="weapon-item-row">
            <div class="weapon-name" data-label="Name">{{ w.name }}</div>
            <div class="weapon-range" data-label="Range">Melee</div>
            <div class="weapon-damage" data-label="Damage">{{ w.stats.damage }}</div>
            <div class="weapon-type" data-label="Type">{{ w.stats.damage_type | join: "/" }}</div>
            <div class="weapon-tags" data-label="Tags">
                {% for tag in w.tags %}
                <span class="tag-highlight" data-tag="{{ tag.name | downcase }}" {% if tag.value %}data-value="{{ tag.value }}"{% endif %}>{{ tag.name }}{% if tag.value %} {{ tag.value }}{% endif %}</span>
                {% endfor %}
            </div>
            <div class="weapon-special" data-label="Special">{{ w.special }}</div>
            <div class="weapon-hardpoints" data-label="HP">{{ w.hard_points }}</div>
        </div>
        {% endif %}
        {% endfor %}
    </div>
</div>

<div class="weapon-category">
    <h3>Ranged Weapons</h3>
    <div class="weapon-list">
        <div class="weapon-item-row weapon-header">
            <div>Name</div>
            <div>Range</div>
            <div>Damage</div>
            <div>Type</div>
            <div>Tags</div>
            <div>Special</div>
            <div>HP</div>
        </div>
        {% for weapon in weapons %}
        {%- assign w = weapon[1] -%}
        {% if w.category == "Ranged" %}
        <div class="weapon-item-row">
            <div class="weapon-name" data-label="Name">{{ w.name }}</div>
            <div class="weapon-range" data-label="Range">{{ w.stats.range }}</div>
            <div class="weapon-damage" data-label="Damage">{{ w.stats.damage }}</div>
            <div class="weapon-type" data-label="Type">{{ w.stats.damage_type | join: "/" }}</div>
            <div class="weapon-tags" data-label="Tags">
                {% for tag in w.tags %}
                <span class="tag-highlight" data-tag="{{ tag.name | downcase }}" {% if tag.value %}data-value="{{ tag.value }}"{% endif %}>{{ tag.name }}{% if tag.value %} {{ tag.value }}{% endif %}</span>
                {% endfor %}
            </div>
            <div class="weapon-special" data-label="Special">{{ w.special }}</div>
            <div class="weapon-hardpoints" data-label="HP">{{ w.hard_points }}</div>
        </div>
        {% endif %}
        {% endfor %}
    </div>
</div>

<div class="weapon-category">
    <h3>System Weapons</h3>
    <div class="weapon-list">
        <div class="weapon-item-row weapon-header">
            <div>Name</div>
            <div>Range</div>
            <div>Damage</div>
            <div>Type</div>
            <div>Tags</div>
            <div>Special</div>
            <div>HP</div>
        </div>
        {% for weapon in weapons %}
        {%- assign w = weapon[1] -%}
        {% if w.category == "Systems" %}
        <div class="weapon-item-row">
            <div class="weapon-name" data-label="Name">{{ w.name }}</div>
            <div class="weapon-range" data-label="Range">{{ w.stats.range }}</div>
            <div class="weapon-damage" data-label="Damage">{{ w.stats.damage }}</div>
            <div class="weapon-type" data-label="Type">{{ w.stats.damage_type | join: "/" }}</div>
            <div class="weapon-tags" data-label="Tags">
                {% for tag in w.tags %}
                <span class="tag-highlight" data-tag="{{ tag.name | downcase }}" {% if tag.value %}data-value="{{ tag.value }}"{% endif %}>{{ tag.name }}{% if tag.value %} {{ tag.value }}{% endif %}</span>
                {% endfor %}
            </div>
            <div class="weapon-special" data-label="Special">{{ w.special }}</div>
            <div class="weapon-hardpoints" data-label="HP">{{ w.hard_points }}</div>
        </div>
        {% endif %}
        {% endfor %}
    </div>
</div> 