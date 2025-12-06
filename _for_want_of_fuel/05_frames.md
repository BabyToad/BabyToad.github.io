---
title: Frame Catalog
order: 5
---

# Frame Catalog

*A comprehensive catalog of available mech frames and their specifications.*

## Frame Classes

<div class="frame-note">
    <strong>Note:</strong> Pilots of suit‑class mechs may choose to take an attack's damage on their own HP. Suit‑class armor does not apply against Heavy‑class weapons. Light/Heavy mechs ignore non‑Heavy attacks.
</div>

{% assign frames = site.data.frames %}

<div class="frame-category">
    <h3>Light Frames</h3>
    <div class="frame-grid">
        {% for frame in frames %}
        {%- assign f = frame[1] -%}
        {% if f.class == "Light" %}
        <div class="frame-card">
            <div class="frame-header">
                <div class="frame-title">
                    <h4>{{ f.name }}</h4>
                    <span class="manufacturer">{{ f.manufacturer }}</span>
                </div>
                <div class="frame-class">{{ f.class }}</div>
            </div>
            <div class="frame-stats">
                <div class="stat-group">
                    <div class="stat">
                        <span class="stat-label">Speed</span>
                        <span class="stat-value">{{ f.stats.speed }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Armor</span>
                        <span class="stat-value">{{ f.stats.armor }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Hit Points</span>
                        <span class="stat-value">{{ f.stats.hp }}</span>
                    </div>
                </div>
                <div class="stat-group">
                    <div class="stat">
                        <span class="stat-label">AC</span>
                        <span class="stat-value">{{ f.stats.ac }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">HP</span>
                        <span class="stat-value">{{ f.stats.hard_points }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">SP</span>
                        <span class="stat-value">{{ f.stats.system_points }}</span>
                    </div>
                </div>
            </div>
            {% if f.special %}
            <div class="frame-special">
                <span class="special-label">Special:</span>
                {{ f.special }}
            </div>
            {% endif %}
        </div>
        {% endif %}
        {% endfor %}
    </div>
</div>

<div class="frame-category">
    <h3>Medium Frames</h3>
    <div class="frame-grid">
        {% for frame in frames %}
        {%- assign f = frame[1] -%}
        {% if f.class == "Medium" %}
        <div class="frame-card">
            <div class="frame-header">
                <div class="frame-title">
                    <h4>{{ f.name }}</h4>
                    <span class="manufacturer">{{ f.manufacturer }}</span>
                </div>
                <div class="frame-class">{{ f.class }}</div>
            </div>
            <div class="frame-stats">
                <div class="stat-group">
                    <div class="stat">
                        <span class="stat-label">Speed</span>
                        <span class="stat-value">{{ f.stats.speed }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Armor</span>
                        <span class="stat-value">{{ f.stats.armor }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Hit Points</span>
                        <span class="stat-value">{{ f.stats.hp }}</span>
                    </div>
                </div>
                <div class="stat-group">
                    <div class="stat">
                        <span class="stat-label">AC</span>
                        <span class="stat-value">{{ f.stats.ac }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">HP</span>
                        <span class="stat-value">{{ f.stats.hard_points }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">SP</span>
                        <span class="stat-value">{{ f.stats.system_points }}</span>
                    </div>
                </div>
            </div>
            {% if f.special %}
            <div class="frame-special">
                <span class="special-label">Special:</span>
                {{ f.special }}
            </div>
            {% endif %}
        </div>
        {% endif %}
        {% endfor %}
    </div>
</div>

<div class="frame-category">
    <h3>Heavy Frames</h3>
    <div class="frame-grid">
        {% for frame in frames %}
        {%- assign f = frame[1] -%}
        {% if f.class == "Heavy" %}
        <div class="frame-card">
            <div class="frame-header">
                <div class="frame-title">
                    <h4>{{ f.name }}</h4>
                    <span class="manufacturer">{{ f.manufacturer }}</span>
                </div>
                <div class="frame-class">{{ f.class }}</div>
            </div>
            <div class="frame-stats">
                <div class="stat-group">
                    <div class="stat">
                        <span class="stat-label">Speed</span>
                        <span class="stat-value">{{ f.stats.speed }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Armor</span>
                        <span class="stat-value">{{ f.stats.armor }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Hit Points</span>
                        <span class="stat-value">{{ f.stats.hp }}</span>
                    </div>
                </div>
                <div class="stat-group">
                    <div class="stat">
                        <span class="stat-label">AC</span>
                        <span class="stat-value">{{ f.stats.ac }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">HP</span>
                        <span class="stat-value">{{ f.stats.hard_points }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">SP</span>
                        <span class="stat-value">{{ f.stats.system_points }}</span>
                    </div>
                </div>
            </div>
            {% if f.special %}
            <div class="frame-special">
                <span class="special-label">Special:</span>
                {{ f.special }}
            </div>
            {% endif %}
        </div>
        {% endif %}
        {% endfor %}
    </div>
</div>

<div class="frame-category">
    <h3>Suit Frames</h3>
    <div class="frame-grid">
        {% for frame in frames %}
        {%- assign f = frame[1] -%}
        {% if f.class == "Suit" %}
        <div class="frame-card">
            <div class="frame-header">
                <div class="frame-title">
                    <h4>{{ f.name }}</h4>
                    <span class="manufacturer">{{ f.manufacturer }}</span>
                </div>
                <div class="frame-class">{{ f.class }}</div>
            </div>
            <div class="frame-stats">
                <div class="stat-group">
                    <div class="stat">
                        <span class="stat-label">Speed</span>
                        <span class="stat-value">{{ f.stats.speed }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Armor</span>
                        <span class="stat-value">{{ f.stats.armor }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Hit Points</span>
                        <span class="stat-value">{{ f.stats.hp }}</span>
                    </div>
                </div>
                <div class="stat-group">
                    <div class="stat">
                        <span class="stat-label">AC</span>
                        <span class="stat-value">{{ f.stats.ac }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">HP</span>
                        <span class="stat-value">{{ f.stats.hard_points }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">SP</span>
                        <span class="stat-value">{{ f.stats.system_points }}</span>
                    </div>
                </div>
            </div>
            {% if f.special %}
            <div class="frame-special">
                <span class="special-label">Special:</span>
                {{ f.special }}
            </div>
            {% endif %}
        </div>
        {% endif %}
        {% endfor %}
    </div>
</div> 