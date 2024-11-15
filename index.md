---
layout: default
title: Steak Knives and Bagels
description: Personal website showcasing projects and skills
---

<div class="main-content">
    {% include about.html %}

    <section class="projects-section">
        <h2>Projects</h2>
        {% for project in site.projects %}
            <div class="project">
                <h3>{{ project.title }}</h3>
                <p>{{ project.description }}</p>
                <p><strong>Technologies:</strong> {{ project.technologies }}</p>
                <a href="{{ project.url }}" class="project-link">View Project</a>
            </div>
        {% endfor %}
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

    <section class="blog-section">
        <h2>Latest Blog Posts</h2>
        <ul class="post-list">
            {% for post in site.posts limit:5 %}
                <li>
                    <a href="{{ post.url }}">{{ post.title }}</a>
                    <span class="post-date">{{ post.date | date: "%B %d, %Y" }}</span>
                </li>
            {% endfor %}
        </ul>
    </section>

    <footer>
        <p>© {{ 'now' | date: "%Y" }} {{ site.author }}. All rights reserved.</p>
    </footer>
</div> 