---
layout: default
title: BabyToad's Portfolio
description: Personal website showcasing projects and skills
---

# Welcome to my Portfolio

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

## Skills
{% include skills.html %}

## Contact
{% include contact.html %}

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
