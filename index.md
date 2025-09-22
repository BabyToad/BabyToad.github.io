---
layout: base
title: Steak Knives and Bagels
description: Personal website showcasing projects and skills
---

<section class="intro-section">
    <p>Welcome, I am Jonas and this is my website.</p>
    <p>I write about roleplaying games, game design, and sometimes rationality. My work focuses on using games and interactive experiences as a way to clarify my own thinking about how people make choices.</p>
    
    <p>Here you'll find my projects in both digital and tabletop game development, essays on game design theory and rationality, and occasional thoughts on other topics that catch my interest.</p>
    
    <p>Below you can explore my projects, read my latest blog posts, or get in touch. Feel free to browse around - the site is organized into clear sections to help you find what interests you most.</p>
    <p></p>
</section>

<section class="recent-posts-section">
    <h2>Recent Posts</h2>
    <div class="posts-grid">
        {% assign recent_posts = site.blog | where: "visibility", "public" | sort: 'date' | reverse | limit:3 %}
        {% if recent_posts.size > 0 %}
            {% for post in recent_posts %}
            <div class="post-card">
                <div class="post-card-content">
                    <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
                    <time datetime="{{ post.date | date_to_xmlschema }}" class="post-date">
                        {{ post.date | date: "%B %d, %Y" }}
                    </time>
                    {% if post.description %}
                    <p>{{ post.description }}</p>
                    {% endif %}
                </div>
            </div>
            {% endfor %}
        {% else %}
            <p>No blog posts yet.</p>
        {% endif %}
    </div>
</section>

<section class="contact-section">
    <h2>Contact</h2>
    <div class="contact-links">
        <a href="https://github.com/babytoad" class="social-link">
            <i class="fab fa-github"></i> GitHub
        </a>
        <a href="https://linkedin.com/in/[your-profile]" class="social-link">
            <i class="fab fa-linkedin"></i> LinkedIn
        </a>
        <a href="https://discord.com/users/[your-discord-id]" class="social-link">
            <i class="fab fa-discord"></i> Discord
        </a>
    </div>
</section>

<footer>
    <p>© {{ 'now' | date: "%Y" }} {{ site.author }}. All rights reserved. That's boggle, baby.</p>
</footer> 