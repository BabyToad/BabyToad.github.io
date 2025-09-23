---
layout: post
title: "13 Notes on Half Life Alyx VR"
date: 2025-09-23
description: "Observations and design thoughts on VR design from playing Half Life Alyx. Notes on UI, interaction design, movement, and VR-specific game mechanics."
tags: [vr, game-design, half-life, alyx, ui, interaction-design, movement]
toc: true
visibility: public
---

You learn from the best, and the consensus is that Half Life Alyx is the first killer app for VR. Historically Valve expertise lies in executing the basics extremely well and that's also the case here.
Here are my notes, observations and design thoughts on VR design that I took from playing.

1. You are instantly in the game, in a scene with full movement controls. You can walk about be and be present. Only second and slowly does Title and UI unfurl and show.
2. Ghost hands are present when you lay down controllers. Neat. Additionally the game has a diegetic device, the Gravity Gloves that your character wears, so you always have a visual representation of the controllers.
3. The main non-diegetic UI is anchored in space by a subtle wall of floating dots or "matrix" artifacts. This helps with finding and grounding the UI in your peripheral vision.
4. The non-diegetic menus use multiple sub-menus that fold out. At some point you will have three menus next to each other like multiple screens. 
5. Indeed, you essentially have limitless screen real estate. It's like having a workplace with 3+ screens setup.
6. Your virtual hands collide with walls and animate correctly pressing against them. The immediate feedback feels good, makes object feel more solid and also immerses you more.
7. Throwing objects in VR will have you throw the controller. It's just instinctual. It is probably always worth it to include some UI warning, design affordance or just remind people to use the physical controller straps.
8. The game models heavy objects by requiring two hands to lift them. Just using one hands lifts the object for a moment, but then it starts to slip and then fall. A really simple way to convey weight.
9. Subtitles. They stick to the center of your view, but not doggedly. There is a slight delay before they reposition and then they slowly interpolate. Getting this right is really important to prevent disorientation and jittery UI.
10. Red and Yellow are the interaction colors. Actually, all pure primary colors. Most of the environment is flat, pale or mixed colors. But important or interactable objects are mono-colored primary colors and additionally have simple blocky geometry.
    This is really effective at setting Interaction apart. When you look for it it almost gets silly, but the UX upsides are worth it.
11. Using teleportation movement shows ghost feet at your target location, but it also when starts playing a animation of the ghost feet walking there. Neat.
    Mostly there for immersion. Does it add much? Probably not, but it does not hurt.
12. Finding the right position in front of a bigger object can be tough. You are too close, too far away, slightly offset, etc. Its hard to get it right with teleportation.
    Perhaps a subtle snapping to position mechanic could make things easier? Although you would limit some freedoms and immersion. And you would invite different positioning edge cases. Still probably worth exploring.
13. Walking long distances in VR sucks when using teleportation, because you cant look around. You have to always look were you are going, and don't really get to look around. That has you tunnel vision on locomotion and not really appreciate the environment. Which in turn makes sequences of 20+ seconds of traversal pretty boring and uninteractive.
    Walking just ain't it in VR as a load bearing game mechanic. Perhaps when you solve motion sickness from non teleportation it works better. That means that all designs that require walking, such as exploration, open world, Metroid Vania style back tracking, etc., also all suffer from downstream effects. They might be worth it but they will always struggle with a shoddy foundation.
