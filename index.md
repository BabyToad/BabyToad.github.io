---
layout: default
title: Steak Knives and Bagels
description: Personal website showcasing projects and skills
---

<div class="main-content">
    <section class="intro-section">
        <div class="container">
            <p>This is the website of Jonas Heinke. I write about roleplaying games, making things, and rationality. My work focuses on using games and interactive experiences as a way to clarify my own thinking about how people make choices.</p>
            
            <p>Here you'll find my projects in both digital and tabletop game development, essays on game design theory and rationality, and occasional thoughts on other topics that catch my interest.</p>
            
            <p>Below you can explore my projects, read my latest blog posts, or get in touch. Feel free to browse around - the site is organized into clear sections to help you find what interests you most.</p>
        </div>
    </section>
    
    <section class="projects-section">
        <h2>Projects</h2>
        <div class="projects-grid">
            {% for project in site.projects %}
            <div class="project-card">
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
</div> 