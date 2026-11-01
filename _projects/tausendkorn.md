---
layout: project
title: Tausendkorn
description: "Counting grain kernels from one phone photo, for thousand-kernel weight and the seed drill. Built by Team Goldpfanne at the Tausendkorn hackathon."
date: 2026-10-28
status: in development
featured: true
featured_order: 2
thumbnail: /assets/images/projects/tausendkorn-thumb.png
image: /assets/images/projects/tausendkorn-thumb.png
tags: [computer-vision, agriculture, ai, hackathon]
demo_url: https://goldpfanne-tausendkorn.pages.dev/
---

**Preliminary write-up.** I will replace this with the full post. These are the
results and lessons from the hackathon, as recorded on 29 October 2026.

## A handful of grain

Before sowing, a farm needs the thousand-kernel weight of its seed lot to set
the seed drill. Counting kernels by hand is part of that job. Our starting point
was a random handful from the sack, spread on white A4 paper, and one phone photo.
Count the kernels, add their weight and germination rate, then calculate the
seeding rate and the target weight for the drill's calibration test.

Team Goldpfanne was Leon Böhlau, me, and a fleet of AI agents. We built this at
the Tausendkorn hackathon of the Smart Farming Lab at Universität Leipzig,
27–28 October 2026, in about 30 hours.

## Count a handful at a time

A vision model miscounts a whole image but does much better with a handful of
kernels. The pipeline splits the photo into adaptive tiles, gives each tile a
halo so edge kernels remain whole, and asks the model for one point per kernel.
Seam merging assigns points on tile boundaries to one owner. Low-confidence
tiles get a second look at their numbered marks. If a tile fails, the pipeline
returns no count: a plausible partial result would silently over-seed the field.

The [pipeline explainer](https://goldpfanne-tausendkorn.pages.dev/pipeline/)
walks through the layers with real intermediate images.

## From photo to seed drill

The iPad field app connects to FastAPI on a laptop over Wi-Fi or a hotspot. It
shows the photo, the counted points and spots to check, then takes weight and
germination inputs to calculate thousand-kernel weight and kg/ha. It keeps a
history per lot and exports CSV. There is also a REST API and an MCP server;
paid counts need human approval in the app.

We trained a local YOLO11s as an independent second counter and compared it
offline. It was not part of the field app's measured vision-model pipeline.
The [pitch deck](https://goldpfanne-tausendkorn.pages.dev/pitch/) gives the short
version of the project.

## What we measured

We froze the pipeline before the final measurement. On a holdout of 30 photos
with 170–482 kernels, mean absolute error was 5.9 kernels, or 1.85 %. Those photos
came from the same capture days as training. On six photos from a different day,
with 1,000 kernels each and all five crops represented, MAE was 15.8 kernels,
or 1.58 %.

Counts cost $0.12–0.56 per holdout photo and $0.61–0.79 per different-day test
photo, and took 1–2 minutes. These are measured results on those samples.
Confidence was not calibrated, errors differed by crop, and two visible double
marks in our own iPad photo turned out to straddle tile seams. One durum sample
also left an unresolved question: both counters disagreed with its label, and
we kept scoring against the label.

## Brief others like yourself

One main session coordinated parallel lanes for the app, pitch, API, design,
GPU work and submission. Sol implemented; Astra reviewed every code PR; a human
merged. Cross-model review caught coordinate edge cases, ignored verification
edits, cost-accounting holes and order-dependent seam merging.

The fleet also drifted. Ownership changes did not reach everyone, and two lanes
launched the same implementer in one worktree. The golden rule was to brief
another agent the way you would want to be briefed: goal, why, current state,
decisions, constraints and done criteria. Fixed splits, a frozen pipeline and
recorded traces mattered more than another clever seam rule.
