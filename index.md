---
layout: default
title: Steak Knives and Bagels
description: Personal website showcasing projects and skills
---

# Welcome to Steak Knives and Bagels

This site showcases my projects, skills, and interests. Feel free to explore and learn more about my work.

{% include about.html %}

## Projects
{% for project in site.projects %}
  <div class="project">
    <h3>{{ project.title }}</h3>
    <p>{{ project.description }}</p>
    <p><strong>Technologies:</strong> {{ project.technologies }}</p>
    <a href="{{ project.url }}">View Project</a>
  </div>
{% endfor %}

## Contact
<section id="contact" class="section">
    <div class="container">
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
    </div>
</section>

## Latest Blog Posts
<ul>
  {% for post in site.posts limit:5 %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
      <span class="post-date">{{ post.date | date: "%B %d, %Y" }}</span>
    </li>
  {% endfor %}
</ul>

---
<footer>
  <p>© {{ 'now' | date: "%Y" }} {{ site.author }}. All rights reserved.</p>
</footer> 