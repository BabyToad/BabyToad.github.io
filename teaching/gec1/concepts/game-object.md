<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/game-object/ · Stand 2026-10-04T09:03Z · 033fe2a -->

# GameObject

Jedes Ding in einer Unity-Szene. Für sich allein leer; was es kann, bestimmen seine Komponenten.

Auch: GameObjects, Spielobjekt, Objekt

Verwandt: [component](https://www.allknivesnobagel.com/teaching/gec1/concepts/component/), [transform](https://www.allknivesnobagel.com/teaching/gec1/concepts/transform/), [prefab](https://www.allknivesnobagel.com/teaching/gec1/concepts/prefab/), [scene](https://www.allknivesnobagel.com/teaching/gec1/concepts/scene/)

Unity-Doku: https://docs.unity3d.com/Manual/GameObjects.html


## Kurz

Würfel, Kamera, Licht, Spielfigur, unsichtbarer Auslöser: In Unity ist alles davon ein GameObject. Sie stehen in der **Hierarchy**.

## Genauer

Ein GameObject ist ein Behälter mit Namen. Es hat immer eine Transform-[Component](https://www.allknivesnobagel.com/teaching/gec1/concepts/component/) (Position, Drehung, Größe). Alles andere kommt durch weitere Komponenten dazu: Ein Mesh Renderer macht es sichtbar, ein Collider macht es fest, ein Skript gibt ihm Verhalten.

GameObjects lassen sich ineinander verschachteln. Ein Kind bewegt sich mit seinem Elternobjekt mit.

## In Unity sehen

Ein Objekt in der Hierarchy auswählen: Der **Inspector** zeigt alle seine Komponenten untereinander.
